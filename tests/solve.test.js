const request = require("supertest");
const app = require("../src/server");

describe("POST /api/solve", () => {
  it("returns 200 with a question and answer when a valid question is provided", async () => {
    const res = await request(app)
      .post("/api/solve")
      .send({ question: "What is 2 + 2?" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("question", "What is 2 + 2?");
    expect(res.body).toHaveProperty("answer");
    expect(typeof res.body.answer).toBe("string");
  });

  it("returns 400 when question is missing", async () => {
    const res = await request(app).post("/api/solve").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when question is an empty string", async () => {
    const res = await request(app).post("/api/solve").send({ question: "   " });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when question is not a string", async () => {
    const res = await request(app).post("/api/solve").send({ question: 42 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /health", () => {
  it("returns health check response", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});

describe("Unknown routes", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown-route");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
