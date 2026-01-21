import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  setWithdrawalStatusDB,
} from "../controllers/projectController.js";

const projectRoutes = Router();

projectRoutes.post("/create_project", createProject);
projectRoutes.get("/get_all", getAllProjects);
projectRoutes.get("/get_project/:projectId", getProjectById);
projectRoutes.post("/delete", deleteProject);
projectRoutes.post("/withdraw", setWithdrawalStatusDB);

export default projectRoutes;
