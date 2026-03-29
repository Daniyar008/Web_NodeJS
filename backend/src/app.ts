import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { authRouter } from "./features/auth/auth.routes.js";
import { courseRouter } from "./features/course/course.routes.js";
import { institutionRouter } from "./features/institution/institution.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { healthRouter } from "./routes/health.routes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env["FRONTEND_URL"] ?? "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/institutions", institutionRouter);
app.use("/api/courses", courseRouter);

// Must be last — catches all errors from route handlers.
app.use(errorHandler);
