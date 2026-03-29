import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { healthRouter } from "./routes/health.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRouter);
