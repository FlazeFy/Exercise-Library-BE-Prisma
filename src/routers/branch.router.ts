import { Router } from "express";
import { createBranchController, updateBranchByIdController, hardDeleteBranchByIdController, getAllBranch, getBranchMemberByBranchID } from "../controllers/branch.controller";
import { authorizeRole, verifyToken } from "../middleware/verify_token.middleware"

const router = Router()

router.get("/", getAllBranch)
router.get("/:id", getBranchMemberByBranchID)
router.post("/", verifyToken, authorizeRole(["admin"]), createBranchController)
router.put("/:id", verifyToken, authorizeRole(["admin"]), updateBranchByIdController)
router.delete("/:id", verifyToken, authorizeRole(["admin"]), hardDeleteBranchByIdController)

export default router