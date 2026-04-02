import { createServer } from "http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { initNotificationQueue } from "./lib/notificationQueue.js";
import { initRedis } from "./lib/redis.js";
import { initSocket } from "./lib/socket.js";

const httpServer = createServer(app);
initSocket(httpServer);
initRedis();
await initNotificationQueue();

httpServer.listen(env.PORT, () => {
    console.log(`Backend API started on http://localhost:${env.PORT}`);
});
