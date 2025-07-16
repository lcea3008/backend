import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/registroHistorico - Obtener todos los registros históricos
export async function GET() {
    try {
        console.log('🔍 [API] Iniciando GET /api/registroHistorico...');
        const registros = await prisma.registroHistorico.findMany({
            include: {
                kpi: {
                    select: {
                        id: true,
                        nombre: true,
                        unidad: true
                    }
                }
            },
            orderBy: {
                fecha: 'desc'
            }
        });
        console.log(`✅ [API] Encontrados ${registros.length} registros históricos`);
        return NextResponse.json(registros);
    } catch (error) {
        console.error('❌ [API] Error en GET /api/registroHistorico:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener registros históricos',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// POST /api/registroHistorico - Crear un nuevo registro histórico
export async function POST(req: Request) {
    try {
        console.log('🔍 [API] Iniciando POST /api/registroHistorico...');
        const body = await req.json();
        const { kpi_id, valor, fecha } = body;

        console.log('📝 [API] Datos recibidos:', { kpi_id, valor, fecha });

        if (!kpi_id || !valor) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'kpi_id y valor son requeridos' }, { status: 400 });
        }

        // Verificar que el KPI existe
        const kpiExiste = await prisma.kPI.findUnique({
            where: { id: parseInt(kpi_id) }
        });

        if (!kpiExiste) {
            return NextResponse.json({ error: 'El KPI especificado no existe' }, { status: 400 });
        }

        const nuevoRegistro = await prisma.registroHistorico.create({
            data: { 
                kpi_id: parseInt(kpi_id), 
                valor: parseFloat(valor), 
                fecha: fecha ? new Date(fecha) : new Date()
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

        console.log('✅ [API] Registro histórico creado:', nuevoRegistro);
        return NextResponse.json(nuevoRegistro, { status: 201 });
    } catch (error) {
        console.error('❌ [API] Error en POST /api/registroHistorico:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al crear registro histórico',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
} 