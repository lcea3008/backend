# 📋 Guía Completa de Endpoints - API BSC

## 🎯 Estructura Implementada

Todas las carpetas de API ahora tienen endpoints con parámetros dinámicos (`[id]`) excepto **auth**.

### 📂 **1. Perspectivas**
**Rutas Base:**
- `GET /api/perspectivas` - Obtener todas las perspectivas
- `POST /api/perspectivas` - Crear nueva perspectiva

**Rutas con ID:**
- `GET /api/perspectivas/[id]` - Obtener perspectiva específica (con objetivos y KPIs)
- `PUT /api/perspectivas/[id]` - Actualizar perspectiva específica
- `DELETE /api/perspectivas/[id]` - Eliminar perspectiva específica

### 📂 **2. Objetivos**
**Rutas Base:**
- `GET /api/objetivos` - Obtener todos los objetivos (con perspectiva)
- `POST /api/objetivos` - Crear nuevo objetivo

**Rutas con ID:**
- `GET /api/objetivos/[id]` - Obtener objetivo específico (con perspectiva y KPIs)
- `PUT /api/objetivos/[id]` - Actualizar objetivo específico
- `DELETE /api/objetivos/[id]` - Eliminar objetivo específico

### 📂 **3. KPIs**
**Rutas Base:**
- `GET /api/kpi` - Obtener todos los KPIs (con relaciones)
- `POST /api/kpi` - Crear nuevo KPI

**Rutas con ID:**
- `GET /api/kpi/[id]` - Obtener KPI específico (con objetivo, perspectiva, iniciativas, históricos)
- `PUT /api/kpi/[id]` - Actualizar KPI específico
- `DELETE /api/kpi/[id]` - Eliminar KPI específico

### 📂 **4. Iniciativas**
**Rutas Base:**
- `GET /api/iniciativas` - Obtener todas las iniciativas
- `POST /api/iniciativas` - Crear nueva iniciativa

**Rutas con ID:**
- `GET /api/iniciativas/[id]` - Obtener iniciativa específica (con KPI, objetivo, perspectiva, responsable)
- `PUT /api/iniciativas/[id]` - Actualizar iniciativa específica
- `DELETE /api/iniciativas/[id]` - Eliminar iniciativa específica

### 📂 **5. Registros Históricos**
**Rutas Base:**
- `GET /api/registroHistorico` - Obtener todos los registros (con KPI)
- `POST /api/registroHistorico` - Crear nuevo registro

**Rutas con ID:**
- `GET /api/registroHistorico/[id]` - Obtener registro específico (con KPI)
- `PUT /api/registroHistorico/[id]` - Actualizar registro específico
- `DELETE /api/registroHistorico/[id]` - Eliminar registro específico

### 📂 **6. Users**
**Rutas Base:**
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear nuevo usuario

**Rutas con ID:**
- `GET /api/users/[id]` - Obtener usuario específico (con iniciativas asignadas)
- `PUT /api/users/[id]` - Actualizar usuario específico
- `DELETE /api/users/[id]` - Eliminar usuario específico

### 📂 **7. Auth** (Sin cambios)
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario

## 🔧 Ejemplos para Thunder Client

### **DELETE con ID en URL (Patrón implementado):**
```
DELETE http://localhost:3000/api/perspectivas/1
DELETE http://localhost:3000/api/objetivos/1
DELETE http://localhost:3000/api/kpi/1
DELETE http://localhost:3000/api/iniciativas/1
DELETE http://localhost:3000/api/registroHistorico/1
DELETE http://localhost:3000/api/users/1
```

### **PUT con ID en URL:**
```
PUT http://localhost:3000/api/perspectivas/1
Content-Type: application/json

{
  "nombre": "Nueva Perspectiva",
  "descripcion": "Nueva descripción"
}
```

### **GET específico con ID en URL:**
```
GET http://localhost:3000/api/perspectivas/1
GET http://localhost:3000/api/objetivos/1
GET http://localhost:3000/api/kpi/1
GET http://localhost:3000/api/iniciativas/1
GET http://localhost:3000/api/registroHistorico/1
GET http://localhost:3000/api/users/1
```

## ✅ Características Implementadas

### 🔒 **Validaciones Completas**
- Verificación de tipos de datos (ID numérico)
- Campos requeridos
- Existencia de registros antes de actualizar/eliminar
- Existencia de relaciones (KPI existe antes de crear registro, etc.)
- Emails únicos para usuarios

### 🔗 **Relaciones Incluidas**
- Todos los endpoints GET incluyen relaciones relevantes
- Queries optimizadas con `select` específicos
- Información anidada completa (perspectiva > objetivo > KPI > iniciativa)

### 📊 **Respuestas Estructuradas**
- **200**: Operación exitosa
- **201**: Creación exitosa  
- **400**: Error de validación
- **404**: Recurso no encontrado
- **500**: Error del servidor

### 🐛 **Manejo de Errores**
- Logs detallados en consola
- Stack traces para debugging
- Mensajes de error descriptivos
- Detalles técnicos para desarrollo

## 🚀 **Diferencia Clave Implementada**

**❌ Antes:** ID en el body
```json
DELETE /api/endpoint
{
  "id": 1
}
```

**✅ Ahora:** ID en la URL (como solicitaste)
```
DELETE /api/endpoint/1
```

¡Todos los endpoints están listos para usar con el frontend! 🎉

## 📁 **Estructura de Archivos Creada**
```
src/app/api/
├── auth/ (sin cambios)
├── perspectivas/
│   ├── route.ts
│   └── [id]/route.ts ✨
├── objetivos/
│   ├── route.ts
│   └── [id]/route.ts ✨
├── kpi/
│   ├── route.ts
│   └── [id]/route.ts ✨
├── iniciativas/
│   ├── route.ts
│   └── [id]/route.ts ✨
├── registroHistorico/
│   ├── route.ts
│   └── [id]/route.ts ✨
└── users/
    ├── route.ts
    └── [id]/route.ts ✨
```
