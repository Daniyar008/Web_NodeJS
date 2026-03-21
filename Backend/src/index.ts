import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Client } from 'pg';

import authRoutes from './routes/auth.routes';
import institutionRoutes from './routes/institution.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import testRoutes from './routes/test.routes';
import studentRoutes from './routes/student.routes';
import gamificationRoutes from './routes/gamification.routes';
import todoRoutes from './routes/todo.routes';
import tournamentRoutes from './routes/tournament.routes';
import parentRoutes from './routes/parent.routes';
import aiRoutes from './routes/ai.routes';
import chatRoutes from './routes/chat.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();

// Initialize Prisma with PG adapter
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(client);
export const prisma = new PrismaClient({ adapter });

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduFuture Backend is running' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
