import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

// Routes
import projectRoutes from "./routes/projectRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import proofrailsRoutes from "./routes/proofRailsRoute.js";
import authRoutes from "./routes/authRoutes.js";
import { validateApiKey } from "./middlewares/verifyApi.js";
import apiRoutes from "./routes/apiRoute.js";

dotenv.config();

const app = express();

// Middlewares
// 1. Define the restricted CORS (Frontend only)
const frontendCors = cors({
  origin: process.env.FRONTEND_URL, // e.g., http://localhost:3000
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// 2. Define the public CORS (Allows access from anywhere + X-API-KEY)
const publicApiCors = cors({
  origin: "*", // Allows any website to call the API
  allowedHeaders: ["Content-Type", "X-API-KEY"], // Permits the browser to send your custom header
});
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.use("/api/projects", frontendCors, projectRoutes);
app.use("/api/payments", frontendCors, paymentRoutes);
app.use("/api/proofrails", frontendCors, proofrailsRoutes);
app.use("/api/auth", frontendCors, authRoutes);
app.use("/api/public", publicApiCors, validateApiKey, apiRoutes); // Public auth routes without API key validation

app.get("/", (req, res) => {
  res.send("ProofLink backend is running");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
