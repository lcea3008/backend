import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/registroHistorico
export async function GET() {
    try{
        console.log('🔍 [API] Iniciando GET /api/registroHistorico...');
        const registros = await prisma.registroHistorico.findMany()
        console.log(`✅ [API] Encontrados ${registros.length} registros históricos`);
        return NextResponse.json(registros);
    }catch(error) {
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
