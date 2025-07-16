# 📋 Guía de Endpoints - Registros Históricos

## ✅ Estructura de Rutas Implementada

### 1. **Rutas Base** (`/api/registroHistorico/route.ts`)
- **GET** `/api/registroHistorico` - Obtener todos los registros históricos
- **POST** `/api/registroHistorico` - Crear un nuevo registro histórico

### 2. **Rutas con Parámetros** (`/api/registroHistorico/[id]/route.ts`)
- **GET** `/api/registroHistorico/[id]` - Obtener un registro específico por ID
- **PUT** `/api/registroHistorico/[id]` - Actualizar un registro específico
- **DELETE** `/api/registroHistorico/[id]` - Eliminar un registro específico

## 🔧 Para probar con Thunder Client

### 1. **GET Todos los Registros**
- **URL:** `http://localhost:3000/api/registroHistorico`
- **Método:** GET
- **Respuesta:** Array de registros con información del KPI incluida

### 2. **POST Crear Registro**
- **URL:** `http://localhost:3000/api/registroHistorico`
- **Método:** POST
- **Body (JSON):**
```json
{
  "kpi_id": 1,
  "valor": 85.5,
  "fecha": "2025-07-16"
}
```

### 3. **GET Registro Específico**
- **URL:** `http://localhost:3000/api/registroHistorico/1`
- **Método:** GET
- **Respuesta:** Registro específico con información del KPI

### 4. **PUT Actualizar Registro**
- **URL:** `http://localhost:3000/api/registroHistorico/1`
- **Método:** PUT
- **Body (JSON):**
```json
{
  "kpi_id": 1,
  "valor": 90.0,
  "fecha": "2025-07-16"
}
```

### 5. **DELETE Eliminar Registro**
- **URL:** `http://localhost:3000/api/registroHistorico/1`
- **Método:** DELETE
- **Sin Body** - El ID va en la URL
- **Respuesta:** Confirmación de eliminación

## 🎯 Características Implementadas

### ✅ Validaciones
- Verificación de campos requeridos
- Validación de que el KPI existe antes de crear/actualizar
- Validación de que el registro existe antes de actualizar/eliminar
- Validación de tipos de datos (ID numérico)

### ✅ Relaciones
- Todos los endpoints incluyen información del KPI relacionado
- Queries optimizadas con `select` específicos

### ✅ Manejo de Errores
- Logs detallados en consola
- Respuestas de error estructuradas
- Códigos de estado HTTP apropiados

### ✅ Respuestas Estructuradas
- 200: Operación exitosa
- 201: Creación exitosa
- 400: Error de validación
- 404: Recurso no encontrado
- 500: Error del servidor

## 🚀 Diferencia clave implementada

**Antes:** DELETE con ID en el body
```json
DELETE /api/registroHistorico
{
  "id": 1
}
```

**Ahora:** DELETE con ID en la URL (como solicitaste)
```
DELETE /api/registroHistorico/1
```

¡Los endpoints están listos para usar con el frontend! 🎉
