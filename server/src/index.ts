import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Initialize environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/auth', (req: Request, res: Response) => {
    res.json({ message: 'Auth routes coming soon' });
});

app.use('/api/users', (req: Request, res: Response) => {
    res.json({ message: 'User routes coming soon' });
});

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        method: req.method
    });
});

// Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║      EduFuture Server Started          ║
╠════════════════════════════════════════╣
║  Environment: ${process.env.NODE_ENV?.padEnd(27)}║
║  Port:       ${String(PORT).padEnd(28)}║
║  Status:     Ready                     ║
╚════════════════════════════════════════╝
  `);
});
