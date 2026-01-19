import { Router } from "express";
import { createStaffController, hardDeleteStaffById, updateStaffByIdController } from "../controllers/staff.controller";

const router = Router()

router.post("/", createStaffController)
router.delete("/:id", hardDeleteStaffById)
router.put("/:id", updateStaffByIdController)

export default router