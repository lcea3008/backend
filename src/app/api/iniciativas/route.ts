import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/iniciativas
export async function GET() {
    try{
        console.log('🔍 [API] Iniciando GET /api/iniciativas...');
        const iniciativas = await prisma.iniciativa.findMany();
        console.log(`✅ [API] Encontradas ${iniciativas.length} iniciativas`);
        return NextResponse.json(iniciativas);

    }catch(error) {
        console.error('❌ [API] Error en GET /api/iniciativas:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al obtener iniciativas',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }

}

// POST /api/iniciativas
export async function POST(req: Request) {
    try{
        console.log('🔍 [API] Iniciando POST /api/iniciativas...');
        const body = await req.json();
        const { nombre, descripcion, kpi_id, fecha_inicio, fecha_fin, responsable_id, progreso } = body;

        console.log('📝 [API] Datos recibidos:', { nombre, descripcion, kpi_id, fecha_inicio, fecha_fin, responsable_id, progreso });
        // Validaciones
        if (!nombre || !descripcion || !kpi_id || !fecha_inicio || !fecha_fin || !responsable_id) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
        }
        const nuevaIniciativa = await prisma.iniciativa.create({
            data: {
                nombre,
                descripcion,
                kpi_id,
                fecha_inicio,
                fecha_fin,
                responsable_id,
                progreso
            }
        });
        console.log('✅ [API] Iniciativa creada:', nuevaIniciativa);
        return NextResponse.json(nuevaIniciativa, { status: 201 });
    }catch(error) {
        console.error('❌ [API] Error en POST /api/iniciativas:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });

        return NextResponse.json({
            error: 'Error al crear iniciativa',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }

}

// PATH: src/app/api/iniciativas/route.ts
