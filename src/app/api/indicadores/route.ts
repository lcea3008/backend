import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { withCors, handleOptions } from "@/lib/cors"

export const OPTIONS = handleOptions

export const GET = withCors(async (req: NextRequest) => {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const data = await prisma.indicador.findMany({
    include: { objetivo: true }
  })
  return NextResponse.json(data)
})

export const POST = withCors(async (req: NextRequest) => {
  const user = getUserFromRequest(req)
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const data = await req.json()
  const creado = await prisma.indicador.create({ data })
  return NextResponse.json(creado)
})

export const PUT = withCors(async (req: NextRequest) => {
  const user = getUserFromRequest(req)
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const url = new URL(req.url)
  const idParam = url.searchParams.get("id")
  
  if (!idParam) return NextResponse.json({ error: "ID requerido" }, { status: 400 })

  const id = parseInt(idParam, 10)
  if (isNaN(id)) return NextResponse.json({ error: "ID debe ser un número válido" }, { status: 400 })

  const data = await req.json()
  const actualizado = await prisma.indicador.update({
    where: { id },
    data
  })
  return NextResponse.json(actualizado)
})

export const DELETE = withCors(async (req: NextRequest) => {
  const user = getUserFromRequest(req)
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const url = new URL(req.url)
  const idParam = url.searchParams.get("id")
  
  if (!idParam) return NextResponse.json({ error: "ID requerido" }, { status: 400 })

  const id = parseInt(idParam, 10)
  if (isNaN(id)) return NextResponse.json({ error: "ID debe ser un número válido" }, { status: 400 })

  await prisma.indicador.delete({ where: { id } })
  return NextResponse.json({ message: "Indicador eliminado" })
})
