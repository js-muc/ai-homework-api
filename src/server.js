require("dotenv").config();
const express = require("express");
const helmet = require("helmet");

const app = express();

// Security headers
app.use(helmet());

// Body parsing
app.use(express.json());

// Routes
const solveRoute = require("./routes/solveRoute");
app.use("/api", solveRoute);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "AI Homework API Running" });
});

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
