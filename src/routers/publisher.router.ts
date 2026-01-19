import { Router } from "express";
import { getAllPublisher, createPublisherController, hardDeletePublisherById, updatePublisherByIdController } from "../controllers/publisher.controller";

const router = Router()

router.get("/", getAllPublisher)
router.post("/", createPublisherController)
router.delete("/:id", hardDeletePublisherById)
router.put("/:id", updatePublisherByIdController)

export default router