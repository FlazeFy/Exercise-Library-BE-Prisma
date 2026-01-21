import { sign } from "jsonwebtoken"

export const createToken = (data: any) => {
    return sign(data, process.env.SECRET || "secret", { expiresIn: "24h" })
}