import request from "supertest";

import { app } from "../src/app.js";

let token = "";

beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
        email: "teacher@edufuture.local",
        password: "Password123!",
    });
    token = res.body.accessToken;
});

describe("Courses API", () => {
    let courseId = "";

    it("lists courses (student)", async () => {
        const loginRes = await request(app).post("/api/auth/login").send({
            email: "student@edufuture.local",
            password: "Password123!",
        });
        const res = await request(app)
            .get("/api/courses")
            .set("Authorization", `Bearer ${loginRes.body.accessToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("creates a course (teacher)", async () => {
        const res = await request(app)
            .post("/api/courses")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Course", description: "A test course" });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        courseId = res.body.id;
    });

    it("gets a single course", async () => {
        const res = await request(app)
            .get(`/api/courses/${courseId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Test Course");
    });

    it("updates a course", async () => {
        const res = await request(app)
            .patch(`/api/courses/${courseId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Course" });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("Updated Course");
    });

    it("gets teacher stats", async () => {
        const res = await request(app)
            .get("/api/courses/teacher/stats")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("totalCourses");
    });

    it("deletes a course", async () => {
        const res = await request(app)
            .delete(`/api/courses/${courseId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(204);
    });
});
