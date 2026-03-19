import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../index';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.utils';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || Role.STUDENT,
        settings: {
          create: {} // Create default settings
        }
      },
    });

    const tokens = generateTokens({ userId: user.id, role: user.role });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = generateTokens({ userId: user.id, role: user.role });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== decoded.role) {
      res.status(401).json({ message: 'User not found or role mismatch' });
      return;
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });
    res.json(tokens);
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        patronymic: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        settings: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
