import { Router } from "express";
import { createAuthorController, hardDeleteAuthorById, updateAuthorByIdController } from "../controllers/author.controller";

const router = Router()

router.post("/", createAuthorController)
router.delete("/:id", hardDeleteAuthorById)
router.put("/:id", updateAuthorByIdController)

export default router