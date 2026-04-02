import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

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
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation error",
            errors: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
        });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(409).json({ message: "Resource already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
}
