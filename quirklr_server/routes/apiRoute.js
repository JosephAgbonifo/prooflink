import { Router } from "express";
import { checkPaymentStatus } from "../controllers/apiController.js";

const apiRoutes = Router();

apiRoutes.get("/verify", checkPaymentStatus);

export default apiRoutes;
