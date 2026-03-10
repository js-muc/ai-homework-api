// src/controllers/solveController.js
const { solveQuestion } = require('../services/solveService');

async function handleSolve(req, res, next) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required and must be a string' });
    }

    const trimmed = question.trim();
    const result = await solveQuestion(trimmed);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { handleSolve };
