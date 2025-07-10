# 📊 SCHEMA PRISMA PARA BALANCED SCORECARD (BSC)

## 🎯 ESTRUCTURA DE LA BASE DE DATOS

### **RESUMEN:**
Este schema implementa un sistema completo de Balanced Scorecard con 6 tablas principales y sus relaciones.

---

## 📋 MODELOS Y RELACIONES

### **1. 👥 USER (Usuarios del Sistema)**
```prisma
model User {
  id       Int         @id @default(autoincrement())
  nombre   String      @db.NVarChar(100)
  email    String      @unique @db.NVarChar(100)
  password String      @db.NVarChar(200)
  role     String      @db.NVarChar(20)
  
  iniciativasResponsable Iniciativa[] @relation("Responsable")
  @@map("Users")
}
```
**Campos:**
- `id`: Identificador único (INT IDENTITY)
- `nombre`: Nombre completo del usuario (máx. 100 caracteres)
- `email`: Email único para login
- `password`: Contraseña hasheada
- `role`: Rol del usuario (Admin, Gerente, Analista)

**Relaciones:**
- Un usuario puede ser responsable de múltiples iniciativas

---

### **2. 🎯 PERSPECTIVA (Perspectivas del BSC)**
```prisma
model Perspectiva {
  id          Int         @id @default(autoincrement())
  nombre      String      @unique @db.NVarChar(100)
  descripcion String      @db.NVarChar(250)
  
  objetivos   Objetivo[]
  @@map("Perspectivas")
}
```
**Campos:**
- `id`: Identificador único
- `nombre`: Nombre de la perspectiva (único)
- `descripcion`: Descripción detallada (máx. 250 caracteres)

**Perspectivas típicas del BSC:**
1. Financiera
2. Clientes
3. Procesos Internos
4. Aprendizaje y Crecimiento

**Relaciones:**
- Una perspectiva puede tener múltiples objetivos

---

### **3. 📋 OBJETIVO (Objetivos Estratégicos)**
```prisma
model Objetivo {
  id             Int        @id @default(autoincrement())
  titulo         String     @db.NVarChar(150)
  perspectiva_id Int
  
  perspectiva    Perspectiva @relation(fields: [perspectiva_id], references: [id])
  kpis           KPI[]
  @@map("Objetivos")
}
```
**Campos:**
- `id`: Identificador único
- `titulo`: Título del objetivo estratégico
- `perspectiva_id`: Referencia a la perspectiva padre

**Relaciones:**
- Un objetivo pertenece a una perspectiva
- Un objetivo puede tener múltiples KPIs

---

### **4. 📈 KPI (Indicadores Clave de Desempeño)**
```prisma
model KPI {
  id                 Int              @id @default(autoincrement())
  nombre             String           @db.NVarChar(200)
  meta               Decimal          @db.Decimal(10, 2)
  unidad             String?          @db.NVarChar(20)
  objetivo_id        Int
  estado_actual      Decimal?         @db.Decimal(10, 2)
  fecha_actualizacion DateTime?       @default(dbgenerated("getdate()")) @db.Date
  
  objetivo           Objetivo         @relation(fields: [objetivo_id], references: [id])
  iniciativas        Iniciativa[]
  historicos         RegistroHistorico[]
  @@map("KPIs")
}
```
**Campos:**
- `id`: Identificador único
- `nombre`: Nombre descriptivo del KPI
- `meta`: Valor objetivo a alcanzar
- `unidad`: Unidad de medida (%, S/, veces, puntos)
- `objetivo_id`: Referencia al objetivo padre
- `estado_actual`: Valor actual del KPI
- `fecha_actualizacion`: Última actualización (automática)

**Relaciones:**
- Un KPI pertenece a un objetivo
- Un KPI puede tener múltiples iniciativas
- Un KPI puede tener múltiples registros históricos

---

### **5. 🚀 INICIATIVA (Iniciativas Estratégicas)**
```prisma
model Iniciativa {
  id             Int       @id @default(autoincrement())
  nombre         String    @db.NVarChar(200)
  descripcion    String?   @db.NVarChar(Max)
  kpi_id         Int
  fecha_inicio   DateTime? @db.Date
  fecha_fin      DateTime? @db.Date
  responsable_id Int?
  progreso       Int?
  
  kpi            KPI       @relation(fields: [kpi_id], references: [id])
  responsable    User?     @relation("Responsable", fields: [responsable_id], references: [id])
  @@map("Iniciativas")
}
```
**Campos:**
- `id`: Identificador único
- `nombre`: Nombre de la iniciativa
- `descripcion`: Descripción detallada (sin límite)
- `kpi_id`: Referencia al KPI que impacta
- `fecha_inicio`: Fecha de inicio
- `fecha_fin`: Fecha de finalización
- `responsable_id`: Usuario responsable (opcional)
- `progreso`: Porcentaje de progreso (0-100)

