import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcrypt';
import { Role, InstitutionRole } from '@prisma/client';

export const getInstitutionUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { institutionId } = req.params as { institutionId: string };

    const users = await prisma.institutionUser.findMany({
      where: { institutionId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true, avatar: true }
        },
        department: true
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const addTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { institutionId } = req.params as { institutionId: string };
    const { email, firstName, lastName, password, departmentId, position } = req.body;

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password || 'defaultPassword123!', 10);
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: Role.TEACHER,
          teacherProfile: {
            create: { institutionId }
          }
        }
      });
    }

    const institutionUser = await prisma.institutionUser.create({
      data: {
        userId: user.id,
        institutionId,
        departmentId,
        position,
        role: InstitutionRole.TEACHER
      }
    });

    res.status(201).json({ user, institutionUser });
  } catch (error) {
    res.status(500).json({ message: 'Error adding teacher', error });
  }
};

export const addStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { institutionId } = req.params as { institutionId: string };
    const { email, firstName, lastName, password, classId } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password || 'studentPass123!', 10);
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: Role.STUDENT,
          studentProfile: {
            create: { classId }
          }
        }
      });
    }

    // Add to institution
    const institutionUser = await prisma.institutionUser.create({
      data: {
        userId: user.id,
        institutionId,
        role: InstitutionRole.TEACHER // Note: normally students don't need InstitutionUser unless defined so. The schema links them via class instead.
      }
    });

    res.status(201).json({ user, institutionUser });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error });
  }
};
