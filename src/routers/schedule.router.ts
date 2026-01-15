import { Router } from "express";
import { createScheduleController, hardDeleteScheduleById } from "../controllers/schedule.controller";

const router = Router()

router.post("/",createScheduleController)
router.delete("/:id",hardDeleteScheduleById)

export default router