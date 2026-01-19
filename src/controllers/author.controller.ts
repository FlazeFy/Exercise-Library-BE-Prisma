import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { stringLengthValidator } from "../helpers/validator.helper"

export const getAllAuthor = async (req: Request, res: Response) => {
    try {
        let where: any = {}
        const limit = Number(req.query.limit) || 2
        const page = Number(req.query.page) || 1
        
        if (req.query.search) {
            where = { author_name: { contains: String(req.query.search), mode: 'insensitive' } }
        }

        const result = await prisma.author.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit
        })

        // Success response
        const isFound = result && result.length > 0
        res.status(isFound ? 200 : 404).json({
            message: `Fetch author ${isFound ? 'successfull' : 'failed'}`,
            data: isFound ? result : null,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const createAuthorController = async (req: Request, res: Response) => {
    try {
        // Body
        const { author_name } = req.body

        // Validation: name length
        const validation = stringLengthValidator(author_name, "author name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
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
        await prisma.transaction_item.deleteMany({
            where: { 
                book: {
                    author_id: id
                }
            },
        })
        await prisma.book.deleteMany({
            where: { author_id: id },
        })
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

export const updateAuthorByIdController = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Body
        const { author_name } = req.body

        // Validation: id
        if (!id) {
            return res.status(400).json({
                message: "Author id is required",
            })
        }

        // Check existence
        const existingAuthor = await prisma.author.findUnique({
            where: { id },
        })
        if (!existingAuthor) {
            return res.status(404).json({
                message: "Author not found",
            })
        }

        // Validation: name length
        const validation = stringLengthValidator(author_name, "author name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
        }

        // Query
        const result = await prisma.author.update({
            where: { id },
            data: { author_name },
        })

        // Success response
        res.status(200).json({
            message: "Update author successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}
