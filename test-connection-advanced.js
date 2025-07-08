// test-connection-advanced.js
const { PrismaClient } = require('@prisma/client');

async function testConnectionAdvanced() {
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
    
    try {
        console.log('🔗 Iniciando prueba avanzada de conexión...\n');
        
        // 1. Probar conexión básica
        console.log('1️⃣ Probando conexión básica...');
        await prisma.$connect();
        console.log('✅ Conexión exitosa\n');
        
        // 2. Información del servidor
        console.log('2️⃣ Obteniendo información del servidor...');
        const serverInfo = await prisma.$queryRaw`
            SELECT 
                @@VERSION as version,
                @@SERVERNAME as server_name,
                DB_NAME() as database_name,
                USER_NAME() as user_name,
                SYSTEM_USER as system_user,
                @@LANGUAGE as language,
                GETDATE() as current_time
        `;
        console.log('📊 Información del servidor:');
        console.table(serverInfo);
        
        // 3. Verificar configuración de autenticación
        console.log('3️⃣ Verificando configuración de autenticación...');
        const authInfo = await prisma.$queryRaw`
            SELECT 
                SERVERPROPERTY('IsIntegratedSecurityOnly') as IntegratedSecurityOnly,
                SERVERPROPERTY('IsClustered') as IsClustered,
                SERVERPROPERTY('Edition') as Edition,
                SERVERPROPERTY('ProductVersion') as ProductVersion
        `;
        console.log('🔐 Configuración de autenticación:');
        console.table(authInfo);
        
        // 4. Listar todas las bases de datos
        console.log('4️⃣ Listando bases de datos disponibles...');
        const databases = await prisma.$queryRaw`
            SELECT name as database_name, database_id, create_date 
            FROM sys.databases 
            WHERE database_id > 4  -- Excluir bases de datos del sistema
            ORDER BY name
        `;
        console.log('🗄️ Bases de datos disponibles:');
        console.table(databases);
        
        // 5. Listar tablas en la base de datos actual
        console.log('5️⃣ Listando tablas en la base de datos actual...');
        const tables = await prisma.$queryRaw`
            SELECT 
                TABLE_NAME,
                TABLE_TYPE,
                TABLE_SCHEMA
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        `;
        console.log('📋 Tablas disponibles:');
        if (tables.length > 0) {
            console.table(tables);
        } else {
            console.log('   ⚠️  No hay tablas creadas aún');
        }
        
        // 6. Verificar esquema de Prisma vs Base de datos
        console.log('6️⃣ Verificando modelos de Prisma...');
        try {
            // Intentar contar registros en cada modelo
            const modelCounts = {};
            
            try {
                modelCounts.users = await prisma.user.count();
                console.log(`👥 Usuarios: ${modelCounts.users}`);
            } catch (e) {
                console.log('⚠️  Modelo User: Tabla no existe o no migrada');
            }
            
            try {
                modelCounts.objetivos = await prisma.objetivo.count();
                console.log(`🎯 Objetivos: ${modelCounts.objetivos}`);
            } catch (e) {
                console.log('⚠️  Modelo Objetivo: Tabla no existe o no migrada');
            }
            
            try {
                modelCounts.indicadores = await prisma.indicador.count();
                console.log(`📈 Indicadores: ${modelCounts.indicadores}`);
            } catch (e) {
                console.log('⚠️  Modelo Indicador: Tabla no existe o no migrada');
            }
            
        } catch (error) {
            console.log('⚠️  Error verificando modelos:', error.message);
        }
        
        // 7. Prueba de rendimiento
        console.log('\n7️⃣ Probando rendimiento de la conexión...');
        const start = Date.now();
        for (let i = 0; i < 5; i++) {
            await prisma.$queryRaw`SELECT 1`;
        }
        const end = Date.now();
        console.log(`⚡ 5 consultas ejecutadas en ${end - start}ms`);
        
        // 8. Verificar espacio en disco de la base de datos
        console.log('\n8️⃣ Verificando espacio de la base de datos...');
        try {
            const diskSpace = await prisma.$queryRaw`
                SELECT 
                    DB_NAME() as database_name,
                    SUM(size * 8.0 / 1024) as size_mb,
                    SUM(CASE WHEN type = 0 THEN size * 8.0 / 1024 END) as data_size_mb,
                    SUM(CASE WHEN type = 1 THEN size * 8.0 / 1024 END) as log_size_mb
                FROM sys.master_files
                WHERE database_id = DB_ID()
                GROUP BY database_id
            `;
            console.log('💾 Información de espacio:');
            console.table(diskSpace);
        } catch (error) {
            console.log('⚠️  No se pudo obtener información de espacio:', error.message);
        }
        
        console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
        
    } catch (error) {
        console.error('\n❌ Error durante las pruebas:');
        console.error('📋 Mensaje:', error.message);
        console.error('🔍 Código:', error.code);
        console.error('📍 Stack:', error.stack);
        
        // Diagnóstico automático
        console.log('\n🔧 DIAGNÓSTICO AUTOMÁTICO:');
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('🔸 SQL Server probablemente no está corriendo');
            console.log('   • Verificar servicios: services.msc');
            console.log('   • Iniciar SQL Server: net start MSSQLSERVER');
            console.log('   • Verificar puerto en SQL Server Configuration Manager');
        }
        
        if (error.message.includes('Login failed')) {
            console.log('🔸 Problema de autenticación');
            console.log('   • Verificar credenciales en .env');
            console.log('   • Probar con: sqlcmd -S localhost -E');
            console.log('   • Verificar modo de autenticación SQL Server');
        }
        
        if (error.message.includes('Invalid connection string')) {
            console.log('🔸 Problema en cadena de conexión');
            console.log('   • Verificar formato en .env');
            console.log('   • Escapar caracteres especiales');
            console.log('   • Verificar nombre de instancia');
        }
        
        if (error.message.includes('network')) {
            console.log('🔸 Problema de red');
            console.log('   • Verificar firewall de Windows');
            console.log('   • Habilitar TCP/IP en SQL Server');
            console.log('   • Verificar Named Pipes');
        }
        
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Conexión cerrada');
    }
}

// Ejecutar pruebas
console.log('🚀 Iniciando pruebas avanzadas de conexión a SQL Server...\n');
testConnectionAdvanced();
