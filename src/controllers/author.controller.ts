import { Request, Response } from "express"
import { prisma } from "../config/prisma"

export const createAuthorController = async (req: Request, res: Response) => {
    try {
        // Body
        const { author_name } = req.body

        // Validation: name length
        if (!author_name || author_name.length < 3) {
            return res.status(400).json({
                message: "Author name must be at least 3 characters",
                data: null,
            })
        }

        // Query
        const result = await prisma.author.create({
            data: { author_name },
        })

        // Success response
        res.status(201).json({
            message: "Create author successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const hardDeleteAuthorById = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Validation
        if (!id) {
            return res.status(400).json({
                message: "Author id is required"
            })
        }

        // Check existence
        const existingAuthor = await prisma.author.findUnique({
            where: { id },
        })
        if (!existingAuthor) {
            return res.status(404).json({
                message: "Author not found"
            })
        }

        // Query
        await prisma.author.delete({
            where: { id },
        })

        // Success response
        res.status(200).json({
            message: "Delete author successful"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}