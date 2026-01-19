import { Router } from "express";
import { createAuthorController, getAllAuthor, hardDeleteAuthorById, updateAuthorByIdController } from "../controllers/author.controller";

const router = Router()

router.get("/", getAllAuthor)
router.post("/", createAuthorController)
router.delete("/:id", hardDeleteAuthorById)
router.put("/:id", updateAuthorByIdController)

export default router