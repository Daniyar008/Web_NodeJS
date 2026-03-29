import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../lib/apiError.js";
import { verifyAccessToken } from "../lib/jwt.js";

export type AuthLocals = {
    userId: string;
    role: string;
    email: string;
};

// Extend Express locals type locally so callers can use res.locals.auth safely.
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Locals {
            auth?: AuthLocals;
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(ApiError.unauthorized("Missing or malformed Authorization header"));
    }
    const token = header.slice(7);
    try {
        const payload = verifyAccessToken(token);
        res.locals["auth"] = {
            userId: payload.sub,
            role: payload.role,
            email: payload.email,
        };
        return next();
    } catch {
        return next(ApiError.unauthorized("Invalid or expired access token"));
    }
}

export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const auth = res.locals["auth"] as AuthLocals | undefined;
        if (!auth) return next(ApiError.unauthorized());
        if (!roles.includes(auth.role)) {
            return next(ApiError.forbidden("Insufficient permissions"));
        }
        return next();
    };
}
