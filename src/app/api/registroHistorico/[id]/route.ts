import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/registroHistorico/[id] - Obtener un registro específico por ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando GET /api/registroHistorico/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const registro = await prisma.registroHistorico.findUnique({
            where: { id },
            include: {
                kpi: {
                    select: {
                        id: true,
                        nombre: true,
                        unidad: true
                    }
                }
            }
        });

        if (!registro) {
            return NextResponse.json({ error: 'Registro histórico no encontrado' }, { status: 404 });
        }

        console.log('✅ [API] Registro histórico encontrado:', registro);
        return NextResponse.json(registro);

    } catch (error) {
        console.error('❌ [API] Error en GET /api/registroHistorico/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener registro histórico',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// PUT /api/registroHistorico/[id] - Actualizar un registro específico
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando PUT /api/registroHistorico/[id]...');
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const body = await req.json();
        const { kpi_id, valor, fecha } = body;

        console.log('📝 [API] Datos recibidos:', { id, kpi_id, valor, fecha });

        if (!kpi_id || !valor) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'kpi_id y valor son requeridos' }, { status: 400 });
        }

        // Verificar que el registro existe
        const registroExistente = await prisma.registroHistorico.findUnique({
            where: { id }
        });

        if (!registroExistente) {
            return NextResponse.json({ error: 'Registro histórico no encontrado' }, { status: 404 });
        }

        const registroActualizado = await prisma.registroHistorico.update({
            where: { id },
            data: { 
                kpi_id: parseInt(kpi_id), 
                valor: parseFloat(valor), 
                fecha: fecha ? new Date(fecha) : undefined 
            },
            include: {
                kpi: {
                    select: {
                        id: true,
                        nombre: true,
                        unidad: true
                    }
                }
            }
        });

        console.log('✅ [API] Registro histórico actualizado:', registroActualizado);
        return NextResponse.json(registroActualizado);

    } catch (error) {
        console.error('❌ [API] Error en PUT /api/registroHistorico/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al actualizar registro histórico',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// DELETE /api/registroHistorico/[id] - Eliminar un registro específico
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 [API] Iniciando DELETE /api/registroHistorico/[id]...');
        const id = parseInt(params.id);

        console.log('📝 [API] ID recibido para eliminar:', id);

        if (isNaN(id)) {
            console.log('❌ [API] Validación fallida: ID debe ser un número válido');
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        // Verificar que el registro existe antes de eliminarlo
        const registroExistente = await prisma.registroHistorico.findUnique({
            where: { id }
        });

        if (!registroExistente) {
            console.log('❌ [API] Registro no encontrado para eliminar');
            return NextResponse.json({ error: 'Registro histórico no encontrado' }, { status: 404 });
        }

        const registroEliminado = await prisma.registroHistorico.delete({
            where: { id }
        });

        console.log('✅ [API] Registro histórico eliminado:', registroEliminado);
        return NextResponse.json({ 
            message: 'Registro eliminado exitosamente',
            registro: registroEliminado 
        }, { status: 200 });

    } catch (error) {
        console.error('❌ [API] Error en DELETE /api/registroHistorico/[id]:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al eliminar registro histórico',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
