// test-kpi-endpoint.js
// Script para probar específicamente el endpoint de KPIs

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testKPIEndpoint() {
  try {
    console.log('🧪 Probando el endpoint de KPIs...\n');

    // Test 1: Conexión básica
    console.log('1️⃣ Probando conexión...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Test 2: Verificar que el modelo KPI existe y funciona
    console.log('2️⃣ Probando modelo KPI directamente...');
    try {
      const kpis = await prisma.kPI.findMany();
      console.log(`✅ Encontrados ${kpis.length} KPIs usando prisma.kPI.findMany()`);
      
      kpis.forEach((kpi, i) => {
        console.log(`   ${i + 1}. ${kpi.nombre} - Meta: ${kpi.meta} ${kpi.unidad || ''}`);
      });
      console.log('');
    } catch (modelError) {
      console.error('❌ Error con el modelo KPI:', modelError.message);
      
      // Intentar con minúsculas
      console.log('🔄 Intentando con prisma.kpi...');
      try {
        const kpis = await prisma.kpi.findMany();
        console.log(`✅ Encontrados ${kpis.length} KPIs usando prisma.kpi.findMany()`);
      } catch (e) {
        console.error('❌ También falló con minúsculas:', e.message);
      }
    }

    // Test 3: Query con relaciones
    console.log('3️⃣ Probando query con relaciones...');
    try {
      const kpisConRelaciones = await prisma.kPI.findMany({
        include: {
          objetivo: {
            include: {
              perspectiva: true
            }
          }
        }
      });
      console.log(`✅ Query con relaciones exitosa: ${kpisConRelaciones.length} KPIs`);
      
      kpisConRelaciones.forEach((kpi, i) => {
        console.log(`   ${i + 1}. ${kpi.nombre}`);
        console.log(`      Objetivo: ${kpi.objetivo.titulo}`);
        console.log(`      Perspectiva: ${kpi.objetivo.perspectiva.nombre}`);
      });
      console.log('');
    } catch (relationError) {
      console.error('❌ Error en query con relaciones:', relationError.message);
    }

    // Test 4: Verificar estructura de la tabla KPIs
    console.log('4️⃣ Verificando estructura de la tabla KPIs...');
    const tableInfo = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'KPIs'
      ORDER BY ORDINAL_POSITION
    `;
    
    console.log('✅ Estructura de la tabla KPIs:');
    tableInfo.forEach(col => {
      console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    console.log('\n🎉 Pruebas del endpoint KPI completadas!');

  } catch (error) {
    console.error('❌ Error general en las pruebas:', error);
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
  testKPIEndpoint();
}

module.exports = { testKPIEndpoint };
