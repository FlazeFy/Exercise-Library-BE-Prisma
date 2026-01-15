import { Router } from "express";
import { createPublisherController } from "../controllers/publisher.controller";

const router = Router()

router.post("/", createPublisherController)

export default router