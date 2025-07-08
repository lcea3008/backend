# 🛠️ COMANDOS ÚTILES PARA ADMINISTRACIÓN DE BASE DE DATOS

## 📋 COMANDOS BÁSICOS DE PRISMA

### Generar el cliente Prisma
```bash
npx prisma generate
```

### Aplicar cambios del schema a la base de datos (sin migraciones)
```bash
npx prisma db push
```

### Crear y aplicar migraciones (recomendado para producción)
```bash
npx prisma migrate dev --name descripcion_del_cambio
```

### Ver estado de migraciones
```bash
npx prisma migrate status
```

### Aplicar migraciones pendientes
```bash
npx prisma migrate deploy
```

### Resetear la base de datos (¡CUIDADO! Elimina todos los datos)
```bash
npx prisma migrate reset
```

### Abrir Prisma Studio (interfaz visual)
```bash
npx prisma studio
```

### Ver la base de datos actual
```bash
npx prisma db pull
```

---

## 🧪 COMANDOS DE PRUEBA

### Probar conexión básica
```bash
node test-connection.js
```

### Probar conexión avanzada con diagnósticos
```bash
node test-connection-advanced.js
```

### Configurar conexión interactivamente
```bash
node setup-database-connection.js
```

### Crear datos de prueba
```bash
node seed-data.js
```

---

## 🔧 COMANDOS DE SQL SERVER

### Verificar si SQL Server está corriendo
```cmd
# En Command Prompt
net start | findstr SQL

# En PowerShell
Get-Service | Where-Object {$_.Name -like "*SQL*"}
```

### Iniciar/Parar SQL Server
```cmd
# Iniciar
net start MSSQLSERVER
net start "SQL Server (SQLEXPRESS)"

# Parar
net stop MSSQLSERVER
net stop "SQL Server (SQLEXPRESS)"
```

### Conectar con sqlcmd
```cmd
# Autenticación Windows
sqlcmd -S localhost -E

# Autenticación SQL
sqlcmd -S localhost -U sa -P tu_contraseña

# Con instancia nombrada
sqlcmd -S localhost\SQLEXPRESS -E
```

### Listar instancias de SQL Server
```cmd
sqlcmd -L
```

### Verificar puertos en uso
```cmd
netstat -an | findstr :1433
netstat -an | findstr :1434
```

---

## 📊 CONSULTAS SQL ÚTILES

### Información del servidor
```sql
SELECT @@VERSION, @@SERVERNAME, DB_NAME(), USER_NAME(), SYSTEM_USER;
```

### Listar bases de datos
```sql
SELECT name, database_id, create_date FROM sys.databases;
```

### Listar tablas en la base de datos actual
```sql
SELECT TABLE_NAME, TABLE_SCHEMA 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
```

### Información de espacio de la base de datos
```sql
SELECT 
    DB_NAME() as database_name,
    SUM(size * 8.0 / 1024) as size_mb
FROM sys.master_files
WHERE database_id = DB_ID();
```

### Verificar modo de autenticación
```sql
SELECT SERVERPROPERTY('IsIntegratedSecurityOnly') as AuthMode;
-- 0 = Mixed Mode, 1 = Windows Only
```

### Listar usuarios de la base de datos
```sql
SELECT name, type_desc, create_date 
FROM sys.database_principals 
WHERE type IN ('S', 'U');
```

---

## 🔄 FLUJO TÍPICO DE DESARROLLO

### Primer setup
```bash
# 1. Instalar dependencias
npm install prisma @prisma/client bcrypt jsonwebtoken

# 2. Inicializar Prisma
npx prisma init

# 3. Configurar conexión
node setup-database-connection.js

# 4. Generar cliente
npx prisma generate

# 5. Aplicar schema
npx prisma db push

# 6. Crear datos de prueba
node seed-data.js
```

### Cambios en el schema
```bash
# 1. Editar prisma/schema.prisma
# 2. Aplicar cambios
npx prisma db push
# O para producción:
npx prisma migrate dev --name descripcion_cambio

# 3. Regenerar cliente
npx prisma generate
```

### Debugging de conexión
```bash
# 1. Probar conexión
node test-connection-advanced.js

# 2. Verificar logs
npx prisma studio

# 3. Ver estado de migraciones
npx prisma migrate status
```

---

## 🚨 TROUBLESHOOTING RÁPIDO

### Error: "ECONNREFUSED"
```bash
# Verificar que SQL Server esté corriendo
net start | findstr SQL

# Iniciar SQL Server si está parado
net start MSSQLSERVER
```

### Error: "Login failed"
```bash
# Probar conexión manual
sqlcmd -S localhost -E

# Verificar credenciales en .env
cat .env | grep DATABASE_URL
```

### Error: "Table doesn't exist"
```bash
# Aplicar schema
npx prisma db push

# O crear migración
npx prisma migrate dev --name init
```

### Error: "Connection string invalid"
```bash
# Reconfigurar conexión
node setup-database-connection.js

# Verificar formato en .env
```

---

## 📁 ESTRUCTURA DE ARCHIVOS RECOMENDADA

```
tu-proyecto/
├── prisma/
│   ├── schema.prisma          # Schema de la base de datos
│   └── migrations/            # Migraciones (si usas migrate)
├── lib/
│   └── prisma.js             # Cliente Prisma singleton
├── src/
│   └── app/
│       └── api/              # Endpoints de tu API
├── .env                      # Variables de entorno
├── test-connection.js        # Script de prueba básico
├── test-connection-advanced.js # Script de prueba avanzado
├── seed-data.js             # Script para datos de prueba
├── setup-database-connection.js # Configurador automático
└── package.json
```

---

## 🔗 RECURSOS ÚTILES

- **Prisma Docs**: https://www.prisma.io/docs
- **SQL Server Connection Strings**: https://www.prisma.io/docs/reference/database-reference/connection-urls#sql-server
- **Prisma Studio**: https://www.prisma.io/studio
- **SQL Server Management Studio**: https://docs.microsoft.com/en-us/sql/ssms/
- **Azure Data Studio**: https://docs.microsoft.com/en-us/sql/azure-data-studio/
