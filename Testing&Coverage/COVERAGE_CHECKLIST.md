# ✅ Checklist Práctico - Mejora de Cobertura Input

## 🎯 Cómo Usar Este Checklist

1. Selecciona un componente de la lista
2. Sigue el checklist específico
3. Ejecuta tests frecuentemente
4. Marca items conforme completes

---

## 📋 FASE 0: FUNDACIONES (Semana 1)

### 1. o-form-control.class.ts (3.84% → 60%+)

**Archivo**: `projects/ontimize-web-ngx/src/lib/components/input/o-form-control.class.ts`

- [ ] **Análisis Inicial (15 min)**
  - [ ] Leer la clase completa
  - [ ] Identificar métodos principales
  - [ ] Ver qué tests ya existen
  
- [ ] **Tests de Inicialización (30 min)**
  - [ ] Test para crear instancia
  - [ ] Test para inicializar con valores por defecto
  - [ ] Test para inyectar dependencias
  
- [ ] **Tests de Getters/Setters (45 min)**
  - [ ] Test para getter `value`
  - [ ] Test para setter `value`
  - [ ] Test para getter `disabled`
  - [ ] Test para setter `disabled`
  - [ ] Test para getter `enabled`
  - [ ] Test para getter `touched`
  - [ ] Test para getter `dirty`
  - [ ] Test para getter `pristine`
  
- [ ] **Tests de Métodos Principales (60 min)**
  - [ ] Test para `markAsTouched()`
  - [ ] Test para `markAsDirty()`
  - [ ] Test para `markAsPristine()`
  - [ ] Test para `markAsUntouched()`
  - [ ] Test para `reset()`
  - [ ] Test para `clearAsyncValidators()`
  
- [ ] **Tests de Validación (45 min)**
  - [ ] Test para `valid` property
  - [ ] Test para `invalid` property
  - [ ] Test para `hasError()`
  - [ ] Test para `getError()`
  - [ ] Test para validación con errores múltiples
  
- [ ] **Tests de Estado (30 min)**
  - [ ] Test para cambio de estado
  - [ ] Test para propagación de cambios
  - [ ] Test para observables
  
- [ ] **Verificar Cobertura**
  ```bash
  npm test -- --include="**/o-form-control.class.spec.ts" --code-coverage
  # Objetivo: > 60% líneas, > 30% ramas
  ```

---

### 2. o-form-service-component.class.ts (25.25% → 65%+)

**Archivo**: `projects/ontimize-web-ngx/src/lib/components/input/o-form-service-component.class.ts`

- [ ] **Análisis Inicial (15 min)**
  - [ ] Entender cómo extiende o-form-control.class
  - [ ] Revisar métodos de servicio
  - [ ] Ver tests existentes
  
- [ ] **Tests de Inyección de Servicios (30 min)**
  - [ ] Test para inyectar servicio
  - [ ] Test para servicio mock
  - [ ] Test para múltiples servicios
  
- [ ] **Tests de Carga de Datos (45 min)**
  - [ ] Test para loadData()
  - [ ] Test para fetchData()
  - [ ] Test para mapear respuesta del servicio
  - [ ] Test para filtrar datos
  - [ ] Test para paginar datos (si aplica)
  
- [ ] **Tests de Errores HTTP (45 min)**
  - [ ] Test para error 404
  - [ ] Test para error 500
  - [ ] Test para timeout
  - [ ] Test para offline
  - [ ] Test para manejo de errores genérico
  
- [ ] **Tests de Caché (30 min)**
  - [ ] Test para habilitar caché
  - [ ] Test para usar datos en caché
  - [ ] Test para invalidar caché
  - [ ] Test para expiración de caché
  
- [ ] **Tests de Actualización Reactiva (30 min)**
  - [ ] Test para actualizar datos automáticamente
  - [ ] Test para refrescar datos
  - [ ] Test para sincronizar múltiples instancias
  
- [ ] **Tests de Forma (30 min)**
  - [ ] Test para registrar con formulario padre
  - [ ] Test para actualizar valor en forma
  - [ ] Test para desregistrar de forma
  
