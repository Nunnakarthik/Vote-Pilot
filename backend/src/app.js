import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Vote Pilot Backend is active' });
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
