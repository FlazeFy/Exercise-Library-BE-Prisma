import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { stringLengthValidator, yearValidator } from "../helpers/validator.helper"

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
        const validationTitle = stringLengthValidator(title, "title", 3)
        if (!validationTitle.valid) {
            return res.status(400).json({ message: validationTitle.message })
        }
        const validationYear = yearValidator(publish_year, 'publish')
        if (!validationYear.valid) {
            return res.status(400).json({ message: validationYear.message })
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
            data: { author_id, publisher_id, title, publish_year }
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

export const updateBookByIdController = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Body
        const { author_id, publisher_id, title, publish_year } = req.body

        // Validation: id
        if (!id) {
            return res.status(400).json({
                message: "Book id is required",
            })
        }

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
        const validationTitle = stringLengthValidator(title, "title", 3)
        if (!validationTitle.valid) {
            return res.status(400).json({ message: validationTitle.message })
        }
        const validationYear = yearValidator(publish_year, 'publish')
        if (!validationYear.valid) {
            return res.status(400).json({ message: validationYear.message })
        }

        // Check existence
        const existingAuthor = await prisma.author.findUnique({
            where: { id: author_id },
        })
        if (!existingAuthor) {
            return res.status(404).json({
                message: "Author not found",
            })
        }

        // Check existence
        const existingPublisher = await prisma.publisher.findUnique({
            where: { id: publisher_id },
        })
        if (!existingPublisher) {
            return res.status(404).json({
                message: "Publisher not found",
            })
        }

        // Validate book exists
        const book = await prisma.book.findUnique({
            where: { id },
        })
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
                data: null,
            })
        }

        // Query
        const result = await prisma.book.update({
            where: { id },
            data: { author_id, publisher_id, title, publish_year },
        })

        // Success response
        res.status(200).json({
            message: "Update book successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const hardDeleteBookById = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Validation
        if (!id) {
            return res.status(400).json({
                message: "Book id is required"
            })
        }

        // Check existence
        const existingBook = await prisma.book.findUnique({
            where: { id },
        })
        if (!existingBook) {
            return res.status(404).json({
                message: "Book not found"
            })
        }

        // Query
        await prisma.transaction_item.deleteMany({
            where: { book_id: id },
        })
        await prisma.book.delete({
            where: { id },
        })

        // Success response
        res.status(200).json({
            message: "Delete book successful"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}