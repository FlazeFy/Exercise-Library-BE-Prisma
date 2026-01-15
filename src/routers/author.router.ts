import { Router } from "express";
import { createAuthorController, hardDeleteAuthorById } from "../controllers/author.controller";

const router = Router()

router.post("/", createAuthorController)
router.delete("/:id", hardDeleteAuthorById)

export default router