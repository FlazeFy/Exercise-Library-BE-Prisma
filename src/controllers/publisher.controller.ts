import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { stringLengthValidator } from "../helpers/validator.helper"

export const createPublisherController = async (req: Request, res: Response) => {
    try {
        // Body
        const { publisher_name } = req.body

        // Validation: name length
        const validation = stringLengthValidator(publisher_name, "publisher name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
        }

        // Check duplicate
        const existingPublisher = await prisma.publisher.findFirst({
            where: { publisher_name },
        })
        if (existingPublisher) {
            return res.status(409).json({
                message: "Publisher name already exists",
                data: null,
            })
        }

        // Query
        const result = await prisma.publisher.create({
            data: { publisher_name },
        })

        // Success response
        res.status(201).json({
            message: "Create publisher successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const hardDeletePublisherById = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Validation
        if (!id) {
            return res.status(400).json({
                message: "Publisher id is required"
            })
        }

        // Check existence
        const existingPublisher = await prisma.publisher.findUnique({
            where: { id },
        })
        if (!existingPublisher) {
            return res.status(404).json({
                message: "Publisher not found"
            })
        }

        // Query
        await prisma.transaction_item.deleteMany({
            where: { book_id: id },
        })
        await prisma.book.deleteMany({
            where: { publisher_id: id },
        })
        await prisma.publisher.delete({
            where: { id },
        })

        // Success response
        res.status(200).json({
            message: "Delete publisher successful"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const updatePublisherByIdController = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Body
        const { publisher_name } = req.body

        // Validation: id
        if (!id) {
            return res.status(400).json({
                message: "Publisher id is required",
            })
        }

        // Check existence
        const existingPublisher = await prisma.publisher.findUnique({
            where: { id },
        })
        if (!existingPublisher) {
            return res.status(404).json({
                message: "Publisher not found",
            })
        }

        // Validation: name length
        const validation = stringLengthValidator(publisher_name, "publisher name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
        }

        // Check duplicate
        const existingPublisherName = await prisma.publisher.findFirst({
            where: { publisher_name, id: { not: id} },
        })
        if (existingPublisherName) {
            return res.status(409).json({
                message: "Publisher name already exists",
                data: null,
            })
        }

        // Query
        const result = await prisma.publisher.update({
            where: { id },
            data: { publisher_name },
        })

        // Success response
        res.status(200).json({
            message: "Update publisher successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}