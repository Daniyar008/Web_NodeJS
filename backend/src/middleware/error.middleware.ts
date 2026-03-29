import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../lib/apiError.js";

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    // next must be declared even if unused for Express to treat this as error handler.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
}
