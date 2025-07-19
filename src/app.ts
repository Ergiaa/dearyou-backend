import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { sendError } from './utils/response.utils';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  sendError(res, 'Route not found', 404);
});

export default app;
