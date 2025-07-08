import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/auth"
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server"
import { withCors, handleOptions } from "@/lib/cors"

export const OPTIONS = handleOptions

export const POST = withCors(async (req: NextRequest) => {
  try {
    const { email, password } = await req.json()
    console.log("Intentando login con email:", email)
    
    const user = await prisma.user.findUnique({ where: { email } })
    console.log("Usuario encontrado:", user ? "Sí" : "No")

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("Contraseña coincide:", passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const token = signToken({ userId: user.id, role: user.role })
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error en login:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "Error interno del servidor", details: errorMessage }, { status: 500 })
  }
})
