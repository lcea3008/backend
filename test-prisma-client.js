// test-prisma-client.js
// Script para probar que el cliente de Prisma funciona correctamente

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testPrismaClient() {
  try {
    console.log('🧪 Probando el cliente de Prisma...\n');

    // Test 1: Conexión básica
    console.log('1️⃣ Probando conexión...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Test 2: Query de perspectivas
    console.log('2️⃣ Probando query de perspectivas...');
    const perspectivas = await prisma.perspectiva.findMany();
    console.log(`✅ Encontradas ${perspectivas.length} perspectivas:`);
    perspectivas.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.nombre} - ${p.descripcion}`);
    });
    console.log('');

    // Test 3: Query de usuarios
    console.log('3️⃣ Probando query de usuarios...');
    const usuarios = await prisma.user.findMany({
      select: { id: true, nombre: true, email: true, role: true }
    });
    console.log(`✅ Encontrados ${usuarios.length} usuarios:`);
    usuarios.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.nombre} (${u.email}) - Rol: ${u.role}`);
    });
    console.log('');

    // Test 4: Query con relaciones
    console.log('4️⃣ Probando query con relaciones...');
    const perspectivasConObjetivos = await prisma.perspectiva.findMany({
      include: {
        objetivos: {
          include: {
            kpis: true
          }
        }
      }
    });
    console.log('✅ Query con relaciones exitosa:');
    perspectivasConObjetivos.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.nombre}:`);
      p.objetivos.forEach((obj, j) => {
        console.log(`      ${j + 1}. ${obj.titulo} (${obj.kpis.length} KPIs)`);
      });
    });

    console.log('\n🎉 Todas las pruebas pasaron exitosamente!');
    console.log('✅ El cliente de Prisma está funcionando correctamente');

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
  testPrismaClient();
}

module.exports = { testPrismaClient };
