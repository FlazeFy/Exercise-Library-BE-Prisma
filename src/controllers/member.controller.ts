import { Request, Response } from "express"
import { prisma } from "../config/prisma"

export const createMemberController = async (req: Request, res: Response) => {
    try {
        // Body
        const { branch_id, fullname, email, address, status } = req.body

        // Validation
        if (!branch_id) {
            return res.status(400).json({
                message: "Branch ID is required",
                data: null,
            })
        }
        if (!fullname || fullname.length < 3) {
            return res.status(400).json({
                message: "Fullname must be at least 3 characters",
                data: null,
            })
        }
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                data: null,
            })
        }
        if (!address) {
            return res.status(400).json({
                message: "Address is required",
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

        // Check email uniqueness
        const existingMember = await prisma.member.findFirst({
            where: { email },
        })

        if (existingMember) {
            return res.status(409).json({
                message: "Email already exists",
                data: null,
            })
        }

        // Validate status
        const validStatuses = ["active", "inactive", "blocked"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid member status",
                data: null,
            })
        }

        // Query
        const result = await prisma.member.create({
            data: {
                branch_id,
                fullname,
                email,
                address,
                status,
            },
        })

        // Success response
        res.status(201).json({
            message: "Create member successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}
