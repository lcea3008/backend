// app/api/perspectivas/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Obtener todas las perspectivas
export async function GET() {
  try {
    console.log('🔍 [API] Iniciando GET /api/perspectivas...')
    
    const perspectivas = await prisma.perspectiva.findMany()
    
    console.log(`✅ [API] Encontradas ${perspectivas.length} perspectivas`)
    
    return NextResponse.json(perspectivas)
  } catch (error) {
    console.error('❌ [API] Error en GET /api/perspectivas:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return NextResponse.json({ 
      error: 'Error al obtener perspectivas',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST: Insertar una nueva perspectiva
export async function POST(req: Request) {
  try {
    console.log('🔍 [API] Iniciando POST /api/perspectivas...')
    
    const body = await req.json()
    const { nombre, descripcion } = body

    console.log('📝 [API] Datos recibidos:', { nombre, descripcion })

    if (!nombre || !descripcion) {
      console.log('❌ [API] Validación fallida: campos requeridos faltantes')
      return NextResponse.json({ error: 'Nombre y descripción son requeridos' }, { status: 400 })
    }

    const nuevaPerspectiva = await prisma.perspectiva.create({
      data: { nombre, descripcion }
    })

    console.log('✅ [API] Perspectiva creada:', nuevaPerspectiva)

    return NextResponse.json(nuevaPerspectiva, { status: 201 })
  } catch (error) {
    console.error('❌ [API] Error en POST /api/perspectivas:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return NextResponse.json({ 
      error: 'Error al crear perspectiva',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
