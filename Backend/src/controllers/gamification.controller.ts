import { Request, Response } from 'express';
import { prisma } from '../index';

export const getStudentAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params as { studentId: string };

    const achievements = await prisma.studentAchievement.findMany({
      where: { studentId },
      include: { achievement: true }
    });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements', error });
  }
};

export const awardXP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, xpAmount } = req.body;

    // Update total XP and calculate new level (simplified logic: e.g. 1 level = 100 XP)
    const student = await prisma.studentProfile.findUnique({ where: { id: studentId } });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    const newTotalXP = student.totalXP + xpAmount;
    const newLevel = Math.floor(newTotalXP / 100) + 1; // Basic formula

    const updatedStudent = await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        totalXP: newTotalXP,
        level: newLevel
      }
    });

    res.json({ message: `Awarded ${xpAmount} XP`, student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error awarding XP', error });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = '10' } = req.query;

    const topStudents = await prisma.studentProfile.findMany({
      take: parseInt(limit as string, 10),
      orderBy: { totalXP: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        class: { select: { name: true } }
      }
    });

    res.json(topStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};
