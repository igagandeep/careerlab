import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

config();
connectDB();
const app = express();

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL, 'https://your-app.vercel.app']
      : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'CareerLab API is running!' });
});

app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong!'
        : err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 CareerLab API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', async err => {
  console.error('Unhandled Rejection:', err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', async err => {
  console.error('Uncaught Exception:', err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

export default app;
