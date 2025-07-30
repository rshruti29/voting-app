import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/user.js";
import pollRoutes from "./routes/poll.js";

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5177', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use(bodyParser.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mongodb: mongoose.connection.readyState === 1 });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

// MongoDB connection with simplified options
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/votingapp");
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    }
  }
};

// Start server
const PORT = 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({ 
    status: 'error',
    message: 'Internal server error'
  });
});








