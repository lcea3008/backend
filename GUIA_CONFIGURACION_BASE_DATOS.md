# 🗄️ GUÍA COMPLETA: CONFIGURACIÓN DE BASE DE DATOS CON PRISMA Y SQL SERVER

## 📋 TABLA DE CONTENIDOS
1. [Instalación de Dependencias](#1-instalación-de-dependencias)
2. [Configuración de Prisma](#2-configuración-de-prisma)
3. [Configuración de Variables de Entorno](#3-configuración-de-variables-de-entorno)
4. [Configuración del Schema](#4-configuración-del-schema)
5. [Archivos de Prueba de Conexión](#5-archivos-de-prueba-de-conexión)
6. [Tipos de Autenticación](#6-tipos-de-autenticación)
7. [Comandos Útiles](#7-comandos-útiles)
8. [Troubleshooting](#8-troubleshooting)

---

## 🚀 1. INSTALACIÓN DE DEPENDENCIAS

### **Paso 1.1: Instalar Prisma**
```bash
# Instalar Prisma CLI globalmente (opcional)
npm install -g prisma

# Instalar Prisma en tu proyecto
npm install prisma @prisma/client

# Instalar dependencias adicionales para autenticación
npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken
```

### **Paso 1.2: Inicializar Prisma**
```bash
# Inicializar Prisma en tu proyecto
npx prisma init
```

**Esto crea:**
- `prisma/schema.prisma` - Archivo de configuración del schema
- `.env` - Archivo de variables de entorno

---

## ⚙️ 2. CONFIGURACIÓN DE PRISMA

### **Paso 2.1: Configurar el archivo `prisma/schema.prisma`**

```prisma
// Este es tu archivo de schema de Prisma
// Más información en: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}

// Modelos de ejemplo
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique @db.NVarChar(100)
  password String   @db.NVarChar(200)
  role     String   @db.NVarChar(20)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("Users")
}

model Objetivo {
  id          Int         @id @default(autoincrement())
  title       String      @db.NVarChar(100)
  perspectiva String      @db.NVarChar(50)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  indicadores Indicador[]

  @@map("Objetivos")
}

model Indicador {
  id         Int      @id @default(autoincrement())
  nombre     String   @db.NVarChar(100)
  meta       Float
  unidad     String   @db.NVarChar(20)
  objetivoId Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  objetivo   Objetivo @relation(fields: [objetivoId], references: [id])

  @@map("Indicadores")
}
```

---

## 🔐 3. CONFIGURACIÓN DE VARIABLES DE ENTORNO

### **Paso 3.1: Crear archivo `.env`**

```env
# Variables de entorno para Prisma
# Documentación: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Configuración de la base de datos SQL Server
DATABASE_URL="[VER_OPCIONES_ABAJO]"

# Secreto para JWT (generar uno seguro en producción)
JWT_SECRET="tu_secreto_jwt_super_seguro_aqui"

# Puerto del servidor (opcional)
PORT=3000
```

---

## 🔑 6. TIPOS DE AUTENTICACIÓN

### **6.1 Autenticación por Usuario SQL Server**

```env
# Opción 1: Usuario específico con contraseña
DATABASE_URL="sqlserver://localhost:1433;database=tu_base_datos;user=tu_usuario;password=tu_contraseña;encrypt=true;trustServerCertificate=true"

# Opción 2: Usuario 'sa' (administrador)
DATABASE_URL="sqlserver://localhost:1433;database=tu_base_datos;user=sa;password=tu_contraseña_sa;encrypt=true;trustServerCertificate=true"

# Opción 3: Con instancia nombrada
DATABASE_URL="sqlserver://localhost\\NOMBRE_INSTANCIA;database=tu_base_datos;user=tu_usuario;password=tu_contraseña;encrypt=true;trustServerCertificate=true"
```

### **6.2 Autenticación por Windows (Integrated Security)**

```env
# Opción 1: Instancia por defecto
DATABASE_URL="sqlserver://localhost:1433;database=tu_base_datos;integratedSecurity=true;encrypt=true;trustServerCertificate=true"

# Opción 2: Con instancia nombrada
DATABASE_URL="sqlserver://NOMBRE_PC\\NOMBRE_INSTANCIA;database=tu_base_datos;integratedSecurity=true;encrypt=true;trustServerCertificate=true"

# Opción 3: Con puerto específico
DATABASE_URL="sqlserver://localhost:1434;database=tu_base_datos;integratedSecurity=true;encrypt=true;trustServerCertificate=true"
```

### **6.3 Cómo Encontrar tu Configuración**

#### **Encontrar el nombre de tu instancia:**
```cmd
# En CMD o PowerShell
sqlcmd -L

# O revisar servicios de Windows
services.msc
# Buscar servicios que empiecen con "SQL Server"
```

#### **Encontrar el puerto:**
```cmd
# Verificar puertos en uso
netstat -an | findstr :1433
netstat -an | findstr :1434
```

#### **Verificar conectividad:**
```cmd
# Probar conexión con sqlcmd
sqlcmd -S localhost -E  # Autenticación Windows
sqlcmd -S localhost -U sa -P tu_contraseña  # Usuario SQL
```

---

## 🧪 5. ARCHIVOS DE PRUEBA DE CONEXIÓN

### **Paso 5.1: Crear archivo de cliente Prisma `lib/prisma.js`**

```javascript
// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

// Crear instancia única de Prisma (patrón singleton)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query'], // Opcional: log de consultas SQL
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
```

### **Paso 5.2: Script de prueba básica `test-connection.js`**

```javascript
// test-connection.js
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔗 Probando conexión a la base de datos...');
        
        // 1. Probar conexión básica
        await prisma.$connect();
        console.log('✅ Conexión exitosa');
        
        // 2. Ejecutar consulta simple
        const result = await prisma.$queryRaw`SELECT 1 as test, GETDATE() as fecha`;
        console.log('✅ Consulta de prueba exitosa:', result);
        
        // 3. Obtener información del servidor
        const serverInfo = await prisma.$queryRaw`
            SELECT 
                @@VERSION as version,
                @@SERVERNAME as server_name,
                DB_NAME() as database_name
        `;
        console.log('📊 Información del servidor:', serverInfo);
        
        // 4. Listar tablas existentes
        const tables = await prisma.$queryRaw`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        `;
        console.log('📋 Tablas en la base de datos:', tables.map(t => t.TABLE_NAME));
        
        // 5. Probar modelos (si existen)
        try {
            const userCount = await prisma.user.count();
            console.log(`👥 Usuarios en la base de datos: ${userCount}`);
        } catch (error) {
            console.log('⚠️  Tabla Users no existe o no está migrada');
        }
        
    } catch (error) {
        console.error('❌ Error de conexión:');
        console.error('📋 Mensaje:', error.message);
        console.error('🔍 Código de error:', error.code);
        
        // Sugerencias basadas en el error
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Sugerencias:');
            console.log('   - Verificar que SQL Server esté corriendo');
            console.log('   - Verificar el puerto en la cadena de conexión');
            console.log('   - Verificar que TCP/IP esté habilitado en SQL Server');
        }
        
        if (error.message.includes('Login failed')) {
            console.log('\n💡 Sugerencias:');
            console.log('   - Verificar usuario y contraseña');
            console.log('   - Verificar que el usuario tenga permisos');
            console.log('   - Probar con autenticación Windows');
        }
        
    } finally {
        await prisma.$disconnect();
        console.log('🔌 Conexión cerrada');
    }
}

// Ejecutar la prueba
testConnection();
```

### **Paso 5.3: Script para crear datos de prueba `seed-data.js`**

```javascript
// seed-data.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function seedData() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🌱 Creando datos de prueba...');
        
        // Limpiar datos existentes (cuidado en producción)
        await prisma.indicador.deleteMany();
        await prisma.objetivo.deleteMany();
        await prisma.user.deleteMany();
        
        // Crear usuarios de prueba
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const users = await Promise.all([
            prisma.user.create({
                data: {
                    email: 'admin@test.com',
                    password: hashedPassword,
                    role: 'admin'
                }
            }),
            prisma.user.create({
                data: {
                    email: 'user@test.com',
                    password: hashedPassword,
                    role: 'user'
                }
            })
        ]);
        
        console.log('✅ Usuarios creados:', users.map(u => u.email));
        
        // Crear objetivos de prueba
        const objetivos = await Promise.all([
            prisma.objetivo.create({
                data: {
                    title: 'Aumentar Ventas',
                    perspectiva: 'Financiera'
                }
            }),
            prisma.objetivo.create({
                data: {
                    title: 'Mejorar Satisfacción',
                    perspectiva: 'Clientes'
                }
            })
        ]);
        
        console.log('✅ Objetivos creados:', objetivos.map(o => o.title));
        
        // Crear indicadores de prueba
        const indicadores = await Promise.all([
            prisma.indicador.create({
                data: {
                    nombre: 'Ventas Mensuales',
                    meta: 60000,
                    unidad: 'pesos',
                    objetivoId: objetivos[0].id
                }
            }),
            prisma.indicador.create({
                data: {
                    nombre: 'Satisfacción Cliente',
                    meta: 4.5,
                    unidad: 'puntos',
                    objetivoId: objetivos[1].id
                }
            })
        ]);
        
        console.log('✅ Indicadores creados:', indicadores.map(i => i.nombre));
        
        // Resumen
        const counts = {
            users: await prisma.user.count(),
            objetivos: await prisma.objetivo.count(),
            indicadores: await prisma.indicador.count()
        };
        
        console.log('📊 Datos creados:', counts);
        console.log('\n🔑 Credenciales de prueba:');
        console.log('   admin@test.com / 123456');
        console.log('   user@test.com / 123456');
        
    } catch (error) {
        console.error('❌ Error creando datos:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

seedData();
```

---

## 📝 7. COMANDOS ÚTILES

### **Comandos básicos de Prisma:**

```bash
# Generar el cliente Prisma (después de cambios en schema)
npx prisma generate

# Aplicar cambios al schema a la base de datos
npx prisma db push

# Crear y aplicar migraciones (recomendado para producción)
npx prisma migrate dev --name init

# Ver el estado de las migraciones
npx prisma migrate status

# Resetear la base de datos (¡CUIDADO! Elimina todos los datos)
npx prisma migrate reset

# Explorar la base de datos con Prisma Studio
npx prisma studio

# Generar datos semilla
npx prisma db seed
```

### **Comandos de prueba:**

```bash
# Probar conexión
node test-connection.js

# Crear datos de prueba
node seed-data.js

# Ejecutar tu aplicación
npm run dev
```

---

## 🚨 8. TROUBLESHOOTING

### **Errores Comunes y Soluciones:**

#### **Error: "ECONNREFUSED"**
```
❌ Problema: No se puede conectar al servidor SQL Server
✅ Soluciones:
   1. Verificar que SQL Server esté corriendo
   2. Verificar el puerto (1433 por defecto)
   3. Habilitar TCP/IP en SQL Server Configuration Manager
   4. Verificar firewall de Windows
```

#### **Error: "Login failed"**
```
❌ Problema: Credenciales incorrectas
✅ Soluciones:
   1. Verificar usuario y contraseña
   2. Verificar que el usuario tenga permisos en la base de datos
   3. Probar con autenticación Windows
   4. Verificar que el modo de autenticación esté correcto
```

#### **Error: "Invalid connection string"**
```
❌ Problema: Formato de cadena de conexión incorrecto
✅ Soluciones:
   1. Verificar sintaxis de la URL
   2. Escapar caracteres especiales en contraseñas
   3. Verificar nombre de instancia
   4. Probar diferentes formatos de conexión
```

#### **Error: "Table doesn't exist"**
```
❌ Problema: Tablas no existen en la base de datos
✅ Soluciones:
   1. Ejecutar: npx prisma db push
   2. O ejecutar: npx prisma migrate dev
   3. Verificar que el schema esté correcto
```

### **Verificaciones de SQL Server:**

```sql
-- Verificar instancias de SQL Server
SELECT @@SERVERNAME, @@VERSION

-- Verificar bases de datos
SELECT name FROM sys.databases

-- Verificar usuarios
SELECT name FROM sys.server_principals WHERE type = 'S'

-- Verificar configuración de autenticación
SELECT SERVERPROPERTY('IsIntegratedSecurityOnly') as AuthenticationMode
```

---

## 🎯 RESUMEN DEL FLUJO COMPLETO

### **Orden de ejecución recomendado:**

1. **Instalar dependencias**
   ```bash
   npm install prisma @prisma/client bcrypt jsonwebtoken
   npm install -D @types/bcrypt @types/jsonwebtoken
   ```

2. **Inicializar Prisma**
   ```bash
   npx prisma init
   ```

3. **Configurar `.env`** con tu cadena de conexión

4. **Configurar `schema.prisma`** con tus modelos

5. **Probar conexión**
   ```bash
   node test-connection.js
   ```

6. **Aplicar schema a la base de datos**
   ```bash
   npx prisma db push
   ```

7. **Generar cliente Prisma**
   ```bash
   npx prisma generate
   ```

8. **Crear datos de prueba**
   ```bash
   node seed-data.js
   ```

9. **Iniciar tu aplicación**
   ```bash
   npm run dev
   ```

---

## 🔗 RECURSOS ADICIONALES

- [Documentación oficial de Prisma](https://www.prisma.io/docs)
- [Cadenas de conexión para SQL Server](https://www.prisma.io/docs/reference/database-reference/connection-urls#sql-server)
- [Tipos de datos en Prisma](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-field-scalar-types)
- [Migraciones en Prisma](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**¡Esta guía te debe permitir configurar completamente tu conexión a base de datos desde cero!** 🎉
