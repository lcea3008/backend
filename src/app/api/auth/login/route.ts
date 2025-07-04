import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/auth"
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server"
import { withCors, handleOptions } from "@/lib/cors"

export const OPTIONS = handleOptions

export const POST = withCors(async (req: NextRequest) => {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
  }

  const token = signToken({ userId: user.id, role: user.role })
  return NextResponse.json({ token })
})
