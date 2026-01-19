import { Router } from "express";
import { createBranchController, updateBranchByIdController, hardDeleteBranchByIdController } from "../controllers/branch.controller";

const router = Router()

router.post("/", createBranchController)
router.put("/:id", updateBranchByIdController)
router.delete("/:id", hardDeleteBranchByIdController)

export default router