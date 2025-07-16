import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/iniciativas/[id] - Obtener una iniciativa específica por ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando GET /api/iniciativas/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const iniciativa = await prisma.iniciativa.findUnique({
            where: { id },
            include: {
                kpi: {
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
                        }
                    }
                },
                responsable: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        if (!iniciativa) {
            return NextResponse.json({ error: 'Iniciativa no encontrada' }, { status: 404 });
        }

        console.log('✅ [API] Iniciativa encontrada:', iniciativa);
        return NextResponse.json(iniciativa);

    } catch (error) {
        console.error('❌ [API] Error en GET /api/iniciativas/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener iniciativa',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// PUT /api/iniciativas/[id] - Actualizar una iniciativa específica
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando PUT /api/iniciativas/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const body = await req.json();
        const { nombre, descripcion, kpi_id, fecha_inicio, fecha_fin, responsable_id, progreso } = body;

        console.log('📝 [API] Datos recibidos:', { id, nombre, descripcion, kpi_id, fecha_inicio, fecha_fin, responsable_id, progreso });

        if (!nombre || !kpi_id) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'Nombre y kpi_id son requeridos' }, { status: 400 });
        }

        // Verificar que la iniciativa existe
        const iniciativaExistente = await prisma.iniciativa.findUnique({
            where: { id }
        });

        if (!iniciativaExistente) {
            return NextResponse.json({ error: 'Iniciativa no encontrada' }, { status: 404 });
        }

        // Verificar que el KPI existe
        const kpiExiste = await prisma.kPI.findUnique({
            where: { id: parseInt(kpi_id) }
        });

        if (!kpiExiste) {
            return NextResponse.json({ error: 'El KPI especificado no existe' }, { status: 400 });
        }

        // Verificar que el responsable existe (si se proporciona)
        if (responsable_id) {
            const responsableExiste = await prisma.user.findUnique({
                where: { id: parseInt(responsable_id) }
            });

            if (!responsableExiste) {
                return NextResponse.json({ error: 'El responsable especificado no existe' }, { status: 400 });
            }
        }

        const iniciativaActualizada = await prisma.iniciativa.update({
            where: { id },
            data: {
                nombre,
                descripcion: descripcion || null,
                kpi_id: parseInt(kpi_id),
                fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
                fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
                responsable_id: responsable_id ? parseInt(responsable_id) : null,
                progreso: progreso ? parseInt(progreso) : null
            },
            include: {
                kpi: {
                    include: {
                        objetivo: {
                            include: {
                                perspectiva: true
                            }
                        }
                    }
                },
                responsable: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        console.log('✅ [API] Iniciativa actualizada:', iniciativaActualizada);
        return NextResponse.json(iniciativaActualizada);

    } catch (error) {
        console.error('❌ [API] Error en PUT /api/iniciativas/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al actualizar iniciativa',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// DELETE /api/iniciativas/[id] - Eliminar una iniciativa específica
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando DELETE /api/iniciativas/[id]...');
        const id = parseInt(params.id);

        console.log('📝 [API] ID recibido para eliminar:', id);

        if (isNaN(id)) {
            console.log('❌ [API] Validación fallida: ID debe ser un número válido');
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        // Verificar que la iniciativa existe antes de eliminarla
        const iniciativaExistente = await prisma.iniciativa.findUnique({
            where: { id }
        });

        if (!iniciativaExistente) {
            console.log('❌ [API] Iniciativa no encontrada para eliminar');
            return NextResponse.json({ error: 'Iniciativa no encontrada' }, { status: 404 });
        }

        const iniciativaEliminada = await prisma.iniciativa.delete({
            where: { id }
        });

        console.log('✅ [API] Iniciativa eliminada:', iniciativaEliminada);
        return NextResponse.json({ 
            message: 'Iniciativa eliminada exitosamente',
            iniciativa: iniciativaEliminada 
        }, { status: 200 });

    } catch (error) {
        console.error('❌ [API] Error en DELETE /api/iniciativas/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al eliminar iniciativa',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
