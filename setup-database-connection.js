// setup-database-connection.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para hacer preguntas
function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

// Plantillas de cadenas de conexión
const connectionTemplates = {
    windowsAuth: {
        name: 'Autenticación de Windows',
        template: 'sqlserver://{server};database={database};integratedSecurity=true;encrypt=true;trustServerCertificate=true'
    },
    sqlAuth: {
        name: 'Autenticación SQL Server',
        template: 'sqlserver://{server};database={database};user={user};password={password};encrypt=true;trustServerCertificate=true'
    },
    namedInstance: {
        name: 'Instancia Nombrada con Windows Auth',
        template: 'sqlserver://{server}\\{instance};database={database};integratedSecurity=true;encrypt=true;trustServerCertificate=true'
    },
    namedInstanceSQL: {
        name: 'Instancia Nombrada con SQL Auth',
        template: 'sqlserver://{server}\\{instance};database={database};user={user};password={password};encrypt=true;trustServerCertificate=true'
    }
};

async function setupDatabaseConnection() {
    console.log('🚀 CONFIGURADOR DE CONEXIÓN A BASE DE DATOS SQL SERVER\n');
    
    try {
        // 1. Mostrar opciones
        console.log('Selecciona el tipo de autenticación:\n');
        Object.entries(connectionTemplates).forEach(([key, template], index) => {
            console.log(`${index + 1}. ${template.name}`);
        });
        
        const authChoice = await ask('\nIngresa el número de tu elección (1-4): ');
        const templateKeys = Object.keys(connectionTemplates);
        const selectedTemplate = connectionTemplates[templateKeys[parseInt(authChoice) - 1]];
        
        if (!selectedTemplate) {
            console.log('❌ Opción inválida');
            process.exit(1);
        }
        
        console.log(`\n✅ Seleccionaste: ${selectedTemplate.name}\n`);
        
        // 2. Recopilar información
        const config = {};
        
        // Servidor
        const defaultServer = 'localhost';
        config.server = await ask(`Servidor SQL Server (${defaultServer}): `) || defaultServer;
        
        // Puerto (si no es instancia nombrada)
        if (!selectedTemplate.template.includes('\\{instance}')) {
            const defaultPort = '1433';
            const port = await ask(`Puerto (${defaultPort}): `) || defaultPort;
            config.server = `${config.server}:${port}`;
        }
        
        // Instancia (si es necesaria)
        if (selectedTemplate.template.includes('{instance}')) {
            config.instance = await ask('Nombre de la instancia (ej: SQLEXPRESS, MSSQLSERVER11): ');
            if (!config.instance) {
                console.log('❌ El nombre de instancia es requerido');
                process.exit(1);
            }
        }
        
        // Base de datos
        const defaultDatabase = 'balancescore';
        config.database = await ask(`Nombre de la base de datos (${defaultDatabase}): `) || defaultDatabase;
        
        // Credenciales SQL (si es necesario)
        if (selectedTemplate.template.includes('{user}')) {
            config.user = await ask('Usuario SQL Server: ');
            config.password = await ask('Contraseña: ');
            
            if (!config.user || !config.password) {
                console.log('❌ Usuario y contraseña son requeridos para autenticación SQL');
                process.exit(1);
            }
        }
        
        // JWT Secret
        const defaultJWTSecret = 'supersecreto_' + Math.random().toString(36).substring(7);
        config.jwtSecret = await ask(`JWT Secret (${defaultJWTSecret}): `) || defaultJWTSecret;
        
        // 3. Generar cadena de conexión
        let connectionString = selectedTemplate.template;
        Object.entries(config).forEach(([key, value]) => {
            connectionString = connectionString.replace(`{${key}}`, value);
        });
        
        // 4. Crear archivo .env
        const envContent = `# Configuración de base de datos generada automáticamente
# Tipo: ${selectedTemplate.name}
# Generado: ${new Date().toISOString()}

DATABASE_URL="${connectionString}"
JWT_SECRET="${config.jwtSecret}"
PORT=3000

# Configuración adicional
NODE_ENV=development
`;
        
        // 5. Guardar archivo
        const envPath = path.join(process.cwd(), '.env');
        const backupPath = path.join(process.cwd(), '.env.backup');
        
        // Crear backup si existe .env
        if (fs.existsSync(envPath)) {
            fs.copyFileSync(envPath, backupPath);
            console.log(`\n📁 Backup creado: .env.backup`);
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log(`\n✅ Archivo .env creado/actualizado`);
        
        // 6. Mostrar resumen
        console.log('\n📋 RESUMEN DE CONFIGURACIÓN:');
        console.log('================================');
        console.log(`Tipo de auth: ${selectedTemplate.name}`);
        console.log(`Servidor: ${config.server}`);
        if (config.instance) console.log(`Instancia: ${config.instance}`);
        console.log(`Base de datos: ${config.database}`);
        if (config.user) console.log(`Usuario: ${config.user}`);
        console.log(`JWT Secret: ${config.jwtSecret.substring(0, 10)}...`);
        
        console.log('\n🔗 Cadena de conexión generada:');
        console.log(connectionString);
        
        // 7. Probar conexión
        const testConnection = await ask('\n¿Quieres probar la conexión ahora? (s/n): ');
        if (testConnection.toLowerCase() === 's' || testConnection.toLowerCase() === 'si') {
            console.log('\n🧪 Probando conexión...');
            
            // Generar y ejecutar Prisma
            const { exec } = require('child_process');
            
            exec('npx prisma generate', (error, stdout, stderr) => {
                if (error) {
                    console.log('⚠️  Error generando cliente Prisma:', error.message);
                } else {
                    console.log('✅ Cliente Prisma generado');
                    
                    // Ejecutar test de conexión
                    exec('node test-connection.js', (error, stdout, stderr) => {
                        if (error) {
                            console.log('❌ Error en test de conexión:', error.message);
                        } else {
                            console.log('\n📊 Resultado del test:');
                            console.log(stdout);
                        }
                        
                        console.log('\n🎉 ¡Configuración completada!');
                        console.log('\n📝 Próximos pasos:');
                        console.log('   1. npx prisma db push    # Aplicar schema a la BD');
                        console.log('   2. node seed-data.js     # Crear datos de prueba');
                        console.log('   3. npm run dev           # Iniciar el servidor');
                        
                        process.exit(0);
                    });
                }
            });
        } else {
            console.log('\n🎉 ¡Configuración guardada!');
            console.log('\n📝 Para probar la conexión:');
            console.log('   1. npx prisma generate');
            console.log('   2. node test-connection.js');
            process.exit(0);
        }
        
    } catch (error) {
        console.error('\n❌ Error durante la configuración:', error.message);
        process.exit(1);
    }
}

// Función para limpiar al salir
process.on('SIGINT', () => {
    console.log('\n\n👋 Configuración cancelada');
    rl.close();
    process.exit(0);
});

// Ejecutar configurador
setupDatabaseConnection();
