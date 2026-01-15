import { Request, Response } from "express"
import { prisma } from "../config/prisma"

export const createBookController = async (req: Request, res: Response) => {
    try {
        // Body
        const { author_id, publisher_id, title, publish_year } = req.body

        // Validation
        if (!author_id) {
            return res.status(400).json({
                message: "Author ID is required",
                data: null,
            })
        }
        if (!publisher_id) {
            return res.status(400).json({
                message: "Publisher ID is required",
                data: null,
            })
        }
        if (!title || title.length < 3) {
            return res.status(400).json({
                message: "Book title must be at least 3 characters",
                data: null,
            })
        }
        if (!publish_year || publish_year < 1000 || publish_year > new Date().getFullYear()) {
            return res.status(400).json({
                message: "Invalid publish year",
                data: null,
            })
        }

        // Validate author exists
        const author = await prisma.author.findUnique({
            where: { id: author_id },
        })
        if (!author) {
            return res.status(404).json({
                message: "Author not found",
                data: null,
            })
        }

        // Validate publisher exists
        const publisher = await prisma.publisher.findUnique({
            where: { id: publisher_id },
        })
        if (!publisher) {
            return res.status(404).json({
                message: "Publisher not found",
                data: null,
            })
        }

        // Query
        const result = await prisma.book.create({
            data: {
                author_id,
                publisher_id,
                title,
                publish_year,
            },
        })

        // Success response
        res.status(201).json({
            message: "Create book successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}
