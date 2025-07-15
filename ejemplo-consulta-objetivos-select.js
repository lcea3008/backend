// Alternativa con select (más específica - solo campos requeridos)
// Esta consulta es equivalente a: SELECT o.id, o.titulo, p.nombre FROM Objetivos o INNER JOIN Perspectivas p ON o.perspectiva_id = p.id

export async function GET_ALTERNATIVE() {
  try {
    console.log('🔍 [API] Iniciando GET /api/objetivos (versión select)...')
    
    const objetivos = await prisma.objetivo.findMany({
      select: {
        id: true,
        titulo: true,
        perspectiva: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    })

    // Transformar la respuesta para que sea más plana (opcional)
    const objetivosTransformados = objetivos.map(obj => ({
      id: obj.id,
      titulo: obj.titulo,
      perspectiva_nombre: obj.perspectiva.nombre
    }))

    console.log(`✅ [API] Encontrados ${objetivos.length} objetivos`)

    return NextResponse.json(objetivosTransformados)
  } catch (error) {
    console.error('❌ [API] Error en GET /api/objetivos:', error)
    return NextResponse.json({ 
      error: 'Error al obtener objetivos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
