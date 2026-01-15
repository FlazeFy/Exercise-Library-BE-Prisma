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