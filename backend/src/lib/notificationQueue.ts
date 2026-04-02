import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

import { env } from "../config/env.js";
import { prisma } from "./prisma.js";
import { getIO } from "./socket.js";

type NotificationJob = {
  notificationId: string;
  userId: string;
  title: string;
  body: string;
  link?: string;
};

let notificationQueue: Queue<NotificationJob> | null = null;
let notificationWorker: Worker<NotificationJob> | null = null;

export async function initNotificationQueue(): Promise<void> {
  const url = process.env["REDIS_URL"] ?? "redis://localhost:6379";

  // Probe Redis before creating BullMQ workers
  const probe = new Redis(url, { lazyConnect: true, enableOfflineQueue: false });
  probe.on("error", () => { /* suppress unhandled error event */ });
  try {
    await probe.connect();
    await probe.ping();
    await probe.quit();
  } catch {
    console.warn("Redis unavailable — notification queue disabled (in-process fallback)");
    try { await probe.disconnect(); } catch { /* ignore */ }
    return;
  }

  try {
    const connection = { url, maxRetriesPerRequest: null };
    notificationQueue = new Queue<NotificationJob>("notifications", { connection });
    notificationWorker = new Worker<NotificationJob>(
      "notifications",
      async (job) => {
        await prisma.notification.update({
          where: { id: job.data.notificationId },
          data: { deliveredAt: new Date() },
        });

        try {
          getIO().to(`user:${job.data.userId}`).emit("notification:new", {
            id: job.data.notificationId,
            title: job.data.title,
            body: job.data.body,
            link: job.data.link ?? null,
            createdAt: new Date().toISOString(),
          });
        } catch {
          // Socket.io may not be initialised in tests.
        }

        if (env.NODE_ENV !== "test") {
          console.log(`[notification] ${job.data.userId}: ${job.data.title}`);
        }
      },
      { connection }
    );
  } catch {
    notificationQueue = null;
    notificationWorker = null;
  }
}

export async function enqueueNotification(job: NotificationJob): Promise<void> {
  if (!notificationQueue) {
    await prisma.notification.update({
      where: { id: job.notificationId },
      data: { deliveredAt: new Date() },
    }).catch(() => undefined);

    try {
      getIO().to(`user:${job.userId}`).emit("notification:new", {
        id: job.notificationId,
        title: job.title,
        body: job.body,
        link: job.link ?? null,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // Ignore if sockets are unavailable.
    }
    return;
  }

  try {
    await Promise.race([
      notificationQueue.add("deliver", job, { removeOnComplete: true, removeOnFail: 50 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Queue timeout")), 3000)),
    ]);
  } catch {
    // Redis unreachable – fall through to in-process delivery.
    await prisma.notification.update({
      where: { id: job.notificationId },
      data: { deliveredAt: new Date() },
    }).catch(() => undefined);

    try {
      getIO().to(`user:${job.userId}`).emit("notification:new", {
        id: job.notificationId,
        title: job.title,
        body: job.body,
        link: job.link ?? null,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // Ignore if sockets are unavailable.
    }
  }
}
