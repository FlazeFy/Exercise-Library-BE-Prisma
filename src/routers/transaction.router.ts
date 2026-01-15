import { Router } from "express";
import { createTransactionController, createTransactionItemController } from "../controllers/transaction.controller";

const router = Router()

router.post("/", createTransactionController)
router.post("/item", createTransactionItemController)

export default router