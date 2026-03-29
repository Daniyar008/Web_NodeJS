import { prisma } from "../../lib/prisma.js";
import { enqueueNotification } from "../../lib/notificationQueue.js";
import { ApiError } from "../../lib/apiError.js";
import type { NotificationQueryDto, UpdatePreferenceDto } from "./notification.schema.js";

function clean<T extends object>(obj: T): any {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as any;
}

export async function ensureNotificationPreference(userId: string) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function listNotifications(userId: string, query: NotificationQueryDto) {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(query.unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: query.limit,
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw ApiError.notFound("Notification not found");
  if (notification.userId !== userId) throw ApiError.forbidden("Not your notification");

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

export async function getNotificationPreference(userId: string) {
  return ensureNotificationPreference(userId);
}

export async function updateNotificationPreference(userId: string, dto: UpdatePreferenceDto) {
  await ensureNotificationPreference(userId);
  return prisma.notificationPreference.update({
    where: { userId },
    data: clean(dto),
  });
}

export async function createNotification(input: {
  userId: string;
  title: string;
  body: string;
  type?: "CHAT_MESSAGE" | "ASSIGNMENT" | "TOURNAMENT" | "SYSTEM";
  link?: string;
}) {
  const preference = await ensureNotificationPreference(input.userId);
  if (!preference.inAppEnabled) return null;

  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      body: input.body,
      type: input.type ?? "SYSTEM",
      ...(input.link !== undefined ? { link: input.link } : {}),
    },
  });

  await enqueueNotification({
    notificationId: notification.id,
    userId: input.userId,
    title: notification.title,
    body: notification.body,
    ...(notification.link ? { link: notification.link } : {}),
  });

  return notification;
}
