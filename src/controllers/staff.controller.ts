import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { stringLengthValidator } from "../helpers/validator.helper"

export const getAllStaff = async (req: Request, res: Response) => {
    try {
        // Query
        let where: any = {}
        const limit = Number(req.query.limit) || 2
        const page = Number(req.query.page) || 1
        
        if (req.query.search) {
            where = {
                OR: [
                    { staff_name: { contains: String(req.query.search), mode: 'insensitive' } },
                    { staff_email: { contains: String(req.query.search), mode: 'insensitive' } },
                    { staff_role: { contains: String(req.query.search), mode: 'insensitive' } },
                ]
            }
        }

        const result = await prisma.staff.findMany({
            where,
            include: {
                schedules: {
                    omit: {
                        id: true,
                        staff_id: true,
                        created_at: true
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit,
            omit: {
                branch_id: true
            },
        })
          
        const finalRes = result.map(staff => ({
            ...staff,
            schedules: staff.schedules.map(dt => ({
                schedule_day: dt.schedule_day,
                schedule_time: `${dt.schedule_start_time} - ${dt.schedule_end_time}`,
                schedule_note: dt.schedule_note
            }))
        }))

        // Success response
        const isFound = finalRes && finalRes.length > 0
        res.status(isFound ? 200 : 404).json({
            message: `Fetch staff ${isFound ? 'successfull' : 'failed'}`,
            data: isFound ? finalRes : null,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

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
        // Validation: name length
        const validation = stringLengthValidator(staff_name, "staff name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
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
            data: { branch_id, staff_name, staff_email, staff_role },
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

export const updateStaffByIdController = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Body
        const { branch_id, staff_name, staff_email, staff_role } = req.body

        // Validation: id
        if (!id) {
            return res.status(400).json({
                message: "Staff id is required",
            })
        }

        // Check existence
        const existingStaff = await prisma.staff.findUnique({
            where: { id },
        })
        if (!existingStaff) {
            return res.status(404).json({
                message: "Staff not found",
            })
        }

        // Validation
        if (!branch_id) {
            return res.status(400).json({
                message: "Branch ID is required",
                data: null,
            })
        }
        const validation = stringLengthValidator(staff_name, "staff name", 3)
        if (!validation.valid) {
            return res.status(400).json({ message: validation.message })
        }
        if (!staff_email) {
            return res.status(400).json({
                message: "Staff Email is required",
                data: null,
            })
        }

        // Check email uniqueness
        const existingEmailStaff = await prisma.staff.findFirst({
            where: { staff_email, id: { not: id } },
        })
        if (existingEmailStaff) {
            return res.status(409).json({
                message: "Email already exists",
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
        const result = await prisma.staff.update({
            where: { id },
            data: { branch_id, staff_name, staff_email, staff_role },
        })

        // Success response
        res.status(200).json({
            message: "Update staff successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const hardDeleteStaffById = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Validation
        if (!id) {
            return res.status(400).json({
                message: "Staff id is required"
            })
        }

        // Check existence
        const existingStaff = await prisma.staff.findUnique({
            where: { id },
        })
        if (!existingStaff) {
            return res.status(404).json({
                message: "Staff not found"
            })
        }

        // Query
        await prisma.$transaction([
            prisma.transaction_item.deleteMany({
                where: {
                    transaction: {
                        staff_id: id,
                    },
                },
            }),        
            prisma.transaction.deleteMany({
                where: { staff_id: id },
            }),
        ])
        await prisma.schedule.deleteMany({
            where: { staff_id: id },
        })
        await prisma.staff.delete({
            where: { id },
        })

        // Success response
        res.status(200).json({
            message: "Delete staff successful"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}