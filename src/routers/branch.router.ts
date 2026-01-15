import { Router } from "express";
import { createBranchController } from "../controllers/branch.controller";

const router = Router()

router.post("/", createBranchController)

export default router