import { Request, Response } from 'express';
import { prisma } from '../index';

export const linkChild = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, relationship } = req.body;
    
    const parentProfile = await prisma.parentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!parentProfile) {
      res.status(404).json({ message: 'Parent profile not found' });
      return;
    }

    const link = await prisma.parentStudent.create({
      data: {
        parentId: parentProfile.id,
        studentId,
        relationship
      }
    });

    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error linking child', error });
  }
};

export const getChildrenProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const parentProfile = await prisma.parentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!parentProfile) {
      res.status(404).json({ message: 'Parent profile not found' });
      return;
    }

    const children = await prisma.parentStudent.findMany({
      where: { parentId: parentProfile.id },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } },
            class: true,
            enrollments: {
              include: { course: { select: { title: true } } }
            },
            todos: { where: { status: { not: 'DONE' } } }
          }
        }
      }
    });

    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children progress', error });
  }
};

export const getChildrenAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const parentProfile = await prisma.parentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!parentProfile) {
      res.status(404).json({ message: 'Parent profile not found' });
      return;
    }

    // Get basic attendance info for all linked children
    const attendance = await prisma.parentStudent.findMany({
      where: { parentId: parentProfile.id },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } },
            attendance: {
              orderBy: { date: 'desc' },
              take: 30 // Last 30 records
            }
          }
        }
      }
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children attendance', error });
  }
};
