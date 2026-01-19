import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { stringLengthValidator } from "../helpers/validator.helper"

export const getAllBranch = async (req: Request, res: Response) => {
    try {
        // Query
        let where: any = {}
        const limit = Number(req.query.limit) || 2
        const page = Number(req.query.page) || 1
        
        if (req.query.search) {
            where = {
                OR: [
                    { branch_name: { contains: String(req.query.search), mode: 'insensitive' } },
                    { branch_address: { contains: String(req.query.search), mode: 'insensitive' } }
                ]
            }
        }

        const result = await prisma.branch.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit
        })

        // Success response
        const isFound = result && result.length > 0
        res.status(isFound ? 200 : 404).json({
            message: `Fetch branch ${isFound ? 'successfull' : 'failed'}`,
            data: isFound ? result : null,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const getBranchMemberByBranchID = async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : undefined
        const limit = Number(req.query.limit) || 2
        const page = Number(req.query.page) || 1
        let where: any = {}

        if (id) {
            where.id = id
        }
        if (req.query.search) {
            where.members = {
                some: {
                    OR: [
                        { fullname: { contains: String(req.query.search), mode: 'insensitive' } },
                        { email: { contains: String(req.query.search), mode: 'insensitive' } }
                    ]
                }
            }
        }

        const result = await prisma.branch.findMany({
            where,
            include: {
                members: {
                    omit: {
                        id: true,
                        branch_id: true,
                        created_at: true
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit
        })

        let finalResult: any = null
        if (result && result.length > 0) {
            const branch = result[0] 
            finalResult = {
                ...branch,
                members: branch.members && branch.members.length > 0 ? branch.members : null
            }
        }

        const isFound = !!finalResult
        res.status(isFound ? 200 : 404).json({
            message: `Fetch branch's member ${isFound ? 'successfull' : 'failed'}`,
            data: finalResult
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error
        })
    }
}

export const createBranchController = async (req: Request, res: Response) => {
    try {
        // Body
        const { branch_name, branch_address } = req.body

        // Validation
        const validation = stringLengthValidator(branch_name, "branch name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
        }
        if (!branch_address) {
            return res.status(400).json({
                message: "Branch address is required",
                data: null,
            })
        }

        // Check duplicate branch name
        const existingBranch = await prisma.branch.findFirst({
            where: { branch_name },
        })
        if (existingBranch) {
            return res.status(409).json({
                message: "Branch name already exists",
                data: null,
            })
        }

        // Query
        const result = await prisma.branch.create({
            data: { branch_name, branch_address },
        })

        // Success response
        res.status(201).json({
            message: "Create branch successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const updateBranchByIdController = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Body
        const { branch_name, branch_address } = req.body

        // Validation: id
        if (!id) {
            return res.status(400).json({
                message: "Branch id is required",
            })
        }

        // Check existence
        const existingBranch = await prisma.branch.findUnique({
            where: { id },
        })
        if (!existingBranch) {
            return res.status(404).json({
                message: "Branch not found",
            })
        }

        // Validation
        const validation = stringLengthValidator(branch_name, "branch name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
        }
        if (!branch_address) {
            return res.status(400).json({
                message: "Branch address is required",
                data: null,
            })
        }

        // Check duplicate branch name
        const existingBranchName = await prisma.branch.findFirst({
            where: { branch_name, id: { not: id } },
        })
        if (existingBranchName) {
            return res.status(409).json({
                message: "Branch name already exists",
                data: null,
            })
        }

        // Query
        const result = await prisma.branch.update({
            where: { id },
            data: { branch_name, branch_address },
        })

        // Success response
        res.status(200).json({
            message: "Update branch successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const hardDeleteBranchByIdController = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Validation
        if (!id) {
            return res.status(400).json({
                message: "Branch id is required"
            })
        }

        // Check existence
        const existingBranch = await prisma.branch.findUnique({
            where: { id },
        })
        if (!existingBranch) {
            return res.status(404).json({
                message: "Branch not found"
            })
        }

        // Query
        await prisma.$transaction([
            prisma.transaction_item.deleteMany({
                where: {
                    transaction: {
                        branch_id: id,
                    },
                },
            }),        
            prisma.transaction.deleteMany({
                where: { branch_id: id },
            }),
        ])
        await prisma.$transaction([
            prisma.schedule.deleteMany({
                where: {
                    staff: {
                        branch_id: id,
                    },
                },
            }),        
            prisma.staff.deleteMany({
                where: { branch_id: id },
            }),
        ])
        await prisma.member.deleteMany({
            where: { branch_id: id },
        })
        await prisma.branch.delete({
            where: { id },
        })

        // Success response
        res.status(200).json({
            message: "Delete branch successful"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}