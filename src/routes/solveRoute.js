// src/routes/solveRoute.js
const express = require('express');
const { handleSolve } = require('../controllers/solveController');

const router = express.Router();

// POST /api/solve
router.post('/solve', handleSolve);

module.exports = router;
