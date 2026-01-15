import { Request, Response } from "express"
import { prisma } from "../config/prisma"

export const createStaffController = async (req: Request, res: Response) => {
    try {
        // Body
        const { branch_id, staff_name, staff_email, staff_role } = req.body

        // Validation
        if (!branch_id) {
            return res.status(400).json({
                message: "Branch ID is required",
                data: null,
            })
        }
        if (!staff_name || staff_name.length < 3) {
            return res.status(400).json({
                message: "Staff name must be at least 3 characters",
                data: null,
            })
        }
        if (!staff_email) {
            return res.status(400).json({
                message: "Staff email is required",
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
        const existingStaff = await prisma.staff.findFirst({
            where: { staff_email },
        })
        if (existingStaff) {
            return res.status(409).json({
                message: "Staff email already exists",
                data: null,
            })
        }

        // Validate staff role
        const validRoles = ["admin", "librarian", "staff"]
        if (!validRoles.includes(staff_role)) {
            return res.status(400).json({
                message: "Invalid staff role",
                data: null,
            })
        }

        // Query
        const result = await prisma.staff.create({
            data: {
                branch_id,
                staff_name,
                staff_email,
                staff_role,
            },
        })

        // Success response
        res.status(201).json({
            message: "Create staff successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}
