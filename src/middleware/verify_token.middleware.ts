import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            throw { message: "Token not exist" }
        }

        const decript = verify(token, process.env.SECRET || "secret")
        res.locals.decript = decript

        next()
    } catch (error) {
        res.status(500).send(error)
    }
}

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = res.locals.decript as { id: number; role: string };

            if (!user) {
                return res.status(401).json({
                    message: "Unauthorized",
                })
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    message: "Your role is not authorized",
                })
            }

            next()
        } catch (error) {
            res.status(500).send(error)
        }
    }
}