# 🎯 Resumen Ejecutivo - Plan de Cobertura Input

## Estado Actual: 23.55% (Líneas) | 5.83% (Ramas)
## Objetivo: 70%+ (Líneas) | 50%+ (Ramas)

---

## 📊 Componentes Ordenados por Prioridad

### 🔴 CRÍTICOS (Impacto Alto - Líneas <30%)

| # | Componente | Líneas | Ramas | Complejidad | Esfuerzo | Horas | Inicio |
|----|-----------|--------|-------|-------------|----------|-------|--------|
| 1️⃣ | **o-form-control.class** | 3.84% | 6.25% | 🔴 CRÍTICA | ALTO | 4-6h | SEMANA 1 |
| 2️⃣ | **date-input** | 2.91% | 0% | 🔴 CRÍTICA | ALTO | 6-8h | SEMANA 2 |
| 3️⃣ | **date-range-legacy** | 9.37% | 0.59% | 🔴 CRÍTICA | ALTO | 4-5h | SEMANA 2 |
| 4️⃣ | **file-input** | 8.77% | 0% | 🔴 CRÍTICA | MEDIO | 4-5h | SEMANA 2 |
| 5️⃣ | **hour-input** | 9.16% | 0% | 🔴 CRÍTICA | MEDIO | 3-4h | SEMANA 2 |
| 6️⃣ | **combo** | 10.85% | 0% | 🔴 CRÍTICA | MUY ALTO | 6-8h | SEMANA 3 |
| 7️⃣ | **combo-search** | 11.94% | 0% | 🔴 CRÍTICA | ALTO | 4-5h | SEMANA 3 |
| 8️⃣ | **date-range** | 15.43% | 0% | 🟠 ALTA | MEDIO | 3-4h | SEMANA 3 |
| 9️⃣ | **radio** | 15.38% | 0% | 🟠 ALTA | MEDIO | 3-4h | SEMANA 3 |
| 🔟 | **phone-input** | 18.1% | 7.93% | 🟠 ALTA | MEDIO | 4-5h | SEMANA 4 |
| 1️⃣1️⃣ | **listpicker** | 19.64% | 2.53% | 🟠 ALTA | ALTO | 5-6h | SEMANA 4 |
| 1️⃣2️⃣ | **html-input** | 20.68% | 0% | 🟠 ALTA | MEDIO | 3-4h | SEMANA 4 |
| 1️⃣3️⃣ | **time-input** | 23.86% | 0% | 🟠 ALTA | MEDIO | 3-4h | SEMANA 4 |
| 1️⃣4️⃣ | **o-form-service-component** | 25.25% | 3.29% | 🟠 ALTA | MEDIO | 3-5h | SEMANA 1 |

### 🟡 MEDIOS (Líneas 30-70%, Requieren mejora)

| # | Componente | Líneas | Ramas | Esfuerzo | Horas | Semana |
|----|-----------|--------|-------|----------|-------|--------|
| 1 | **real-input** | 32.65% | 0% | BAJO | 2-3h | 5 | ✅ |
| 2 | **nif-input** | 33.33% | 100% | BAJO | 2-3h | 5 | ✅ |
| 3 | **email-input** | 33.33% | 100% | BAJO | 2-3h | 5 | ✅ |
| 4 | **text-input** | 26.47% | 0% | BAJO | 2-3h | 5 | ✅ |

### 🟢 BUENOS (Líneas >70%, Optimización final)

| # | Componente | Líneas | Ramas | Acción | Horas |
|----|-----------|--------|-------|--------|-------|
| 1 | **text-input** | 85.29% | 80% | Mejorar branches | 1-2h |
| 2 | **password-input** | 85.71% | 100% | Mantener | 0h |
| 3 | **checkbox** | 77.77% | 0% | Añadir branches | 1-2h |
| 4 | **integer-input** | 76.71% | 31.57% | Mejorar branches | 1-2h |
| 5 | **slider** | 92.85% | 100% | Mantener | 0h |

---

## 📈 Fases Recomendadas

### ⚡ RUTA RÁPIDA (Impacto máximo en menos tiempo)

