# AI Homework API

A REST API that accepts homework questions and returns AI-generated answers.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
npm install
```

Copy the environment example and fill in your values:

```bash
cp .env.example .env
```

### Running the Server

```bash
# Production
npm start

# Development (with auto-restart via nodemon)
npm run dev
```

The server starts on `http://localhost:3000` by default (configurable via the `PORT` env variable).

---

## API Reference

### `GET /`

Health check.

**Response**
```json
{ "status": "ok", "message": "AI Homework API Running" }
```

---

### `POST /api/solve`

Submit a homework question and receive an AI-generated answer.

**Request Body**
```json
{
  "question": "What is the Pythagorean theorem?"
}
```

**Success Response** `200 OK`
```json
{
  "question": "What is the Pythagorean theorem?",
  "answer": "The Pythagorean theorem states that..."
}
```

**Error Response** `400 Bad Request`
```json
{
  "error": "question is required and must be a non-empty string"
}
```

---

## Development

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

---

## Project Structure

```
src/
  server.js              # Express app entry point
  routes/
    solveRoute.js        # Route definitions
  controllers/
    solveController.js   # HTTP request/response handling
  services/
    solveService.js      # Business logic / AI integration
tests/
  solve.test.js          # Integration tests
```

## Adding an AI Provider

Edit [`src/services/solveService.js`](src/services/solveService.js) and replace the stub in `solveQuestion()` with a real AI API call (e.g. OpenAI, Google Gemini). Store your API key in `.env`.
