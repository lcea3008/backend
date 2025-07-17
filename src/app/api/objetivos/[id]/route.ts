import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/objetivos/[id] - Obtener un objetivo específico por ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando GET /api/objetivos/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const objetivo = await prisma.objetivo.findUnique({
            where: { id },
            include: {
                perspectiva: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true
                    }
                },
                kpis: {
                    select: {
                        id: true,
                        nombre: true,
                        meta: true,
                        unidad: true,
                        estado_actual: true,
                        fecha_actualizacion: true
                    }
                }
            }
        });

        if (!objetivo) {
            return NextResponse.json({ error: 'Objetivo no encontrado' }, { status: 404 });
        }

        console.log('✅ [API] Objetivo encontrado:', objetivo);
        return NextResponse.json(objetivo);

    } catch (error) {
        console.error('❌ [API] Error en GET /api/objetivos/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener objetivo',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// PUT /api/objetivos/[id] - Actualizar un objetivo específico
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando PUT /api/objetivos/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const body = await req.json();
        const { nombre: titulo, perspectivaId: perspectiva_id } = body;

        console.log('📝 [API] Datos recibidos:', { id, titulo, perspectiva_id });

        if (!titulo || !perspectiva_id) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'Título y perspectiva_id son requeridos' }, { status: 400 });
        }

        // Verificar que el objetivo existe
        const objetivoExistente = await prisma.objetivo.findUnique({
            where: { id }
        });

        if (!objetivoExistente) {
            return NextResponse.json({ error: 'Objetivo no encontrado' }, { status: 404 });
        }

        // Verificar que la perspectiva existe
        const perspectivaExiste = await prisma.perspectiva.findUnique({
            where: { id: parseInt(perspectiva_id) }
        });

        if (!perspectivaExiste) {
            return NextResponse.json({ error: 'La perspectiva especificada no existe' }, { status: 400 });
        }

        const objetivoActualizado = await prisma.objetivo.update({
            where: { id },
            data: { 
                titulo, 
                perspectiva_id: parseInt(perspectiva_id) 
            },
            include: {
                perspectiva: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true
                    }
                },
                kpis: true
            }
        });

        console.log('✅ [API] Objetivo actualizado:', objetivoActualizado);
        return NextResponse.json(objetivoActualizado);

    } catch (error) {
        console.error('❌ [API] Error en PUT /api/objetivos/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al actualizar objetivo',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// DELETE /api/objetivos/[id] - Eliminar un objetivo específico
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando DELETE /api/objetivos/[id]...');
        const id = parseInt(params.id);

        console.log('📝 [API] ID recibido para eliminar:', id);

        if (isNaN(id)) {
            console.log('❌ [API] Validación fallida: ID debe ser un número válido');
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        // Verificar que el objetivo existe antes de eliminarlo
        const objetivoExistente = await prisma.objetivo.findUnique({
            where: { id }
        });

        if (!objetivoExistente) {
            console.log('❌ [API] Objetivo no encontrado para eliminar');
            return NextResponse.json({ error: 'Objetivo no encontrado' }, { status: 404 });
        }

        const objetivoEliminado = await prisma.objetivo.delete({
            where: { id }
        });

        console.log('✅ [API] Objetivo eliminado:', objetivoEliminado);
        return NextResponse.json({ 
            message: 'Objetivo eliminado exitosamente',
            objetivo: objetivoEliminado 
        }, { status: 200 });

    } catch (error) {
        console.error('❌ [API] Error en DELETE /api/objetivos/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al eliminar objetivo',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
