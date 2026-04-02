import request from "supertest";

import { app } from "../src/app.js";

let studentToken = "";

beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
        email: "student@edufuture.local",
        password: "Password123!",
    });
    studentToken = res.body.accessToken;
});

describe("Student API", () => {
    it("gets student profile", async () => {
        const res = await request(app)
            .get("/api/student/me")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
    });

    it("lists available courses", async () => {
        const res = await request(app)
            .get("/api/student/courses/available")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("lists enrolled courses", async () => {
        const res = await request(app)
            .get("/api/student/courses/enrolled")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("gets achievements", async () => {
        const res = await request(app)
            .get("/api/student/achievements")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
    });
});

describe("Payments API (authenticated)", () => {
    it("lists plans", async () => {
        const res = await request(app)
            .get("/api/payments/plans")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("gets subscription status", async () => {
        const res = await request(app)
            .get("/api/payments/subscription")
            .set("Authorization", `Bearer ${studentToken}`);
        // 200 with subscription or null
        expect(res.status).toBe(200);
    });

    it("gets billing access", async () => {
        const res = await request(app)
            .get("/api/payments/access")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("hasActiveSubscription");
    });

    it("lists marketplace courses", async () => {
        const res = await request(app)
            .get("/api/payments/marketplace")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("creates subscription checkout (mock)", async () => {
        const res = await request(app)
            .post("/api/payments/checkout/subscription")
            .set("Authorization", `Bearer ${studentToken}`)
            .send({ planId: "plan_pro_monthly" });
        expect(res.status).toBe(201);
        expect(res.body.provider).toBe("mock");
    });
});

describe("Chat API", () => {
    it("lists chat threads", async () => {
        const res = await request(app)
            .get("/api/chat/chats")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe("Notifications API", () => {
    it("lists notifications", async () => {
        const res = await request(app)
            .get("/api/notifications")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("gets unread count", async () => {
        const res = await request(app)
            .get("/api/notifications/unread-count")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("count");
    });
});

describe("Tasks API", () => {
    it("lists tasks", async () => {
        const res = await request(app)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe("Tournaments API", () => {
    it("lists tournaments", async () => {
        const res = await request(app)
            .get("/api/tournaments")
            .set("Authorization", `Bearer ${studentToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
