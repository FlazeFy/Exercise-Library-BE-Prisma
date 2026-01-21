import { Router } from "express";
import { getAllBookController, createBookController, hardDeleteBookById, updateBookByIdController } from "../controllers/book.controller";
import { verifyToken } from "../middleware/verify_token.middleware"

const router = Router()

router.get("/", getAllBookController)
router.post("/", verifyToken, createBookController)
router.put("/:id", verifyToken, updateBookByIdController)
router.delete("/:id", verifyToken, hardDeleteBookById)

export default router