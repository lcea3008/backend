import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { withCors, handleOptions } from "@/lib/cors"

export const OPTIONS = handleOptions

export const POST = withCors(async (req: NextRequest) => {
  const {nombre, email, password, role = "USER" } = await req.json()
  const userExists = await prisma.user.findUnique({ where: { email } })

  if (userExists)
    return NextResponse.json({ error: "Ya existe el usuario" }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { nombre, email, password: hashedPassword, role: role || "USER" },
  })

  return NextResponse.json({ id: user.id, email: user.email })
})