**Relaciones:**
- Una iniciativa pertenece a un KPI
- Una iniciativa puede tener un responsable (usuario)

---

### **6. 📊 REGISTRO HISTÓRICO (Auditoría de KPIs)**
```prisma
model RegistroHistorico {
  id     Int      @id @default(autoincrement())
  kpi_id Int
  valor  Decimal  @db.Decimal(10, 2)
  fecha  DateTime @default(dbgenerated("getdate()")) @db.Date
  
  kpi    KPI      @relation(fields: [kpi_id], references: [id])
  @@map("RegistrosHistoricos")
}
```
**Campos:**
- `id`: Identificador único
- `kpi_id`: Referencia al KPI
- `valor`: Valor registrado
- `fecha`: Fecha del registro (automática)

**Relaciones:**
- Un registro histórico pertenece a un KPI

---

## 🔗 DIAGRAMA DE RELACIONES

```
Users (1) ←→ (N) Iniciativas
                    ↓ (N)
                   KPIs ←→ (N) RegistrosHistoricos
                    ↓ (N)
                Objetivos
                    ↓ (N)
               Perspectivas
```

### **Relaciones Detalladas:**
1. **User → Iniciativas**: Un usuario puede ser responsable de múltiples iniciativas
2. **Perspectiva → Objetivos**: Una perspectiva contiene múltiples objetivos
3. **Objetivo → KPIs**: Un objetivo se mide con múltiples KPIs
4. **KPI → Iniciativas**: Un KPI puede tener múltiples iniciativas para mejorarlo
5. **KPI → RegistrosHistoricos**: Un KPI mantiene un historial de valores

---

## 🛠️ COMANDOS PARA USAR EL SCHEMA

### **Sincronizar con la base de datos:**
```bash
npx prisma db push
npx prisma generate
```

### **Crear datos de prueba:**
```bash
node seed-bsc-completo.js
```

### **Verificar estructura:**
```bash
node test-connection.js
node verify-database-integrity.js
```

### **Explorar datos:**
```bash
npx prisma studio
```

---

## 📝 EJEMPLOS DE CONSULTAS

### **Obtener todas las perspectivas con sus objetivos:**
```javascript
const perspectivas = await prisma.perspectiva.findMany({
  include: {
    objetivos: {
      include: {
        kpis: true
      }
    }
  }
});
```

### **Obtener KPIs con estado actual vs meta:**
```javascript
const kpis = await prisma.kPI.findMany({
  include: {
    objetivo: {
      include: {
        perspectiva: true
      }
    }
  }
});
```

### **Obtener iniciativas de un usuario:**
```javascript
const iniciativas = await prisma.iniciativa.findMany({
  where: {
    responsable_id: userId
  },
  include: {
    kpi: {
      include: {
        objetivo: {
          include: {
            perspectiva: true
          }
        }
      }
    }
  }
});
```

### **Obtener histórico de un KPI:**
```javascript
const historico = await prisma.registroHistorico.findMany({
  where: {
    kpi_id: kpiId
  },
  orderBy: {
    fecha: 'desc'
  },
  take: 12 // últimos 12 registros
});
```

---

## ✅ VALIDACIONES EN LA BASE DE DATOS

### **CHECK Constraints aplicados:**
- `unidad`: Solo permite '%', 'S/', 'veces', 'puntos'
- `progreso`: Solo permite valores entre 0 y 100

### **UNIQUE Constraints:**
- `Users.email`: Email único para cada usuario
- `Perspectivas.nombre`: Nombre único para cada perspectiva

### **FOREIGN KEY Constraints:**
- Todas las relaciones están protegidas con claves foráneas
- Integridad referencial garantizada

---

## 🎯 BENEFICIOS DEL DISEÑO

1. **Flexibilidad**: Permite cualquier número de perspectivas, objetivos y KPIs
2. **Trazabilidad**: Registro histórico completo de todos los KPIs
3. **Responsabilidad**: Asignación clara de responsables a iniciativas
4. **Escalabilidad**: Diseño preparado para crecer con la organización
5. **Integridad**: Todas las relaciones están protegidas
6. **Auditoría**: Fechas automáticas de creación y actualización

¡Este schema te permite implementar un sistema completo de Balanced Scorecard! 🚀
