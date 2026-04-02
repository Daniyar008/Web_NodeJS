import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { env } from "../config/env.js";

export type AccessTokenPayload = {
    sub: string; // userId
    role: string;
    email: string;
};

export type RefreshTokenPayload = {
    sub: string; // userId
};

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign({ ...payload, jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
