import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/kpi/[id] - Obtener un KPI específico por ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando GET /api/kpi/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const kpi = await prisma.kPI.findUnique({
            where: { id },
            include: {
                objetivo: {
                    include: {
                        perspectiva: {
                            select: {
                                id: true,
                                nombre: true,
                                descripcion: true
                            }
                        }
                    }
                },
                iniciativas: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true,
                        fecha_inicio: true,
                        fecha_fin: true,
                        progreso: true
                    }
                },
                historicos: {
                    select: {
                        id: true,
                        valor: true,
                        fecha: true
                    },
                    orderBy: {
                        fecha: 'desc'
                    },
                    take: 10
                }
            }
        });

        if (!kpi) {
            return NextResponse.json({ error: 'KPI no encontrado' }, { status: 404 });
        }

        console.log('✅ [API] KPI encontrado:', kpi);
        return NextResponse.json(kpi);

    } catch (error) {
        console.error('❌ [API] Error en GET /api/kpi/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener KPI',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// PUT /api/kpi/[id] - Actualizar un KPI específico
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando PUT /api/kpi/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const body = await req.json();
        const { nombre, meta, unidad, objetivo_id, estado_actual } = body;

        console.log('📝 [API] Datos recibidos:', { id, nombre, meta, unidad, objetivo_id, estado_actual });

        if (!nombre || !meta || !objetivo_id) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'Nombre, meta y objetivo_id son requeridos' }, { status: 400 });
        }

        // Verificar que el KPI existe
        const kpiExistente = await prisma.kPI.findUnique({
            where: { id }
        });

        if (!kpiExistente) {
            return NextResponse.json({ error: 'KPI no encontrado' }, { status: 404 });
        }

        // Verificar que el objetivo existe
        const objetivoExiste = await prisma.objetivo.findUnique({
            where: { id: parseInt(objetivo_id) }
        });

        if (!objetivoExiste) {
            return NextResponse.json({ error: 'El objetivo especificado no existe' }, { status: 400 });
        }

        const kpiActualizado = await prisma.kPI.update({
            where: { id },
            data: {
                nombre,
                meta: parseFloat(meta),
                unidad: unidad || null,
                objetivo_id: parseInt(objetivo_id),
                estado_actual: estado_actual ? parseFloat(estado_actual) : null
            },
            include: {
                objetivo: {
                    include: {
                        perspectiva: true
                    }
                }
            }
        });

        console.log('✅ [API] KPI actualizado:', kpiActualizado);
        return NextResponse.json(kpiActualizado);

    } catch (error) {
        console.error('❌ [API] Error en PUT /api/kpi/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al actualizar KPI',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// DELETE /api/kpi/[id] - Eliminar un KPI específico
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando DELETE /api/kpi/[id]...');
        const id = parseInt(params.id);

        console.log('📝 [API] ID recibido para eliminar:', id);

        if (isNaN(id)) {
            console.log('❌ [API] Validación fallida: ID debe ser un número válido');
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        // Verificar que el KPI existe antes de eliminarlo
        const kpiExistente = await prisma.kPI.findUnique({
            where: { id }
        });

        if (!kpiExistente) {
            console.log('❌ [API] KPI no encontrado para eliminar');
            return NextResponse.json({ error: 'KPI no encontrado' }, { status: 404 });
        }

        const kpiEliminado = await prisma.kPI.delete({
            where: { id }
        });

        console.log('✅ [API] KPI eliminado:', kpiEliminado);
        return NextResponse.json({ 
            message: 'KPI eliminado exitosamente',
            kpi: kpiEliminado 
        }, { status: 200 });

    } catch (error) {
        console.error('❌ [API] Error en DELETE /api/kpi/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al eliminar KPI',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
