import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { aiRouter } from "./features/ai/ai.routes.js";
import { authRouter } from "./features/auth/auth.routes.js";
import { chatRouter } from "./features/chat/chat.routes.js";
import { courseRouter } from "./features/course/course.routes.js";
import { institutionRouter } from "./features/institution/institution.routes.js";
import { notificationRouter } from "./features/notification/notification.routes.js";
import { parentRouter } from "./features/parent/parent.routes.js";
import { paymentRouter } from "./features/payment/payment.routes.js";
import { studentRouter } from "./features/student/student.routes.js";
import { taskRouter } from "./features/task/task.routes.js";
import { tournamentRouter } from "./features/tournament/tournament.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { docsRouter } from "./routes/docs.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
    origin: process.env["NODE_ENV"] === "production"
        ? process.env["FRONTEND_URL"]!
        : [process.env["FRONTEND_URL"] ?? "http://localhost:5173", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads")));

app.use("/api", healthRouter);
app.use("/api", docsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/institutions", institutionRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/courses", courseRouter);
app.use("/api/student", studentRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/tournaments", tournamentRouter);
app.use("/api/parent", parentRouter);
app.use("/api/uploads", uploadRouter);

// Must be last — catches all errors from route handlers.
app.use(errorHandler);
