import { Router } from "express";
import { createBranchController, updateBranchByIdController, hardDeleteBranchByIdController, getAllBranch, getBranchMemberByBranchID } from "../controllers/branch.controller";

const router = Router()

router.get("/", getAllBranch)
router.get("/:id", getBranchMemberByBranchID)
router.post("/", createBranchController)
router.put("/:id", updateBranchByIdController)
router.delete("/:id", hardDeleteBranchByIdController)

export default router