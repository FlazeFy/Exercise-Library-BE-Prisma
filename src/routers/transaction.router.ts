import { Router } from "express";
import { createTransactionController, createTransactionItemController, hardDeleteTransactionItemByIdController, hardDeleteTransactionByIdController } from "../controllers/transaction.controller";

const router = Router()

router.post("/", createTransactionController)
router.post("/item", createTransactionItemController)
router.delete("/:id", hardDeleteTransactionByIdController)
router.delete("/item/:id", hardDeleteTransactionItemByIdController)

export default router