- [ ] **Verificar Cobertura**
  ```bash
  npm test -- --include="**/o-form-service-component.class.spec.ts" --code-coverage
  # Objetivo: > 65% líneas, > 30% ramas
  ```

---

## 📊 FASE 1: COMPONENTES CRÍTICOS (Semana 2-3)

### 3. date-input (2.91% → 50%+)

**Archivo**: `projects/ontimize-web-ngx/src/lib/components/input/date-input/o-date-input.component.ts`  
**Tests**: `...date-input/o-date-input.component.spec.ts`

- [ ] **Setup Básico (15 min)**
  ```bash
  # Ejecutar para ver estado actual
  npm test -- --include="**/date-input/**/*.spec.ts" --code-coverage
  ```
  - [ ] Revisar lineas sin cobertura en el reporte HTML
  - [ ] Identificar métodos no testeados
  
- [ ] **Tests de Inicialización (30 min)**
  - [ ] Test para crear componente
  - [ ] Test para inicializar datepicker
  - [ ] Test para format por defecto ('L')
  - [ ] Test para locale por defecto
  
- [ ] **Tests de Selección de Fecha (60 min)**
  - [ ] Test para seleccionar fecha con picker
  - [ ] Test para fecha válida en formato correcto
  - [ ] Test para actualizar valor
  - [ ] Test para emitir evento de cambio
  - [ ] Test para múltiples selecciones
  - [ ] Test para cancelar selección
  
- [ ] **Tests de Validación de Rango (45 min)**
  - [ ] Test para min date válido
  - [ ] Test para max date válido
  - [ ] Test para fecha anterior a min (error)
  - [ ] Test para fecha posterior a max (error)
  - [ ] Test para sin rango
  - [ ] Test para rango invertido
  
- [ ] **Tests de Formato y Locale (45 min)**
  - [ ] Test para diferentes formatos (YYYY-MM-DD, DD/MM/YYYY, etc.)
  - [ ] Test para cambiar locale
  - [ ] Test para locale invalido
  - [ ] Test para formato invalido
  - [ ] Test para parse de string a fecha
  
- [ ] **Tests de Vista del Picker (30 min)**
  - [ ] Test para start-view='month'
  - [ ] Test para start-view='year'
  - [ ] Test para cambiar vista
  - [ ] Test para start-at
  
- [ ] **Tests de Modo Touch (20 min)**
  - [ ] Test para touch-ui=true (mobile)
  - [ ] Test para touch-ui=false (desktop)
  - [ ] Test para renderizado diferente
  
- [ ] **Tests de Entrada de Texto (30 min)**
  - [ ] Test para text-input-enabled=true
  - [ ] Test para text-input-enabled=false
  - [ ] Test para parsear texto escrito
  - [ ] Test para formato válido/inválido
  
- [ ] **Tests de Filtrado de Fechas (30 min)**
  - [ ] Test para fecha válida (pasa filtro)
  - [ ] Test para fecha inválida (falla filtro)
  - [ ] Test para filtro personalizado (ej: weekends)
  - [ ] Test para custom class (ej: holidays)
  
- [ ] **Tests de Validación (30 min)**
  - [ ] Test para required=true + sin valor
  - [ ] Test para required=false + sin valor
  - [ ] Test para validación de fecha
  - [ ] Test para mostrar mensajes de error
  
- [ ] **Tests Edge Cases (45 min)**
  - [ ] Test para null date
  - [ ] Test para undefined date
  - [ ] Test para fecha inválida
  - [ ] Test para leap year (Feb 29)
  - [ ] Test para cambio de timezone
  - [ ] Test para año 1900
  - [ ] Test para año 2099
  - [ ] Test para empty string
  
- [ ] **Verificar Cobertura**
  ```bash
  npm test -- --include="**/date-input/**/*.spec.ts" --code-coverage
  # Objetivo: > 50% líneas
  ```

---

### 4. file-input (8.77% → 50%+)

**Archivo**: `projects/ontimize-web-ngx/src/lib/components/input/file-input/o-file-input.component.ts`

