import { Router } from "express";
import { createBranchController, updateBranchByIdController, hardDeleteBranchByIdController, getAllBranch } from "../controllers/branch.controller";

const router = Router()

router.get("/", getAllBranch)
router.post("/", createBranchController)
router.put("/:id", updateBranchByIdController)
router.delete("/:id", hardDeleteBranchByIdController)

export default router