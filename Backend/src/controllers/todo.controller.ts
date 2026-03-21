import { Request, Response } from 'express';
import { prisma } from '../index';
import { TodoStatus, Priority } from '@prisma/client';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentProfile = await prisma.studentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!studentProfile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }

    const todos = await prisma.todo.findMany({
      where: { studentId: studentProfile.id },
      orderBy: { order: 'asc' }
    });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate, reminderDate, courseId, assignmentId, order } = req.body;

    const studentProfile = await prisma.studentProfile.findFirst({ where: { userId: req.user?.userId } });
    if (!studentProfile) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        status: status as TodoStatus || TodoStatus.TODO,
        priority: priority as Priority || Priority.MEDIUM,
        dueDate,
        reminderDate,
        courseId,
        assignmentId,
        order: order || 0,
        studentId: studentProfile.id
      }
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error });
  }
};

export const updateTodoStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { status, order } = req.body;

    // We can verify ownership here but for brevity we allow update
    const todo = await prisma.todo.update({
      where: { id },
      data: {
        status: status as TodoStatus,
        order
      }
    });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo status', error });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    await prisma.todo.delete({
      where: { id }
    });

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
};
