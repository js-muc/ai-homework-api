/* =======================================================================
   CHALKBOARD CANVAS BACKGROUND
   ======================================================================= */
(function () {
  var canvas = document.getElementById('bg');
  var ctx    = canvas.getContext('2d');
  var W, H, mouse = { x: -9999, y: -9999 };

  /* All symbols via JS unicode escapes -- no raw multi-byte chars */
  var SYMS = [
    '\u03A3', '\u222B', '\u03C0', '\u221A', '\u221E', '\u0394',
    '\u2260', '\u2264', '\u2265', '\u03B1', '\u03B2', '\u03B3',
    '\u03B8', '\u03BB', '\u03BC', '\u03C3', '\u03C6', '\u03C9',
    '\u2202', '\u2207', '\u2245', '\u2261', '\u2229', '\u222A',
    'F=ma', 'PV=nRT', 'y=mx+b',
    'a\u00B2+b\u00B2=c\u00B2',
    'E=mc\u00B2',
    '\u222Bf\u00B7dx',
    'lim\u2192\u221E',
    '\u0394S\u22650',
    'e^{i\u03C0}+1=0',
    '\u03C0r\u00B2',
    'sin\u00B2\u03B8+cos\u00B2\u03B8=1',
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function mkParticles(n) {
    return Array.from({ length: n }, function () {
      return {
        x:    rand(0, W),
        y:    rand(0, H),
        vx:   rand(-0.18, 0.18),
        vy:   rand(-0.12, 0.12),
        size: rand(11, 26),
        alpha:rand(0.04, 0.22),
        sym:  SYMS[Math.floor(Math.random() * SYMS.length)],
        rot:  rand(-0.4, 0.4),
        rotV: rand(-0.003, 0.003),
      };
    });
  }

  var particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = mkParticles(Math.min(70, Math.floor((W * H) / 18000)));
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth   = 1;
    var step = 48;
    for (var x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function frame() {
    /* Chalkboard gradient */
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0,   '#14351f');
    g.addColorStop(0.5, '#1c4a2e');
    g.addColorStop(1,   '#122b1c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Vignette */
    var v = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, H*0.8);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);

    drawGrid();

    for (var i = 0; i < particles.length; i++) {
      var p  = particles[i];
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var d  = Math.sqrt(dx * dx + dy * dy);

      /* Mouse repulsion */
      if (d < 140 && d > 0) {
        var f = (140 - d) / 140;
        p.vx += (dx / d) * f * 0.12;
        p.vy += (dy / d) * f * 0.12;
      }

      /* Dampen & clamp */
      p.vx *= 0.99; p.vy *= 0.99;
      var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 1.2) { p.vx = p.vx / spd * 1.2; p.vy = p.vy / spd * 1.2; }

      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;

      /* Wrap edges */
      if (p.x < -60)  p.x = W + 60;
      if (p.x > W+60) p.x = -60;
      if (p.y < -60)  p.y = H + 60;
      if (p.y > H+60) p.y = -60;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha  = p.alpha;
      ctx.fillStyle    = '#e8faf0';
      ctx.font         = p.size + 'px "JetBrains Mono", monospace';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.sym, 0, 0);
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('touchmove', function (e) {
    if (e.touches.length) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
  }, { passive: true });

  resize();
  frame();
})();


/* =======================================================================
   CHARACTER COUNTER
   ======================================================================= */
var textarea  = document.getElementById('question');
var charCount = document.getElementById('charCount');
var MAX_LEN   = 2000;

textarea.addEventListener('input', function () {
  var len = textarea.value.length;
  charCount.textContent = len + ' / ' + MAX_LEN;
  charCount.className = 'char-count' +
    (len >= MAX_LEN ? ' over' : len >= MAX_LEN * 0.85 ? ' near' : '');
});

/* Submit on Ctrl+Enter / Cmd+Enter */
textarea.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') askQuestion();
});


/* =======================================================================
   ALERT HELPERS
   ======================================================================= */
function showAlert(msg) {
  var el = document.getElementById('alert');
  document.getElementById('alertMsg').textContent = msg;
  el.classList.add('show');
}

function hideAlert() {
  document.getElementById('alert').classList.remove('show');
}


/* =======================================================================
   COPY TO CLIPBOARD
   ======================================================================= */
function copyText(id) {
  var el  = document.getElementById(id);
  var btn = el.closest('.result-block').querySelector('.copy-btn');
  navigator.clipboard.writeText(el.textContent).then(function () {
    btn.textContent = '\u2713 Copied';
    setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
  }).catch(function () {
    btn.textContent = 'Failed';
    setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
  });
}


/* =======================================================================
   SKELETON LOADING STATE
   ======================================================================= */
function showSkeleton() {
  document.getElementById('results').style.display = 'flex';
  document.getElementById('answerContent').innerHTML =
    '<div class="skeleton" style="height:16px;margin-bottom:8px"></div>' +
    '<div class="skeleton" style="height:16px;width:75%"></div>';
  document.getElementById('workingContent').innerHTML =
    '<div class="skeleton" style="height:12px;margin-bottom:8px"></div>' +
    '<div class="skeleton" style="height:12px;width:85%;margin-bottom:8px"></div>' +
    '<div class="skeleton" style="height:12px;width:60%"></div>';
}


/* =======================================================================
   RESTORE BUTTON TO DEFAULT STATE
   ======================================================================= */
var ICON_SVG =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"' +
  ' style="display:inline;vertical-align:-2px;margin-right:5px">' +
  '<path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="#052e16"/>' +
  '<path d="M5 15l.75 2.25L8 18l-2.25.75L5 21l-.75-2.25L2 18l2.25-.75L5 15z" fill="#052e16"/>' +
  '<path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z" fill="#052e16"/>' +
  '</svg>Solve Question';

function resetBtn(btn) {
  btn.disabled = false;
  btn.classList.remove('loading');
  btn.querySelector('.btn-text').innerHTML = ICON_SVG;
}


/* =======================================================================
   BUTTON EVENT WIRING
   ======================================================================= */
document.getElementById('submitBtn').addEventListener('click', function () { askQuestion(); });
document.getElementById('copyAnswer').addEventListener('click', function () { copyText('answerContent'); });
document.getElementById('copyWorking').addEventListener('click', function () { copyText('workingContent'); });


/* =======================================================================
   MAIN API CALL
   ======================================================================= */
function askQuestion() {
  var question = textarea.value.trim();
  var btn      = document.getElementById('submitBtn');

  hideAlert();

  if (!question) {
    showAlert('Please enter a question before submitting.');
    textarea.focus();
    return;
  }

  if (question.length > MAX_LEN) {
    showAlert('Your question is too long. Please keep it under ' + MAX_LEN + ' characters.');
    return;
  }

  /* Loading state */
  btn.disabled = true;
  btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent = 'Solving\u2026';
  showSkeleton();

  fetch('/api/solve', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ question: question }),
  })
  .then(function (res) {
    return res.json().then(function (data) {
      if (!res.ok) throw new Error(data.error || 'Server error (' + res.status + ')');
      return data;
    });
  })
  .then(function (data) {
    var answerContent  = document.getElementById('answerContent');
    var workingContent = document.getElementById('workingContent');
    var workingBlock   = document.getElementById('workingBlock');

    answerContent.textContent  = data.answer  || 'No answer received.';
    workingContent.textContent = data.working || '';
    workingBlock.style.display = data.working ? '' : 'none';
  })
  .catch(function (err) {
    document.getElementById('results').style.display = 'none';
    showAlert(err.message || 'Something went wrong. Please try again.');
  })
  .finally(function () {
    resetBtn(btn);
  });
}
