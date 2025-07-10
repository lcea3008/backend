//api/objectivos
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

//Get: Obtener todos los objetivos
export async function GET() {
  try {
    console.log('🔍 [API] Iniciando GET /api/objectivos...')
    
    const objetivos = await prisma.objetivo.findMany()

    console.log(`✅ [API] Encontrados ${objetivos.length} objetivos`)

    return NextResponse.json(objetivos)
  } catch (error) {
    console.error('❌ [API] Error en GET /api/objectivos:', error)
    console.error('Detalles del error:', {
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : 'Sin traza de pila',
      name: error instanceof Error ? error.name : 'Desconocido'
    })
    return NextResponse.json({ error: 'Error al obtener objetivos',
        details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

// POST: Insertar un nuevo objetivo
export async function POST(req: Request) {
  try{
    console.log('🔍 [API] Iniciando POST /api/objectivos...')
    const body = await req.json()
    const {nombre: titulo, perspectivaId: perspectiva_id} = body

    console.log('📝 [API] Datos recibidos:', { nombre: titulo, perspectivaId: perspectiva_id   })
    if (!titulo || !perspectiva_id) {
      console.log('❌ [API] Validación fallida: campos requeridos faltantes')
      return NextResponse.json({ error: 'Nombre y perspectivaId son requeridos' }, { status: 400 })
    }
    const nuevoObjetivo = await prisma.objetivo.create({
        data: { titulo, perspectiva_id }
    })
    console.log('✅ [API] Objetivo creado:', nuevoObjetivo)
    return NextResponse.json(nuevoObjetivo, { status: 201 })

  } catch (error) {
    console.error('❌ [API] Error en POST /api/objectivos:', error)
    console.error('Detalles del error:', {
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : 'Sin traza de pila',
      name: error instanceof Error ? error.name : 'Desconocido'
    })
    return NextResponse.json({ error: 'Error al crear objetivo',
        details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
