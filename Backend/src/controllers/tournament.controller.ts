import { Request, Response } from 'express';
import { prisma } from '../index';
import { TournamentType, TournamentStatus } from '@prisma/client';

export const getTournaments = async (req: Request, res: Response): Promise<void> => {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        _count: { select: { participants: true } }
      }
    });

    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tournaments', error });
  }
};

export const createTournament = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, type, status, startDate, endDate, maxParticipants, minParticipants, institutionId, prizes } = req.body;

    const tournament = await prisma.tournament.create({
      data: {
        name,
        description,
        type: type as TournamentType,
        status: status as TournamentStatus || TournamentStatus.UPCOMING,
        startDate,
        endDate,
        maxParticipants,
        minParticipants,
        institutionId,
        prizes
      }
    });

    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tournament', error });
  }
};

export const registerParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    
    const studentProfile = await prisma.studentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!studentProfile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }

    const participant = await prisma.tournamentParticipant.create({
      data: {
        tournamentId,
        studentId: studentProfile.id
      }
    });

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: 'Error registering for tournament', error });
  }
};

export const submitResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tournamentId, studentId } = req.params;
    const { place, prize, pointsEarned } = req.body;

    const result = await prisma.tournamentResult.create({
      data: {
        tournamentId,
        studentId,
        place,
        prize,
        pointsEarned
      }
    });

    // Award XP
    const student = await prisma.studentProfile.findUnique({ where: { id: studentId } });
    if (student) {
      await prisma.studentProfile.update({
        where: { id: studentId },
        data: { totalXP: student.totalXP + pointsEarned }
      });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting tournament result', error });
  }
};
