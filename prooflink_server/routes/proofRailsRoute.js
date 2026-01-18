import { Router } from "express";
import { addPayment } from "../controllers/proofrailsController.js";

const proofrailsRoutes = Router();

proofrailsRoutes.post("/add_payment", addPayment);

export default proofrailsRoutes;
