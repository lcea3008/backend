import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get: Obtener todos los KPIs
export async function GET() {
    try{
        console.log('🔍 [API] Iniciando GET /api/kpi...');

        const kpis = await prisma.kPI.findMany();
        
        console.log(`✅ [API] Encontrados ${kpis.length} KPIs`);
        
        return NextResponse.json(kpis);
    }catch (error){
        console.error('❌ [API] Error en GET /api/kpi:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });
        
        return NextResponse.json({ 
            error: 'Error al obtener KPIs',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}

// POST: Crear un nuevo KPI
export async function POST(req: Request) {
    try {
        console.log('🔍 [API] Iniciando POST /api/kpi...');
        
        const body = await req.json();
        const { nombre, meta, unidad, objetivo_id, estado_actual } = body;

        console.log('📝 [API] Datos recibidos:', { nombre, meta, unidad, objetivo_id, estado_actual });

        // Validaciones
        if (!nombre || !meta || !objetivo_id) {
            console.log('❌ [API] Validación fallida: campos requeridos faltantes');
            return NextResponse.json({ 
                error: 'Nombre, meta y objetivo_id son requeridos' 
            }, { status: 400 });
        }

        // Verificar que el objetivo existe
        const objetivoExiste = await prisma.objetivo.findUnique({
            where: { id: objetivo_id }
        });

        if (!objetivoExiste) {
            return NextResponse.json({ 
                error: 'El objetivo especificado no existe' 
            }, { status: 400 });
        }

        const nuevoKPI = await prisma.kPI.create({
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

        console.log('✅ [API] KPI creado:', nuevoKPI);

        return NextResponse.json(nuevoKPI, { status: 201 });
    } catch (error) {
        console.error('❌ [API] Error en POST /api/kpi:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
            name: error instanceof Error ? error.name : 'Unknown'
        });
        
        return NextResponse.json({ 
            error: 'Error al crear KPI',
            details: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}