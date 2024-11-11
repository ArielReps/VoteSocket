import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initializeSocketServer } from './services/SocketService';
import { seedCandidates } from './utils/seedCandidates';
import candidateRoute from './routes/candidateRoutes';
import cors from 'cors'
dotenv.config();  

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());


// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB().then(_=>seedCandidates()).then(_=>console.log("Finished to connect the DB and set up candidates"));

//socket usage:
const httpServer = createServer(app); // using http server to make the socket work
const io = initializeSocketServer(httpServer);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoute);


// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
