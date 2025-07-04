import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { withCors, handleOptions } from "@/lib/cors"

export const OPTIONS = handleOptions

export const GET = withCors(async (req: NextRequest) => {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const objetivos = await prisma.objetivo.findMany({
    include: { indicadores: true }
  })

  return NextResponse.json(objetivos)
})

export const POST = withCors(async (req: NextRequest) => {
  const user = getUserFromRequest(req)
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const data = await req.json()
  const nuevo = await prisma.objetivo.create({ data })
  return NextResponse.json(nuevo)
})

export const PUT = withCors(async (req: NextRequest) => {
  const user = getUserFromRequest(req)
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 })

  const data = await req.json()
  const actualizado = await prisma.objetivo.update({
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
  const id = url.searchParams.get("id")
  
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 })

  await prisma.objetivo.delete({ where: { id } })
  return NextResponse.json({ message: "Objetivo eliminado" })
})
