import { Request, Response } from 'express';
import { prisma } from '../index';
import { MessageType } from '@prisma/client';

export const getUserChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    const chats = await prisma.chatParticipant.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    res.json(chats.map((c: any) => c.chat));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { firstName: true, lastName: true, avatar: true } }
      }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId, receiverId, content, type } = req.body;
    const senderId = req.user?.userId;
    
    if (!senderId) {
       res.status(401).json({ message: 'Unauthorized' });
       return;
    }

    const message = await prisma.message.create({
      data: {
        content,
        type: type as MessageType || MessageType.TEXT,
        senderId,
        receiverId,
        chatId
      }
    });

    // In a real app we'd emit this via Socket.io here
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};
