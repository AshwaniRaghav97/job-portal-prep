import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import prepRoutes from './routes/prepRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CLIENT_URL || 'http://localhost:5173'],
    credentials: true,
  })
);

// Serve static upload files
const uploadsPath = path.resolve('uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prep', prepRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
