import express from "express";
import dotenv from "dotenv";
import { connection, isConnected } from "./utility/connection.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();
dotenv.config();

connection();
isConnected();

// Apply rate limiting middleware to all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const corsOptions = {
  origin: process.env.APP_URL, // Allow requests only from this origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow only GET and POST requests
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
  exposedHeaders: ["Content-Length"], // Expose additional headers to the client
  credentials: true, // Allow sending credentials (e.g., cookies)
  maxAge: 86400, // Cache preflight request for 1 day (in seconds)
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

// Test GET API route
app.use("/api/v1/test", (req, res) => {
  res.json({
    success: true,
    message: "Test data received successfully",
    data: {
      user: "Test User",
      email: "testuser@example.com",
    },
  });
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(process.env.PORT_NUMBER, () => {
  console.log("connected to backend");
});

export default app;
