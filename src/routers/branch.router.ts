import { Router } from "express";
import { createBranchController, updateBranchByIdController } from "../controllers/branch.controller";

const router = Router()

router.post("/", createBranchController)
router.put("/:id", updateBranchByIdController)

export default router