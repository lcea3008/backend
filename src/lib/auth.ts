import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

interface UserPayload {
  userId: number  // Cambiado de string a number
  role: string
}

export function signToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" })
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
}

export function getUserFromRequest(req: NextRequest): UserPayload | null {
  const auth = req.headers.get("authorization")
  if (!auth) return null
  const token = auth.split(" ")[1]
  try {
    return verifyToken(token)
  } catch {
    return null
  }
}
