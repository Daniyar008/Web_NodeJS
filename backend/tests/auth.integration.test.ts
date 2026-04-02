import request from "supertest";
import crypto from "node:crypto";

import { app } from "../src/app.js";

// Use seed accounts for all tests except register
const SEED_EMAIL = "student@edufuture.local";
const SEED_PASSWORD = "Password123!";

describe("Auth API", () => {
    it("registers a new user", async () => {
        const email = `test-${crypto.randomUUID()}@test.local`;
        const res = await request(app).post("/api/auth/register").send({
            email,
            password: "TestPassword123!",
            firstName: "Test",
            lastName: "User",
            roleName: "STUDENT",
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });

    it("rejects duplicate registration", async () => {
        const res = await request(app).post("/api/auth/register").send({
            email: SEED_EMAIL,
            password: SEED_PASSWORD,
            firstName: "Test",
            lastName: "User",
            roleName: "STUDENT",
        });
        expect(res.status).toBe(409);
    });

    it("logs in with valid credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: SEED_EMAIL, password: SEED_PASSWORD });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });

    it("rejects login with wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: SEED_EMAIL, password: "wrong" });
        expect(res.status).toBe(401);
    });

    it("refreshes token", async () => {
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({ email: SEED_EMAIL, password: SEED_PASSWORD });
        expect(loginRes.status).toBe(200);
        const res = await request(app)
            .post("/api/auth/refresh")
            .send({ refreshToken: loginRes.body.refreshToken });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });

    it("returns profile with valid token", async () => {
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({ email: SEED_EMAIL, password: SEED_PASSWORD });
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${loginRes.body.accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.email).toBe(SEED_EMAIL);
    });
});
