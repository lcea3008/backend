const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function seedBSCData() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🌱 Creando datos de prueba para BSC...');
        
        // Limpiar datos existentes (en orden correcto por las dependencias)
        console.log('🧹 Limpiando datos existentes...');
        await prisma.registroHistorico.deleteMany();
        await prisma.iniciativa.deleteMany();
        await prisma.kPI.deleteMany();
        await prisma.objetivo.deleteMany();
        await prisma.perspectiva.deleteMany();
        await prisma.user.deleteMany();
        
        console.log('✅ Datos anteriores eliminados');
        
        // 1. Crear usuarios
        console.log('👥 Creando usuarios...');
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const admin = await prisma.user.create({
            data: {
                nombre: 'Administrador del Sistema',
                email: 'admin@bsc.com',
                password: hashedPassword,
                role: 'Admin'
            }
        });
        
        const gerente = await prisma.user.create({
            data: {
                nombre: 'Gerente General',
                email: 'gerente@bsc.com',
                password: hashedPassword,
                role: 'Gerente'
            }
        });
        
        const analista = await prisma.user.create({
            data: {
                nombre: 'Analista de Datos',
                email: 'analista@bsc.com',
                password: hashedPassword,
                role: 'Analista'
            }
        });
        
        console.log(`✅ ${await prisma.user.count()} usuarios creados`);
        
        // 2. Crear las 4 perspectivas del BSC
        console.log('🎯 Creando perspectivas del BSC...');
        
        const perspFinanciera = await prisma.perspectiva.create({
            data: {
                nombre: 'Financiera',
                descripcion: 'Perspectiva financiera que mide el desempeño económico y la rentabilidad'
            }
        });
        
        const perspClientes = await prisma.perspectiva.create({
            data: {
                nombre: 'Clientes',
                descripcion: 'Perspectiva del cliente que evalúa la satisfacción y retención'
            }
        });
        
        const perspProcesos = await prisma.perspectiva.create({
            data: {
                nombre: 'Procesos Internos',
                descripcion: 'Perspectiva de procesos internos que optimiza las operaciones'
            }
        });
        
        const perspAprendizaje = await prisma.perspectiva.create({
            data: {
                nombre: 'Aprendizaje y Crecimiento',
                descripcion: 'Perspectiva de aprendizaje que desarrolla capacidades organizacionales'
            }
        });
        
        console.log(`✅ ${await prisma.perspectiva.count()} perspectivas creadas`);
        
        // 3. Crear objetivos estratégicos
        console.log('📋 Creando objetivos estratégicos...');
        
        const objIngresos = await prisma.objetivo.create({
            data: {
                titulo: 'Incrementar los ingresos en un 25% anual',
                perspectiva_id: perspFinanciera.id
            }
        });
        
        const objRentabilidad = await prisma.objetivo.create({
            data: {
                titulo: 'Mejorar la rentabilidad operativa al 15%',
                perspectiva_id: perspFinanciera.id
            }
        });
        
        const objSatisfaccion = await prisma.objetivo.create({
            data: {
                titulo: 'Alcanzar 95% de satisfacción del cliente',
                perspectiva_id: perspClientes.id
            }
        });
        
        const objRetencion = await prisma.objetivo.create({
            data: {
                titulo: 'Mantener 90% de retención de clientes',
                perspectiva_id: perspClientes.id
            }
        });
        
        const objCalidad = await prisma.objetivo.create({
            data: {
                titulo: 'Reducir defectos de calidad en 50%',
                perspectiva_id: perspProcesos.id
            }
        });
        
        const objCapacitacion = await prisma.objetivo.create({
            data: {
                titulo: 'Capacitar al 100% del personal anualmente',
                perspectiva_id: perspAprendizaje.id
            }
        });
        
        console.log(`✅ ${await prisma.objetivo.count()} objetivos creados`);
        
        // 4. Crear KPIs
        console.log('📈 Creando KPIs...');
        
        const kpiIngresos = await prisma.kPI.create({
            data: {
                nombre: 'Ingresos Mensuales',
                meta: 500000.00,
                unidad: 'S/',
                objetivo_id: objIngresos.id,
                estado_actual: 420000.00
            }
        });
        
        const kpiMargen = await prisma.kPI.create({
            data: {
                nombre: 'Margen Operativo',
                meta: 15.00,
                unidad: '%',
                objetivo_id: objRentabilidad.id,
                estado_actual: 12.50
            }
        });
        
        const kpiSatisfaccion = await prisma.kPI.create({
            data: {
                nombre: 'Índice de Satisfacción del Cliente',
                meta: 4.80,
                unidad: 'puntos',
                objetivo_id: objSatisfaccion.id,
                estado_actual: 4.50
            }
        });
        
        const kpiRetencion = await prisma.kPI.create({
            data: {
                nombre: 'Tasa de Retención de Clientes',
                meta: 90.00,
                unidad: '%',
                objetivo_id: objRetencion.id,
                estado_actual: 87.00
            }
        });
        
        const kpiDefectos = await prisma.kPI.create({
            data: {
                nombre: 'Tasa de Defectos',
                meta: 2.00,
                unidad: '%',
                objetivo_id: objCalidad.id,
                estado_actual: 4.20
            }
        });
        
        const kpiCapacitacion = await prisma.kPI.create({
            data: {
                nombre: 'Horas de Capacitación por Empleado',
                meta: 40.00,
                unidad: 'veces',
                objetivo_id: objCapacitacion.id,
                estado_actual: 32.00
            }
        });
        
        console.log(`✅ ${await prisma.kPI.count()} KPIs creados`);
        
        // 5. Crear iniciativas estratégicas
        console.log('🚀 Creando iniciativas estratégicas...');
        
        const init1 = await prisma.iniciativa.create({
            data: {
                nombre: 'Campaña de Marketing Digital 2024',
                descripcion: 'Implementar estrategia de marketing digital para incrementar ventas online y offline',
                kpi_id: kpiIngresos.id,
                fecha_inicio: new Date('2024-01-01'),
                fecha_fin: new Date('2024-12-31'),
                responsable_id: gerente.id,
                progreso: 65
            }
        });
        
        const init2 = await prisma.iniciativa.create({
            data: {
                nombre: 'Optimización de Procesos Operativos',
                descripcion: 'Rediseño de procesos para mejorar eficiencia y reducir costos operativos',
                kpi_id: kpiMargen.id,
                fecha_inicio: new Date('2024-02-01'),
                fecha_fin: new Date('2024-08-31'),
                responsable_id: analista.id,
                progreso: 40
            }
        });
        
        const init3 = await prisma.iniciativa.create({
            data: {
                nombre: 'Programa de Experiencia del Cliente',
                descripcion: 'Mejora integral de la experiencia del cliente en todos los puntos de contacto',
                kpi_id: kpiSatisfaccion.id,
                fecha_inicio: new Date('2024-03-01'),
                fecha_fin: new Date('2024-11-30'),
                responsable_id: gerente.id,
                progreso: 25
            }
        });
        
        console.log(`✅ ${await prisma.iniciativa.count()} iniciativas creadas`);
        
        // 6. Crear registros históricos
        console.log('📊 Creando registros históricos...');
        
        // Ingresos históricos (últimos 6 meses)
        const fechasIngresos = [
            { fecha: new Date('2023-07-31'), valor: 380000.00 },
            { fecha: new Date('2023-08-31'), valor: 395000.00 },
            { fecha: new Date('2023-09-30'), valor: 410000.00 },
            { fecha: new Date('2023-10-31'), valor: 405000.00 },
            { fecha: new Date('2023-11-30'), valor: 415000.00 },
            { fecha: new Date('2023-12-31'), valor: 420000.00 }
        ];
        
        for (const registro of fechasIngresos) {
            await prisma.registroHistorico.create({
                data: {
                    kpi_id: kpiIngresos.id,
                    valor: registro.valor,
                    fecha: registro.fecha
                }
            });
        }
        
        // Satisfacción histórica
        const fechasSatisfaccion = [
            { fecha: new Date('2023-09-30'), valor: 4.20 },
            { fecha: new Date('2023-10-31'), valor: 4.30 },
            { fecha: new Date('2023-11-30'), valor: 4.40 },
            { fecha: new Date('2023-12-31'), valor: 4.50 }
        ];
        
        for (const registro of fechasSatisfaccion) {
            await prisma.registroHistorico.create({
                data: {
                    kpi_id: kpiSatisfaccion.id,
                    valor: registro.valor,
                    fecha: registro.fecha
                }
            });
        }
        
        console.log(`✅ ${await prisma.registroHistorico.count()} registros históricos creados`);
        
        // 7. Resumen final
        console.log('\n📊 RESUMEN FINAL DE DATOS BSC:');
        console.log('='.repeat(45));
        
        const stats = {
            usuarios: await prisma.user.count(),
            perspectivas: await prisma.perspectiva.count(),
            objetivos: await prisma.objetivo.count(),
            kpis: await prisma.kPI.count(),
            iniciativas: await prisma.iniciativa.count(),
            historicos: await prisma.registroHistorico.count()
        };
        
        console.log(`👥 Usuarios: ${stats.usuarios}`);
        console.log(`🎯 Perspectivas: ${stats.perspectivas}`);
        console.log(`📋 Objetivos: ${stats.objetivos}`);
        console.log(`📈 KPIs: ${stats.kpis}`);
        console.log(`🚀 Iniciativas: ${stats.iniciativas}`);
        console.log(`📊 Registros Históricos: ${stats.historicos}`);
        
        console.log('\n🔑 CREDENCIALES DE ACCESO:');
        console.log('='.repeat(30));
        console.log('📧 admin@bsc.com / 🔐 123456 (Administrador)');
        console.log('📧 gerente@bsc.com / 🔐 123456 (Gerente)');
        console.log('📧 analista@bsc.com / 🔐 123456 (Analista)');
        
        console.log('\n🎉 ¡Datos del BSC creados exitosamente!');
        
    } catch (error) {
        console.error('\n❌ ERROR CREANDO DATOS BSC:');
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Conexión cerrada');
    }
}

// Ejecutar el seed
seedBSCData();
