import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/apiError.js";
import { getIO } from "../../lib/socket.js";
import { createNotification } from "../notification/notification.service.js";
import type { ChatContactQueryDto, CreateDirectChatDto, SendChatMessageDto } from "./chat.schema.js";

const userPreviewSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
} as const;

export async function listChatContacts(userId: string, query: ChatContactQueryDto) {
  return prisma.user.findMany({
    where: {
      id: { not: userId },
      isActive: true,
      ...(query.search
        ? {
            OR: [
              { firstName: { contains: query.search, mode: "insensitive" } },
              { lastName: { contains: query.search, mode: "insensitive" } },
              { email: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: userPreviewSelect,
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    take: 20,
  });
}

export async function listChats(userId: string) {
  const chats = await prisma.chat.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: { user: { select: userPreviewSelect } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    type: chat.type,
    participants: chat.participants.map((item) => item.user),
    lastMessage: chat.messages[0] ?? null,
  }));
}

export async function createOrGetDirectChat(userId: string, dto: CreateDirectChatDto) {
  if (dto.participantId === userId) {
    throw ApiError.badRequest("Cannot create chat with yourself");
  }

  const existing = await prisma.chat.findFirst({
    where: {
      type: "DIRECT",
      participants: {
        every: {
          userId: { in: [userId, dto.participantId] },
        },
      },
    },
    include: {
      participants: { include: { user: { select: userPreviewSelect } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (existing && existing.participants.length === 2) {
    return {
      id: existing.id,
      title: existing.title,
      type: existing.type,
      participants: existing.participants.map((item) => item.user),
      lastMessage: existing.messages[0] ?? null,
    };
  }

  const chat = await prisma.chat.create({
    data: {
      type: "DIRECT",
      participants: {
        create: [{ userId }, { userId: dto.participantId }],
      },
    },
    include: {
      participants: { include: { user: { select: userPreviewSelect } } },
      messages: { take: 1 },
    },
  });

  return {
    id: chat.id,
    title: chat.title,
    type: chat.type,
    participants: chat.participants.map((item) => item.user),
    lastMessage: chat.messages[0] ?? null,
  };
}

export async function getChatMessages(userId: string, chatId: string) {
  await assertParticipant(userId, chatId);

  const messages = await prisma.message.findMany({
    where: { chatId },
    include: { sender: { select: userPreviewSelect } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  await prisma.message.updateMany({
    where: { chatId, receiverId: userId, readAt: null },
    data: { readAt: new Date() },
  });

  await prisma.chatParticipant.update({
    where: { chatId_userId: { chatId, userId } },
    data: { lastReadAt: new Date() },
  }).catch(() => undefined);

  return messages;
}

export async function sendChatMessage(userId: string, chatId: string, dto: SendChatMessageDto) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { participants: { include: { user: { select: userPreviewSelect } } } },
  });

  if (!chat) throw ApiError.notFound("Chat not found");
  if (!chat.participants.some((item) => item.userId === userId)) {
    throw ApiError.forbidden("Not a chat participant");
  }

  const receiver = chat.participants.find((item) => item.userId !== userId)?.user;
  if (!receiver) throw ApiError.conflict("Chat requires another participant");

  const message = await prisma.message.create({
    data: {
      chatId,
      content: dto.content,
      ...(dto.attachmentUrl !== undefined ? { attachmentUrl: dto.attachmentUrl } : {}),
      senderId: userId,
      receiverId: receiver.id,
    },
    include: { sender: { select: userPreviewSelect } },
  });

  await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });

  await createNotification({
    userId: receiver.id,
    title: `Новое сообщение от ${message.sender.firstName}`,
    body: dto.content,
    type: "CHAT_MESSAGE",
    link: "/messages",
  });

  try {
    getIO().to(`chat:${chatId}`).emit("chat:message", message);
    getIO().to(`user:${receiver.id}`).emit("chat:message", message);
  } catch {
    // Ignore in environments without sockets.
  }

  return message;
}

export async function markChatRead(userId: string, chatId: string) {
  await assertParticipant(userId, chatId);

  await prisma.message.updateMany({
    where: { chatId, receiverId: userId, readAt: null },
    data: { readAt: new Date() },
  });

  await prisma.chatParticipant.update({
    where: { chatId_userId: { chatId, userId } },
    data: { lastReadAt: new Date() },
  }).catch(() => undefined);
}

async function assertParticipant(userId: string, chatId: string) {
  const participant = await prisma.chatParticipant.findUnique({
    where: { chatId_userId: { chatId, userId } },
  });

  if (!participant) throw ApiError.forbidden("Not a chat participant");
}
