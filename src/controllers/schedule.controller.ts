import { Request, Response } from "express"
import { prisma } from "../config/prisma"

const VALID_SCHEDULE_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

export const createScheduleController = async (req: Request, res: Response) => {
    try {
        // Body
        const { staff_id, schedule_day, schedule_start_time, schedule_end_time, schedule_note } = req.body

        // Validation
        if (!staff_id) {
            return res.status(400).json({
                message: "Staff id is required",
                data: null,
            })
        }
        if (!schedule_day) {
            return res.status(400).json({
                message: "Schedule day is required",
                data: null,
            })
        }
        if (!schedule_start_time) {
            return res.status(400).json({
                message: "Schedule start time is required",
                data: null,
            })
        }
        if (!schedule_end_time) {
            return res.status(400).json({
                message: "Schedule end time is required",
                data: null,
            })
        }

        // Validation: schedule day
        if (!VALID_SCHEDULE_DAYS.includes(schedule_day)) {
            return res.status(400).json({
                message: "Invalid schedule day",
                data: null,
            })
        }

        // Validation: staff exists
        const staff = await prisma.staff.findUnique({
            where: { id: staff_id },
        })
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found",
                data: null,
            })
        }

        // Validation time
        if (!/^\d{2}:\d{2}$/.test(schedule_start_time)) {
            return res.status(400).json({
                message: "Schedule start time must be in HH:MM format",
                data: null,
            })
        }
        if (!/^\d{2}:\d{2}$/.test(schedule_end_time)) {
            return res.status(400).json({
                message: "Schedule end time must be in HH:MM format",
                data: null,
            })
        }

        const [startHour, startMinute] = schedule_start_time.split(":").map(Number)
        const [endHour, endMinute] = schedule_end_time.split(":").map(Number)
        // Validation start & end time
        if (startHour > 23 || startMinute > 59) {
            return res.status(400).json({
                message: "Schedule start time is invalid",
                data: null,
            })
        }
        if (endHour > 23 || endMinute > 59) {
            return res.status(400).json({
                message: "Schedule end time is invalid",
                data: null,
            })
        }

        // Validation: start must be before end
        if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
            return res.status(400).json({
                message: "Schedule start time must be before end time",
                data: null,
            })
        }

        // Query
        const result = await prisma.schedule.create({
            data: { staff_id, schedule_day, schedule_start_time: schedule_start_time, schedule_end_time: schedule_end_time, schedule_note },
        })

        // Success response
        res.status(201).json({
            message: "Create schedule successful",
            data: result,
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}

export const hardDeleteScheduleById = async (req: Request, res: Response) => {
    try {
        // Params
        const id = typeof req.params.id === "string" ? req.params.id : undefined

        // Validation
        if (!id) {
            return res.status(400).json({
                message: "Schedule id is required"
            })
        }

        // Check existence
        const existingSchedule = await prisma.schedule.findUnique({
            where: { id },
        })
        if (!existingSchedule) {
            return res.status(404).json({
                message: "Schedule not found"
            })
        }

        // Query
        await prisma.schedule.delete({
            where: { id },
        })

        // Success response
        res.status(200).json({
            message: "Delete schedule successful"
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            data: error,
        })
    }
}