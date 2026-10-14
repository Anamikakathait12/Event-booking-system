import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';
import healthRouter from './routes/health.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
