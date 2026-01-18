import { Router } from "express";
import {
  checkPaymentStatus,
  getPaymentByReceipt,
  getPayments,
  getPaymentsByProject,
  getProjectProgress,
} from "../controllers/paymentController.js";

const paymentRoutes = Router();

paymentRoutes.get("/get_payments", getPayments);

paymentRoutes.get("/receipt/:receiptId", getPaymentByReceipt);

paymentRoutes.get("/fundraising_progress/:projectId", getProjectProgress);

paymentRoutes.get("/:projectId", getPaymentsByProject);

paymentRoutes.post("/check", checkPaymentStatus);

export default paymentRoutes;
