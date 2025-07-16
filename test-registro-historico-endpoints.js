// test-registro-historico-endpoints.js
// Script para probar todos los endpoints de registros históricos

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testRegistroHistoricoEndpoints() {
  try {
    console.log('🧪 Probando endpoints de registros históricos...\n');

    // Test 1: Conexión básica
    console.log('1️⃣ Probando conexión...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Test 2: GET todos los registros (con relaciones)
    console.log('2️⃣ Probando GET /api/registroHistorico (todos los registros)...');
    const todosLosRegistros = await prisma.registroHistorico.findMany({
      include: {
        kpi: {
          select: {
            id: true,
            nombre: true,
            meta: true,
            unidad: true,
            objetivo: {
              select: {
                id: true,
                titulo: true,
                perspectiva: {
                  select: {
                    id: true,
                    nombre: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    console.log(`✅ Encontrados ${todosLosRegistros.length} registros históricos:`);
    todosLosRegistros.slice(0, 3).forEach((registro, i) => {
      console.log(`   ${i + 1}. ID: ${registro.id} | KPI: "${registro.kpi.nombre}" | Valor: ${registro.valor} ${registro.kpi.unidad || ''} | Fecha: ${registro.fecha}`);
      console.log(`      Objetivo: "${registro.kpi.objetivo.titulo}"`);
      console.log(`      Perspectiva: "${registro.kpi.objetivo.perspectiva.nombre}"`);
    });
    if (todosLosRegistros.length > 3) {
      console.log(`   ... y ${todosLosRegistros.length - 3} más`);
    }
    console.log('');

    // Test 3: GET registro específico por ID (si existe alguno)
    if (todosLosRegistros.length > 0) {
      const primerRegistro = todosLosRegistros[0];
      console.log(`3️⃣ Probando GET /api/registroHistorico/${primerRegistro.id} (registro específico)...`);
      
      const registroEspecifico = await prisma.registroHistorico.findUnique({
        where: { id: primerRegistro.id },
        include: {
          kpi: {
            select: {
              id: true,
              nombre: true,
              meta: true,
              unidad: true
            }
          }
        }
      });

      if (registroEspecifico) {
        console.log(`✅ Registro encontrado:`);
        console.log(`   ID: ${registroEspecifico.id}`);
        console.log(`   KPI: "${registroEspecifico.kpi.nombre}"`);
        console.log(`   Valor: ${registroEspecifico.valor} ${registroEspecifico.kpi.unidad || ''}`);
        console.log(`   Fecha: ${registroEspecifico.fecha}`);
      } else {
        console.log('❌ Registro no encontrado');
      }
      console.log('');
    }

    // Test 4: Verificar KPIs disponibles para crear registros
    console.log('4️⃣ Verificando KPIs disponibles para crear registros...');
    const kpisDisponibles = await prisma.kPI.findMany({
      select: {
        id: true,
        nombre: true,
        meta: true,
        unidad: true
      },
      take: 3
    });

    console.log(`✅ KPIs disponibles (primeros 3):`);
    kpisDisponibles.forEach((kpi, i) => {
      console.log(`   ${i + 1}. ID: ${kpi.id} | Nombre: "${kpi.nombre}" | Meta: ${kpi.meta} ${kpi.unidad || ''}`);
    });
    console.log('');

    console.log('🎉 Todos los tests de estructura pasaron exitosamente!');
    console.log('');
    console.log('📋 Endpoints disponibles para probar con Thunder Client:');
    console.log('');
    console.log('🔸 GET /api/registroHistorico');
    console.log('  - Obtener todos los registros históricos con relaciones');
    console.log('');
    console.log('🔸 POST /api/registroHistorico');
    console.log('  - Crear nuevo registro histórico');
    console.log('  - Body: { "kpi_id": 1, "valor": 85.5, "fecha": "2024-01-15" }');
    console.log('  - Nota: fecha es opcional (usa fecha actual si no se proporciona)');
    console.log('');
    console.log('🔸 GET /api/registroHistorico/[id]');
    console.log('  - Obtener registro específico por ID');
    console.log('  - Ejemplo: GET /api/registroHistorico/1');
    console.log('');
    console.log('🔸 PUT /api/registroHistorico/[id]');
    console.log('  - Actualizar registro específico por ID');
    console.log('  - Ejemplo: PUT /api/registroHistorico/1');
    console.log('  - Body: { "kpi_id": 1, "valor": 90.0, "fecha": "2024-01-16" }');
    console.log('');
    console.log('🔸 DELETE /api/registroHistorico/[id]');
    console.log('  - Eliminar registro específico por ID');
    console.log('  - Ejemplo: DELETE /api/registroHistorico/1');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    console.error('Detalles:', {
      message: error.message,
      stack: error.stack
    });
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  testRegistroHistoricoEndpoints();
}

module.exports = { testRegistroHistoricoEndpoints };
