import request from "supertest";

import { app } from "../src/app";

describe("Payments authorization", () => {
    it("rejects unauthenticated access to plans", async () => {
        const response = await request(app).get("/api/payments/plans");
        expect(response.status).toBe(401);
    });

    it("rejects unauthenticated access to marketplace", async () => {
        const response = await request(app).get("/api/payments/marketplace");
        expect(response.status).toBe(401);
    });
});
