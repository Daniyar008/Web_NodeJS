import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { openapiDocument } from "../docs/openapi.js";

export const docsRouter = Router();

docsRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
