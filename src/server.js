require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const app = express();

// Security headers (before static so all responses are covered)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:  ["'self'"],
        styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc:    ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'"],
        imgSrc:     ["'self'", "data:"],
      },
    },
  })
);

// Body parsing
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Homework API Running" });
});

// Routes
const solveRoute = require("./routes/solveRoute");
app.use("/api", solveRoute);

// Static UI (mounted after API routes so GET / is not shadowed by index.html)
app.use(express.static("public"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly (not during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
