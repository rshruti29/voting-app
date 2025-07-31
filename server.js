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
    origin: 'https://voting-app-ten-sigma.vercel.app',
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
  origin: "https://voting-app-ten-sigma.vercel.app/",
  credentials: true ,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', mongodb: mongoose.connection.readyState === 1 });
});

app.get('/', (req, res) => {
  res.send('🎉 Backend is running!');
});

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect("mongodb+srv://mendoncashalom27:XvIfPz0T9I1u2iQf@cluster0.akmyeq3.mongodb.net/voting-app?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB connected successfully");
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
    console.log(`Server + Socket.IO running at https://voting-app-3eju.onrender.com/`);
  });
});



app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});









