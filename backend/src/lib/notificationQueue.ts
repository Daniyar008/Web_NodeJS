import { Queue, Worker } from "bullmq";

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

function getRedisConnection() {
  const url = process.env["REDIS_URL"] ?? "redis://localhost:6379";
  return { url, maxRetriesPerRequest: null };
}

export function initNotificationQueue(): void {
  try {
    const connection = getRedisConnection();
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

  await notificationQueue.add("deliver", job, { removeOnComplete: true, removeOnFail: 50 });
}
