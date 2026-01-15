import { Request, Response } from "express"
import { prisma } from "../config/prisma"

export const createTransactionController = async (req: Request, res: Response) => {
    try {
        // Body
        const { staff_id, member_id, branch_id, status, deadline_at } = req.body

        // Validation
        if (!staff_id) {
            return res.status(400).json({
                message: "Staff ID is required",
                data: null,
            })
        }
        if (!member_id) {
            return res.status(400).json({
                message: "Member ID is required",
                data: null,
            })
        }
        if (!branch_id) {
            return res.status(400).json({
                message: "Branch ID is required",
                data: null,
            })
        }
        if (!status) {
            return res.status(400).json({
                message: "Transaction status is required",
                data: null,
            })
        }
        if (!deadline_at || isNaN(Date.parse(deadline_at))) {
            return res.status(400).json({
                message: "Invalid deadline date",
                data: null,
            })
        }

        // Validate staff exists
        const staff = await prisma.staff.findUnique({
            where: { id: staff_id },
        })
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found",
                data: null,
            })
        }

        // Validate member exists
        const member = await prisma.member.findUnique({
            where: { id: member_id },
        })
        if (!member) {
            return res.status(404).json({
                message: "Member not found",
                data: null,
            })
        }

        // Validate branch exists
        const branch = await prisma.branch.findUnique({
            where: { id: branch_id },
        })
        if (!branch) {
            return res.status(404).json({
                message: "Branch not found",
                data: null,
            })
        }

        // Validate status value
        const validStatuses = ["borrowed", "returned", "late"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid transaction status",
                data: null,
            })
        }

        // Query
        const result = await prisma.transaction.create({
            data: {
                staff_id,
                member_id,
                branch_id,
                status,
                deadline_at: new Date(deadline_at),
                total_fine: null,
            },
        })

        // Success response
        res.status(201).json({
            message: "Create transaction successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const createTransactionItemController = async (req: Request, res: Response) => {
    try {
        // Body
        const { transaction_id, book_id, transaction_item_note } = req.body

        // Validation
        if (!transaction_id) {
            return res.status(400).json({
                message: "Transaction ID is required",
                data: null,
            })
        }
        if (!book_id) {
            return res.status(400).json({
                message: "Book ID is required",
                data: null,
            })
        }

        // Validate transaction exists
        const transaction = await prisma.transaction.findUnique({
            where: { id: transaction_id },
        })
        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
                data: null,
            })
        }

        // Validate book exists
        const book = await prisma.book.findUnique({
            where: { id: book_id },
        })
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                data: null,
            })
        }

        // Check duplicate transaction item
        const existingItem = await prisma.transaction_item.findFirst({
            where: {
                transaction_id,
                book_id,
            },
        })
        if (existingItem) {
            return res.status(409).json({
                message: "This book already added to the transaction",
                data: null,
            })
        }

        // Query
        const result = await prisma.transaction_item.create({
            data: {
                transaction_id,
                book_id,
                transaction_item_note,
            },
        })

        // Success response
        res.status(201).json({
            message: "Create transaction item successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}
