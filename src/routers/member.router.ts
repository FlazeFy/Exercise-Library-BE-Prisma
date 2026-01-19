import { Router } from "express";
import { createMemberController, updateMemberByIdController, hardDeleteMemberById } from "../controllers/member.controller";

const router = Router()

router.post("/", createMemberController)
router.put("/:id", updateMemberByIdController)
router.delete("/:id", hardDeleteMemberById)

export default router