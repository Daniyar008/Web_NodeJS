import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
    // Keep startup log concise and deterministic for local debugging.
    console.log(`Backend API started on http://localhost:${env.PORT}`);
});
