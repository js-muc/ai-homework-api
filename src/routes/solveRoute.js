const express = require("express");
const router = express.Router();
const { solve } = require("../controllers/solveController");

/**
 * @route  POST /api/solve
 * @desc   Submit a homework question and receive an AI-generated answer
 * @access Public
 * @body   { question: string }
 */
router.post("/solve", solve);

module.exports = router;