- [ ] **Setup y Análisis (15 min)**
  - [ ] Revisar reporte de cobertura actual
  - [ ] Identificar métodos sin cobertura
  
- [ ] **Tests de Selección de Archivos (45 min)**
  - [ ] Test para seleccionar 1 archivo
  - [ ] Test para seleccionar múltiples archivos
  - [ ] Test para cancelar selección
  - [ ] Test para limpiar selección
  - [ ] Test para archivo duplicado
  
- [ ] **Tests de Validación de Tipo (30 min)**
  - [ ] Test para tipo MIME válido
  - [ ] Test para tipo MIME inválido
  - [ ] Test para extensión válida
  - [ ] Test para extensión inválida
  - [ ] Test para sin restricción de tipo
  
- [ ] **Tests de Tamaño (30 min)**
  - [ ] Test para archivo dentro de tamaño máximo
  - [ ] Test para archivo mayor a máximo
  - [ ] Test para tamaño 0 bytes
  - [ ] Test para tamaño muy grande
  
- [ ] **Tests de Eventos (30 min)**
  - [ ] Test para onFileSelected
  - [ ] Test para onFileRemoved
  - [ ] Test para onChange
  - [ ] Test para eventos en orden correcto
  
- [ ] **Tests de Drag & Drop (30 min)**
  - [ ] Test para drag archivo(s)
  - [ ] Test para drop archivo(s)
  - [ ] Test para validar durante drop
  - [ ] Test para rechazar drop inválido
  
- [ ] **Tests de Vista Previa (20 min)**
  - [ ] Test para mostrar preview de imagen
  - [ ] Test para mostrar preview de archivo
  - [ ] Test para remover preview
  
- [ ] **Tests de Integración con Forma (20 min)**
  - [ ] Test para registrar con formulario
  - [ ] Test para actualizar valor en forma
  - [ ] Test para validación en forma
  
- [ ] **Tests Edge Cases (30 min)**
  - [ ] Test para archivo sin extensión
  - [ ] Test para nombre con caracteres especiales
  - [ ] Test para path muy largo
  - [ ] Test para 0 archivos
  
- [ ] **Verificar Cobertura**
  ```bash
  npm test -- --include="**/file-input/**/*.spec.ts" --code-coverage
  # Objetivo: > 50% líneas
  ```

---

### 5. hour-input (9.16% → 50%+)

**Archivo**: `projects/ontimize-web-ngx/src/lib/components/input/hour-input/o-hour-input.component.ts`

- [ ] **Setup (10 min)**
  - [ ] Revisar cobertura actual
  - [ ] Entender formato de tiempo
  
- [ ] **Tests de Formato (40 min)**
  - [ ] Test para formato 24h (00:00-23:59)
  - [ ] Test para formato 12h (12:00-11:59 AM/PM)
  - [ ] Test para parsecar string "10:30"
  - [ ] Test para parsear "10:30:45" (con segundos)
  - [ ] Test para formato inválido
  
- [ ] **Tests de Incremento/Decremento (30 min)**
  - [ ] Test para incrementar hora
  - [ ] Test para decrementar hora
  - [ ] Test para rollover a medianoche
  - [ ] Test para rollover a 24:00
  - [ ] Test para paso configurable (15min, 30min, etc)
  
- [ ] **Tests de Entrada de Teclado (30 min)**
  - [ ] Test para tecla arriba incrementa
  - [ ] Test para tecla abajo decrementa
  - [ ] Test para tipeo directo
  - [ ] Test para Enter confirma
  
- [ ] **Tests de Validación (30 min)**
  - [ ] Test para hora válida 0-23
  - [ ] Test para hora inválida (25:00)
  - [ ] Test para minutos válidos 0-59
  - [ ] Test para minutos inválidos (60)
  - [ ] Test para required=true sin valor
  
- [ ] **Tests Edge Cases (30 min)**
  - [ ] Test para null value
  - [ ] Test para "23:59:59" (límite)
  - [ ] Test para "00:00:00" (inicio)
  - [ ] Test para hora sin minutos
  - [ ] Test para DST (daylight saving)
  
