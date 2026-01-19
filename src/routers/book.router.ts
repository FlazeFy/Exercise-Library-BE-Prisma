import { Router } from "express";
import { createBookController, hardDeleteBookById, updateBookByIdController } from "../controllers/book.controller";

const router = Router()

router.post("/", createBookController)
router.put("/:id", updateBookByIdController)
router.delete("/:id", hardDeleteBookById)

export default router