import { Router } from "express";
import { createMemberController } from "../controllers/member.controller";

const router = Router()

router.post("/", createMemberController)

export default router