import { Request, Response } from 'express';
import { prisma } from '../index';
import { Difficulty, GradingSystem } from '@prisma/client';

export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } }
        },
        _count: { select: { modules: true, enrollments: true } }
      }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
        modules: {
          include: { lessons: true, tests: true }
        }
      }
    });

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    // Expected req.user to have teacher profile ID or we find it
    const { title, description, shortDescription, isFree, price, difficulty, teacherId, institutionId } = req.body;

    // Fallback: If no teacherId, assume the logged in user is the teacher
    let tId = teacherId;
    if (!tId && req.user) {
      const teacherProfile = await prisma.teacherProfile.findUnique({ where: { userId: req.user.userId } });
      if (teacherProfile) tId = teacherProfile.id;
    }

    if (!tId) {
      res.status(400).json({ message: 'Teacher ID is required to create a course' });
      return;
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        shortDescription,
        isFree,
        price,
        difficulty: difficulty as Difficulty,
        teacherId: tId,
        institutionId
      }
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
};

export const addModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params as { courseId: string };
    const { title, description, order } = req.body;

    const courseModule = await prisma.courseModule.create({
      data: {
        title,
        description,
        order,
        courseId
      }
    });

    res.status(201).json(courseModule);
  } catch (error) {
    res.status(500).json({ message: 'Error adding module', error });
  }
};

export const addLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params as { moduleId: string };
    const { title, content, videoUrl, duration, order, isPreview } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        duration,
        order,
        isPreview,
        moduleId
      }
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Error adding lesson', error });
  }
};
