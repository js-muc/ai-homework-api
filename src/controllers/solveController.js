const { solveQuestion } = require("../services/solveService");

/**
 * POST /api/solve
 * Accepts a { question } body and returns an AI-generated answer.
 */
async function solve(req, res, next) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return res.status(400).json({
        error: "question is required and must be a non-empty string",
      });
    }

    const answer = await solveQuestion(question.trim());

    return res.status(200).json({ question: question.trim(), answer });
  } catch (err) {
    next(err);
  }
}

module.exports = { solve };
