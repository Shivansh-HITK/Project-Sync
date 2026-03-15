import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';
import pairingRoutes from './routes/pairingRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-sync';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pairing', pairingRoutes);

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Project Sync API is running' });
});

// Socket.IO Connection Logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Devices join a room based on their userId
  socket.on('join', (userId: string) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });

  // WebRTC Signaling
  socket.on('signal', (data: { targetUserId: string, signalData: any, fromDeviceId: string }) => {
    // Broadcast signal to all devices of the same user EXCEPT the sender
    socket.to(data.targetUserId).emit('signal', {
      signalData: data.signalData,
      fromDeviceId: data.fromDeviceId
    });
  });

  // Clipboard Sync
  socket.on('clipboard-sync', (data: { userId: string, text: string, fromDeviceId: string }) => {
    socket.to(data.userId).emit('clipboard-sync', data);
  });

  // Screenshot Sync
  socket.on('screenshot-sync', (data: { userId: string, imageUrl: string, fromDeviceId: string }) => {
    socket.to(data.userId).emit('screenshot-sync', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Database Connection and Server Start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
