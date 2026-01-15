import { Request, Response } from "express"
import { prisma } from "../config/prisma"

export const createPublisherController = async (req: Request, res: Response) => {
    try {
        // Body
        const { publisher_name } = req.body

        // Validation: name length
        if (!publisher_name || publisher_name.length < 3) {
            return res.status(400).json({
                message: "Publisher name must be at least 3 characters",
                data: null,
            })
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

        // Validation: name length
        if (!publisher_name || publisher_name.length < 3) {
            return res.status(400).json({
                message: "Publisher name must be at least 3 characters",
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

        // Check duplicate
        const existingPublisherName = await prisma.publisher.findFirst({
            where: { publisher_name },
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