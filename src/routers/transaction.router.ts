import { Router } from "express";
import { createTransactionController, createTransactionItemController, hardDeleteTransactionItemByIdController, hardDeleteTransactionByIdController, updateTransactionByIdController } from "../controllers/transaction.controller";

const router = Router()

router.post("/", createTransactionController)
router.post("/item", createTransactionItemController)
router.put("/:id", updateTransactionByIdController)
router.delete("/:id", hardDeleteTransactionByIdController)
router.delete("/item/:id", hardDeleteTransactionItemByIdController)

export default router