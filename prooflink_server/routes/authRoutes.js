import { Router } from "express";
import {
  checkApiKey,
  registerOrCheckWallet,
} from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.get("/check-key", checkApiKey);
authRoutes.get("/generate-key", registerOrCheckWallet);

export default authRoutes;
