import { Request, Response } from 'express';
import { prisma } from '../index';
import { TestType, QuestionType, AssignmentType } from '@prisma/client';

export const createTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, type, timeLimit, attemptsAllowed, passingScore, shuffleQuestions, showAnswers, moduleId } = req.body;

    const test = await prisma.test.create({
      data: {
        title,
        description,
        type: type as TestType,
        timeLimit,
        attemptsAllowed,
        passingScore,
        shuffleQuestions,
        showAnswers,
        moduleId
      }
    });

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error });
  }
};

export const addQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const { text, type, points, options, correctAnswer, explanation, order } = req.body;

    const question = await prisma.testQuestion.create({
      data: {
        text,
        type: type as QuestionType,
        points,
        options: options || [],
        correctAnswer,
        explanation,
        order,
        testId
      }
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error adding question', error });
  }
};

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, type, maxScore, courseId, lessonId, testId, dueDate, allowLateSubmission } = req.body;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        type: type as AssignmentType,
        maxScore,
        courseId,
        lessonId,
        testId,
        dueDate,
        allowLateSubmission
      }
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment', error });
  }
};