```
SEMANA 1 (Fundaciones - 7-11h)
├─ o-form-control.class (4-6h) ← CRÍTICA
└─ o-form-service-component (3-5h)

SEMANA 2-3 (Críticos - 30-45h)
├─ date-input (6-8h) ← Compleja pero muy usada
├─ file-input (4-5h)
├─ hour-input (3-4h)
├─ combo (6-8h) ← Muy compleja
├─ combo-search (4-5h)
├─ date-range (3-4h)
├─ radio (3-4h)
└─ phone-input (4-5h)

SEMANA 4-5 (Mejora - 20-30h)
├─ listpicker (5-6h)
├─ html-input (3-4h)
├─ time-input (3-4h)
├─ real-input (2-3h)
├─ nif-input (2-3h)
├─ email-input (2-3h)
├─ percent-input (2-3h)
├─ textarea-input (2-3h)
├─ search-input (2-3h)
├─ slide-toggle (2-3h)
└─ combo-renderer-icon (2-3h)

SEMANA 6 (Optimización - 10-15h)
├─ currency-input (1-2h)
├─ Mejoras de branches
└─ Documentación
```

---

## 🎬 Cómo Empezar Hoy

### Step 1: Preparación (15 min)
```bash
# Clonar plan en el editor
code COVERAGE_PLAN_INPUT.md

# Verificar tests ejecutándose
npm test -- --include="**/input/**/*.spec.ts" --code-coverage --watch=false
```

### Step 2: Seleccionar Componente (5 min)
**Recomendación**: Empezar con `o-form-control.class` o `text-input`

### Step 3: Analizar Cobertura (10 min)
```bash
# Abrir reporte de cobertura
start coverage/ontimize-web-ngx/components/input/index.html
```

### Step 4: Implementar Tests (2-4 horas)
- Abre el componente `.ts`
- Abre el spec `.spec.ts` 
- Usa patrones de la sección "Estrategia de Testing"
- Añade tests hasta alcanzar 70%+ cobertura

### Step 5: Verificar (5 min)
```bash
npm test -- --include="**/[componente]/**/*.spec.ts" --code-coverage
```

---

## 📊 Tracking de Progreso

### Semana 1
- [ ] o-form-control.class (3.84% → 60%+)
- [ ] o-form-service-component (25.25% → 65%+)

### Semana 2-3
- [ ] date-input (2.91% → 50%+)
- [ ] file-input (8.77% → 50%+)
- [ ] hour-input (9.16% → 50%+)
- [ ] combo (10.85% → 50%+)
- [ ] combo-search (11.94% → 50%+)
- [ ] date-range (15.43% → 50%+)
- [ ] radio (15.38% → 50%+)
- [ ] phone-input (18.1% → 50%+)

### Semana 4-5
- [ ] listpicker (19.64% → 70%+)
- [ ] html-input (20.68% → 70%+)
- [ ] time-input (23.86% → 70%+)
- [ ] real-input (32.65% → 70%+)
- [ ] Resto de componentes a 70%+

### Semana 6+
- [ ] Optimizar branches a 50%+
- [ ] Refinamiento y edge cases
- [ ] Documentación final

---

## 💡 Tips Clave

### Para Componentes Simples (text-input, email, etc.)
✅ Usar fixtures directas  
✅ Tests de input/output claros  
✅ Probar validaciones básicas  

### Para Componentes Complejos (date-input, combo, listpicker)
✅ Mockear servicios HTTP  
✅ Usar `fakeAsync` y `tick`  
✅ Probar estados del componente  
✅ Probar interacción con Material  

### Acelerar Cobertura
✅ Empezar con tests que cubran la ruta feliz  
✅ Luego añadir casos de error  
✅ Usar herramientas de cobertura para identificar líneas no cubiertas  
✅ Reutilizar patrones que funcionan  

---

## 🔗 Referencias Rápidas

| Recurso | Ubicación |
|---------|----------|
| Plan detallado | `COVERAGE_PLAN_INPUT.md` |
| Cobertura actual | `coverage/ontimize-web-ngx/components/input/index.html` |
| Testing guide | `TESTING.md` |
| Componentes input | `projects/ontimize-web-ngx/src/lib/components/input/` |
| Utils de testing | `OTestingUtils` (en el código) |

---

**¿Listo para empezar?** 🚀  
Comienza con la Semana 1 de la Ruta Rápida
