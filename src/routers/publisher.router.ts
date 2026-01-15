import { Router } from "express";
import { createPublisherController, updatePublisherByIdController } from "../controllers/publisher.controller";

const router = Router()

router.post("/", createPublisherController)
router.put("/:id", updatePublisherByIdController)

export default router