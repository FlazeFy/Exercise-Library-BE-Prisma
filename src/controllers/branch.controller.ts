import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { stringLengthValidator } from "../helpers/validator.helper"

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