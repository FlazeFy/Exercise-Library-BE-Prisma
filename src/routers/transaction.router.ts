import { Router } from "express";
import { createTransactionController, createTransactionItemController, hardDeleteTransactionItemByIdController, hardDeleteTransactionByIdController, updateTransactionByIdController, updateTransactionItemByIdController, getAllTransactionController } from "../controllers/transaction.controller";

const router = Router()

router.get("/", getAllTransactionController)
router.post("/", createTransactionController)
router.post("/item", createTransactionItemController)
router.put("/:id", updateTransactionByIdController)
router.put("/item/:id", updateTransactionItemByIdController)
router.delete("/:id", hardDeleteTransactionByIdController)
router.delete("/item/:id", hardDeleteTransactionItemByIdController)

export default router