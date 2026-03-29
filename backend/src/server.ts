import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
    // Keep startup log concise and deterministic for local debugging.
    console.log(`Backend API started on http://localhost:${env.PORT}`);
});
