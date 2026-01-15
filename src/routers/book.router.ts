import { Router } from "express";
import { createBookController } from "../controllers/book.controller";

const router = Router()

router.post("/", createBookController)

export default router