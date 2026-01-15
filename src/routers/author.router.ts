import { Router } from "express";
import { createAuthorController } from "../controllers/author.controller";

const router = Router()

router.post("/", createAuthorController)

export default router