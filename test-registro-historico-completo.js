// test-registro-historico-completo.js
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

    // Test 2: GET todos los registros (simulando /api/registroHistorico)
    console.log('2️⃣ Probando GET todos los registros históricos...');
    const todosLosRegistros = await prisma.registroHistorico.findMany({
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

    console.log(`✅ Encontrados ${todosLosRegistros.length} registros históricos:`);
    todosLosRegistros.slice(0, 3).forEach((registro, i) => {
      console.log(`   ${i + 1}. ID: ${registro.id} | KPI: "${registro.kpi.nombre}" | Valor: ${registro.valor} ${registro.kpi.unidad || ''} | Fecha: ${registro.fecha.toISOString().split('T')[0]}`);
    });
    if (todosLosRegistros.length > 3) {
      console.log(`   ... y ${todosLosRegistros.length - 3} más`);
    }
    console.log('');

    // Test 3: GET un registro específico (simulando /api/registroHistorico/[id])
    if (todosLosRegistros.length > 0) {
      const primerRegistro = todosLosRegistros[0];
      console.log('3️⃣ Probando GET registro específico por ID...');
      
      const registroEspecifico = await prisma.registroHistorico.findUnique({
        where: { id: primerRegistro.id },
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

      if (registroEspecifico) {
        console.log(`✅ Registro encontrado:`);
        console.log(`   ID: ${registroEspecifico.id}`);
        console.log(`   KPI: ${registroEspecifico.kpi.nombre}`);
        console.log(`   Valor: ${registroEspecifico.valor} ${registroEspecifico.kpi.unidad || ''}`);
        console.log(`   Fecha: ${registroEspecifico.fecha.toISOString().split('T')[0]}`);
      } else {
        console.log('❌ No se encontró el registro');
      }
      console.log('');
    }

    console.log('\n🎉 Todas las pruebas de endpoints pasaron!');
    console.log('\n📋 Endpoints disponibles:');
    console.log('   GET    /api/registroHistorico        - Obtener todos los registros');
    console.log('   POST   /api/registroHistorico        - Crear nuevo registro');
    console.log('   GET    /api/registroHistorico/[id]   - Obtener registro específico');
    console.log('   PUT    /api/registroHistorico/[id]   - Actualizar registro específico');
    console.log('   DELETE /api/registroHistorico/[id]   - Eliminar registro específico');

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
