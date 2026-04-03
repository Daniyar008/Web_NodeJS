import { Router } from "express";

import { ApiError } from "../../lib/apiError.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import * as authService from "./auth.service.js";
import {
    forgotPasswordSchema,
    loginSchema,
    refreshSchema,
    registerSchema,
    resetPasswordSchema,
} from "./auth.schema.js";

export const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", async (req, res, next) => {
    try {
        const body = registerSchema.safeParse(req.body);
        if (!body.success) {
            return next(ApiError.badRequest(body.error.issues[0]?.message ?? "Validation error"));
        }
        const tokens = await authService.register(body.data);
        return res.status(201).json(tokens);
    } catch (err) {
        return next(err);
    }
});

// POST /api/auth/login
authRouter.post("/login", async (req, res, next) => {
    try {
        const body = loginSchema.safeParse(req.body);
        if (!body.success) {
            return next(ApiError.badRequest(body.error.issues[0]?.message ?? "Validation error"));
        }
        const tokens = await authService.login(body.data);
        return res.status(200).json(tokens);
    } catch (err) {
        return next(err);
    }
});

// POST /api/auth/refresh
authRouter.post("/refresh", async (req, res, next) => {
    try {
        const body = refreshSchema.safeParse(req.body);
        if (!body.success) {
            return next(ApiError.badRequest("refreshToken is required"));
        }
        const tokens = await authService.refresh(body.data.refreshToken);
        return res.status(200).json(tokens);
    } catch (err) {
        return next(err);
    }
});

// POST /api/auth/logout
authRouter.post("/logout", async (req, res, next) => {
    try {
        const body = refreshSchema.safeParse(req.body);
        if (body.success) await authService.logout(body.data.refreshToken);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
});

// GET /api/auth/me
authRouter.get("/me", requireAuth, (req, res) => {
    return res.status(200).json(res.locals["auth"]);
});

// POST /api/auth/forgot-password
authRouter.post("/forgot-password", async (req, res, next) => {
    try {
        const body = forgotPasswordSchema.safeParse(req.body);
        if (!body.success) {
            return next(ApiError.badRequest(body.error.issues[0]?.message ?? "Validation error"));
        }
        const result = await authService.forgotPassword(body.data.email);
        return res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
});

// POST /api/auth/reset-password
authRouter.post("/reset-password", async (req, res, next) => {
    try {
        const body = resetPasswordSchema.safeParse(req.body);
        if (!body.success) {
            return next(ApiError.badRequest(body.error.issues[0]?.message ?? "Validation error"));
        }
        const result = await authService.resetPassword(body.data.token, body.data.password);
        return res.status(200).json(result);
    } catch (err) {
        return next(err);
    }
});
