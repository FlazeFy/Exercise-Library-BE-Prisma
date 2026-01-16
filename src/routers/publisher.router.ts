import { Router } from "express";
import { createPublisherController, hardDeletePublisherById, updatePublisherByIdController } from "../controllers/publisher.controller";

const router = Router()

router.post("/", createPublisherController)
router.delete("/:id", hardDeletePublisherById)
router.put("/:id", updatePublisherByIdController)

export default router