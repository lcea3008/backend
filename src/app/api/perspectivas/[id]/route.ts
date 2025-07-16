import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/perspectivas/[id] - Obtener una perspectiva específica por ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando GET /api/perspectivas/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const perspectiva = await prisma.perspectiva.findUnique({
            where: { id },
            include: {
                objetivos: {
                    include: {
                        kpis: {
                            select: {
                                id: true,
                                nombre: true,
                                meta: true,
                                unidad: true,
                                estado_actual: true
                            }
                        }
                    }
                }
            }
        });

        if (!perspectiva) {
            return NextResponse.json({ error: 'Perspectiva no encontrada' }, { status: 404 });
        }

        console.log('✅ [API] Perspectiva encontrada:', perspectiva);
        return NextResponse.json(perspectiva);

    } catch (error) {
        console.error('❌ [API] Error en GET /api/perspectivas/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener perspectiva',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// PUT /api/perspectivas/[id] - Actualizar una perspectiva específica
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando PUT /api/perspectivas/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const body = await req.json();
        const { nombre, descripcion } = body;

        console.log('📝 [API] Datos recibidos:', { id, nombre, descripcion });

        if (!nombre || !descripcion) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'Nombre y descripción son requeridos' }, { status: 400 });
        }

        // Verificar que la perspectiva existe
        const perspectivaExistente = await prisma.perspectiva.findUnique({
            where: { id }
        });

        if (!perspectivaExistente) {
            return NextResponse.json({ error: 'Perspectiva no encontrada' }, { status: 404 });
        }

        const perspectivaActualizada = await prisma.perspectiva.update({
            where: { id },
            data: { nombre, descripcion },
            include: {
                objetivos: true
            }
        });

        console.log('✅ [API] Perspectiva actualizada:', perspectivaActualizada);
        return NextResponse.json(perspectivaActualizada);

    } catch (error) {
        console.error('❌ [API] Error en PUT /api/perspectivas/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al actualizar perspectiva',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// DELETE /api/perspectivas/[id] - Eliminar una perspectiva específica
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando DELETE /api/perspectivas/[id]...');
        const id = parseInt(params.id);

        console.log('📝 [API] ID recibido para eliminar:', id);

        if (isNaN(id)) {
            console.log('❌ [API] Validación fallida: ID debe ser un número válido');
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        // Verificar que la perspectiva existe antes de eliminarla
        const perspectivaExistente = await prisma.perspectiva.findUnique({
            where: { id }
        });

        if (!perspectivaExistente) {
            console.log('❌ [API] Perspectiva no encontrada para eliminar');
            return NextResponse.json({ error: 'Perspectiva no encontrada' }, { status: 404 });
        }

        const perspectivaEliminada = await prisma.perspectiva.delete({
            where: { id }
        });

        console.log('✅ [API] Perspectiva eliminada:', perspectivaEliminada);
        return NextResponse.json({ 
            message: 'Perspectiva eliminada exitosamente',
            perspectiva: perspectivaEliminada 
        }, { status: 200 });

    } catch (error) {
        console.error('❌ [API] Error en DELETE /api/perspectivas/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al eliminar perspectiva',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
