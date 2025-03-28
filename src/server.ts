import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import authRoutes from "./routes/authRoutes";
import rideRoutes from "./routes/rideRoutes";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));