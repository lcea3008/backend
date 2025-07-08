const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function seedData() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🌱 Creando datos de prueba...');
        
        // Limpiar datos existentes
        await prisma.indicador.deleteMany();
        await prisma.objetivo.deleteMany();
        await prisma.user.deleteMany();
        
        // Crear usuarios de prueba
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const user1 = await prisma.user.create({
            data: {
                email: 'admin@test.com',
                password: hashedPassword,
                role: 'admin'
            }
        });
        
        const user2 = await prisma.user.create({
            data: {
                email: 'user@test.com',
                password: hashedPassword,
                role: 'user'
            }
        });
        
        console.log('✅ Usuarios creados:', { user1: user1.email, user2: user2.email });
        
        // Crear objetivos de prueba
        const objetivo1 = await prisma.objetivo.create({
            data: {
                title: 'Aumentar Ventas',
                perspectiva: 'Financiera'
            }
        });
        
        const objetivo2 = await prisma.objetivo.create({
            data: {
                title: 'Mejorar Satisfacción',
                perspectiva: 'Clientes'
            }
        });
        
        console.log('✅ Objetivos creados:', { objetivo1: objetivo1.title, objetivo2: objetivo2.title });
        
        // Crear indicadores de prueba
        const indicador1 = await prisma.indicador.create({
            data: {
                nombre: 'Ventas Mensuales',
                meta: 60000,
                unidad: 'pesos',
                objetivoId: objetivo1.id
            }
        });
        
        const indicador2 = await prisma.indicador.create({
            data: {
                nombre: 'Satisfacción Cliente',
                meta: 4.5,
                unidad: 'puntos',
                objetivoId: objetivo2.id
            }
        });
        
        console.log('✅ Indicadores creados:', { indicador1: indicador1.nombre, indicador2: indicador2.nombre });
        
        // Verificar datos creados
        const userCount = await prisma.user.count();
        const objetivoCount = await prisma.objetivo.count();
        const indicadorCount = await prisma.indicador.count();
        
        console.log('📊 Resumen de datos creados:');
        console.log(`   👥 Usuarios: ${userCount}`);
        console.log(`   🎯 Objetivos: ${objetivoCount}`);
        console.log(`   📈 Indicadores: ${indicadorCount}`);
        
        console.log('\n🔑 Credenciales de prueba:');
        console.log('   Admin: admin@test.com / 123456');
        console.log('   Usuario: user@test.com / 123456');
        
    } catch (error) {
        console.error('❌ Error creando datos de prueba:', error);
    } finally {
        await prisma.$disconnect();
        console.log('🔌 Conexión cerrada');
    }
}

seedData();
