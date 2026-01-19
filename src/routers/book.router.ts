import { Router } from "express";
import { createBookController, hardDeleteBookById } from "../controllers/book.controller";

const router = Router()

router.post("/", createBookController)
router.delete("/:id", hardDeleteBookById)

export default router