import { Router } from "express";
import { createStaffController } from "../controllers/staff.controller";

const router = Router()

router.post("/", createStaffController)

export default router