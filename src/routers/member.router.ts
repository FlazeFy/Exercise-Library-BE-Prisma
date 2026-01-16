import { Router } from "express";
import { createMemberController, updateMemberByIdController } from "../controllers/member.controller";

const router = Router()

router.post("/", createMemberController)
router.put("/:id", updateMemberByIdController)

export default router