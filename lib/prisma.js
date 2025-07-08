// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

// Crear instancia única de Prisma (patrón singleton)
// Esto evita múltiples conexiones en desarrollo
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// En desarrollo, reutilizar la conexión
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Función para cerrar la conexión de manera segura
async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Función para probar la conexión
async function testPrismaConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma conectado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error conectando Prisma:', error.message);
    return false;
  }
}

module.exports = { 
  prisma, 
  disconnectPrisma, 
  testPrismaConnection 
};
