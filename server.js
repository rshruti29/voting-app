import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";          
import http from "http";                     

import authRoutes from "./routes/user.js";
import pollRoutes from "./routes/poll.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());


const server = http.createServer(app);       

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5177', 'http://localhost:5176'],
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  socket.on("vote-casted", (data) => {
    socket.broadcast.emit("new-vote", data); 
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(cors({
  origin: ['http://localhost:5177', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', mongodb: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/votingapp");
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    }
  }
};

const PORT = 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server + Socket.IO running at http://localhost:${PORT}`);
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});









