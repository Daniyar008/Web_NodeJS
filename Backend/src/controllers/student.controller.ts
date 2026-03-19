import { Request, Response } from 'express';
import { prisma } from '../index';
import { EnrollmentStatus, SubmissionStatus } from '@prisma/client';

export const enrollInCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    
    // Fallback if not authenticated fully
    const studentProfile = await prisma.studentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!studentProfile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId,
        studentId: studentProfile.id,
        status: EnrollmentStatus.ACTIVE
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error });
  }
};

export const completeLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    
    const studentProfile = await prisma.studentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!studentProfile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }

    const completion = await prisma.lessonCompletion.create({
      data: {
        lessonId,
        studentId: studentProfile.id
      }
    });

    res.status(201).json(completion);
  } catch (error) {
    res.status(500).json({ message: 'Error completing lesson', error });
  }
};

export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;
    
    const studentProfile = await prisma.studentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!studentProfile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: studentProfile.id,
        content,
        status: SubmissionStatus.SUBMITTED
      }
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment', error });
  }
};
