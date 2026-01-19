import { Router } from "express";
import { getAllBookController, createBookController, hardDeleteBookById, updateBookByIdController } from "../controllers/book.controller";

const router = Router()

router.get("/", getAllBookController)
router.post("/", createBookController)
router.put("/:id", updateBookByIdController)
router.delete("/:id", hardDeleteBookById)

export default router