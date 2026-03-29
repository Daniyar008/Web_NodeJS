import request from "supertest";

import { app } from "../src/app";

describe("GET /api/health", () => {
    it("returns service health payload", async () => {
        const response = await request(app).get("/api/health");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true, service: "edufuture-backend" });
    });
});
