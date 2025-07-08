const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔗 Intentando conectar a la base de datos...');
        
        // Probar la conexión básica
        await prisma.$connect();
        console.log('✅ Conexión exitosa a la base de datos');
        
        // Intentar una consulta simple
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Consulta de prueba exitosa:', result);
        
        // Intentar contar usuarios
        try {
            const userCount = await prisma.user.count();
            console.log(`✅ Número de usuarios en la base de datos: ${userCount}`);
        } catch (error) {
            console.log('⚠️  Error al contar usuarios (puede ser normal si la tabla no existe):', error.message);
        }
        
        // Intentar listar tablas
        try {
            const tables = await prisma.$queryRaw`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_TYPE = 'BASE TABLE'
            `;
            console.log('✅ Tablas disponibles:', tables);
        } catch (error) {
            console.log('⚠️  Error al listar tablas:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('📋 Detalles del error:', error);
    } finally {
        await prisma.$disconnect();
        console.log('🔌 Conexión cerrada');
    }
}

testConnection();
