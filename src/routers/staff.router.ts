import { Router } from "express";
import { createStaffController, hardDeleteStaffById } from "../controllers/staff.controller";

const router = Router()

router.post("/", createStaffController)
router.delete("/:id", hardDeleteStaffById)

export default router