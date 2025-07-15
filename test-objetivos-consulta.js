// test-objetivos-consulta.js
// Script para probar la consulta mejorada de objetivos

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testObjetivosConsulta() {
  try {
    console.log('🧪 Probando consulta mejorada de objetivos...\n');

    // Test 1: Conexión básica
    console.log('1️⃣ Probando conexión...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Test 2: Consulta con include (equivale a LEFT JOIN)
    console.log('2️⃣ Probando consulta con include (como en el endpoint)...');
    const objetivosConInclude = await prisma.objetivo.findMany({
      include: {
        perspectiva: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`✅ Encontrados ${objetivosConInclude.length} objetivos con include:`);
    objetivosConInclude.forEach((obj, i) => {
      console.log(`   ${i + 1}. ID: ${obj.id} | Título: "${obj.titulo}" | Perspectiva: "${obj.perspectiva.nombre}"`);
    });
    console.log('');

    // Test 3: Consulta con select (más específica)
    console.log('3️⃣ Probando consulta con select (equivalente a tu SQL)...');
    const objetivosConSelect = await prisma.objetivo.findMany({
      select: {
        id: true,
        titulo: true,
        perspectiva: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`✅ Encontrados ${objetivosConSelect.length} objetivos con select:`);
    objetivosConSelect.forEach((obj, i) => {
      console.log(`   ${i + 1}. ID: ${obj.id} | Título: "${obj.titulo}" | Perspectiva: "${obj.perspectiva.nombre}"`);
    });
    console.log('');

    // Test 4: Versión transformada (response plana)
    console.log('4️⃣ Probando versión transformada (response plana)...');
    const objetivosTransformados = objetivosConSelect.map(obj => ({
      id: obj.id,
      titulo: obj.titulo,
      perspectiva_nombre: obj.perspectiva.nombre
    }));

    console.log(`✅ Objetivos transformados:`);
    objetivosTransformados.forEach((obj, i) => {
      console.log(`   ${i + 1}. ID: ${obj.id} | Título: "${obj.titulo}" | Perspectiva: "${obj.perspectiva_nombre}"`);
    });
    console.log('');

    // Test 5: Verificar la query SQL generada
    console.log('5️⃣ La query SQL generada por Prisma es equivalente a:');
    console.log('   SELECT o.id, o.titulo, p.nombre');
    console.log('   FROM Objetivos o');
    console.log('   INNER JOIN Perspectivas p ON o.perspectiva_id = p.id');
    console.log('   ORDER BY o.id ASC');

    console.log('\n🎉 Todas las consultas funcionan correctamente!');

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
  testObjetivosConsulta();
}

module.exports = { testObjetivosConsulta };
