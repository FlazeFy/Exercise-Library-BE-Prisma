import { Router } from "express";
import { createStaffController, getAllStaff, hardDeleteStaffById, updateStaffByIdController } from "../controllers/staff.controller";

const router = Router()

router.get("/", getAllStaff)
router.post("/", createStaffController)
router.delete("/:id", hardDeleteStaffById)
router.put("/:id", updateStaffByIdController)

export default router