- [ ] **Tests de Eventos (20 min)**
  - [ ] Test para onChange
  - [ ] Test para onBlur
  - [ ] Test para onFocus
  
- [ ] **Verificar Cobertura**
  ```bash
  npm test -- --include="**/hour-input/**/*.spec.ts" --code-coverage
  # Objetivo: > 50% líneas
  ```

---

### 6. combo (10.85% → 50%+)

**Nota**: Este es MUY complejo. Considera dividirlo en partes.

- [ ] **Fase 1: Datos y Carga (Horas 1-3)**
  - [ ] Test para cargar datos de array
  - [ ] Test para cargar datos de servicio
  - [ ] Test para manejar error de carga
  - [ ] Test para datos vacíos
  
- [ ] **Fase 2: Selección (Horas 4-6)**
  - [ ] Test para seleccionar un item
  - [ ] Test para seleccionar múltiples items
  - [ ] Test para deseleccionar
  - [ ] Test para limpiar selección
  
- [ ] **Fase 3: Búsqueda (Horas 7-9)**
  - [ ] Test para filtrar por búsqueda
  - [ ] Test para búsqueda case-insensitive
  - [ ] Test para limpiar filtro
  - [ ] Test para debounce de búsqueda
  
- [ ] **Fase 4: Validación (Horas 10-11)**
  - [ ] Test para required=true
  - [ ] Test para custom validators
  
- [ ] **Verificar Cobertura**
  ```bash
  npm test -- --include="**/combo/**/*.spec.ts" --code-coverage --watch=false
  # Objetivo: > 50% líneas
  ```

---

## 📝 TEMPLATE CHECKLIST PARA CUALQUIER COMPONENTE

Use este template para otros componentes:

```
### COMPONENTE: [Nombre] ([% actual] → [% objetivo])

**Archivo**: [ruta]
**Spec**: [ruta al spec]

- [ ] **Setup (15 min)**
  - [ ] Revisar código
  - [ ] Ver cobertura actual
  - [ ] Identificar gaps

- [ ] **Grupo 1: [Funcionalidad 1] (X horas)**
  - [ ] Test A
  - [ ] Test B

- [ ] **Grupo 2: [Funcionalidad 2] (X horas)**
  - [ ] Test A
  - [ ] Test B

- [ ] **Edge Cases (30 min)**
  - [ ] Caso límite 1
  - [ ] Caso límite 2

- [ ] **Verificar Cobertura**
  ```bash
  npm test -- --include="**[componente]**/*.spec.ts" --code-coverage
  ```
```

---

## 🔍 VERIFICACIÓN RÁPIDA

Después de completar cada componente:

```bash
# 1. Ejecutar tests (deben pasar)
npm test -- --include="**[COMPONENTE]**/*.spec.ts" --watch=false

# 2. Generar cobertura
npm test -- --include="**[COMPONENTE]**/*.spec.ts" --code-coverage --watch=false

# 3. Verificar resultado (abre el HTML)
start coverage/ontimize-web-ngx/components/input/[COMPONENTE]/index.html
```

**Criterios de éxito**:
- ✅ Todos los tests pasan
- ✅ Sin errores ni warnings
- ✅ Cobertura de líneas > objetivo
- ✅ Cobertura de ramas > 0% (idealmente > 25%)

---

## 📊 TRACKER DE PROGRESO

Copia esto y actualiza conforme completes componentes:

```
FASE 0: FUNDACIONES
- [ ] o-form-control (3.84% → 60%) - Horas: ___
- [ ] o-form-service (25.25% → 65%) - Horas: ___

FASE 1: CRÍTICOS
- [ ] date-input (2.91% → 50%) - Horas: ___
- [ ] file-input (8.77% → 50%) - Horas: ___
- [ ] hour-input (9.16% → 50%) - Horas: ___
- [ ] combo (10.85% → 50%) - Horas: ___

Total horas dedicadas: ___
```

---

**Siguiente paso**: Selecciona un componente y comienza con el primer checklist 🚀
