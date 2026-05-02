import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression for efficiency
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Vote Pilot Backend is active' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
=========================================
🚀 VOTE PILOT BACKEND STARTED
📍 Port: ${PORT}
👤 Mode: ${process.env.NODE_ENV}
=========================================
  `);
});

export default app;
