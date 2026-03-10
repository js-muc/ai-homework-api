// src/services/solveService.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function solveQuestion(question) {
  if (!question || typeof question !== "string") {
    throw new Error("Invalid question");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI tutor. Provide the answer AND show step-by-step working clearly.",
        },
        { role: "user", content: question },
      ],
      temperature: 0.2,
      max_tokens: 400,
    });

    const content = response.choices[0].message.content.trim();

    // Optional: split answer & working if AI separates by newlines
    const lines = content.split("\n\n");
    const answer = lines[0] || content;
    const working = lines.slice(1).join("\n\n") || "No steps provided";

    return { question, answer, working };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { solveQuestion };