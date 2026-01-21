import { Request, Response } from "express"
import { prisma } from "../config/prisma"
import { compare } from "bcrypt";
import { createToken } from "../helpers/token.helper";

export const login = async (req: Request, res: Response) => {
    try {
        // Body
        const { email, password } = req.body;

        // Query
        const account = await prisma.staff.findUnique({
            where: {
                staff_email : email
            }
        })

        if (!account) {
            return res.status(404).send("Account not found")
        }

        // Validate password
        const checkPassword = await compare(password, account?.password as string)
        if (!checkPassword) {
            return res.status(401).send("Wrong password")
        }

        // Auth token
        const token = createToken({ id: account.id })
        res.status(200).send({
            name: account.staff_name,
            email: account.staff_email,
            token
        })
    } catch (error) {
        res.status(500).send(error)
    }
}