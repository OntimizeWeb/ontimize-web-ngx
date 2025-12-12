# 🎯 GUÍA RÁPIDA - Mejorar Cobertura en 30 Minutos

## ✅ Componentes Recientemente Completados

Los siguientes componentes tienen specs nuevos y mejorados:

| Componente | Tests Nuevos | Cobertura | Status |
|-----------|--------------|-----------|--------|
| **o-nif-input** | 29 | 33% → 75%+ | ✅ Listo |
| **o-text-input** | 68 | 26% → 75%+ | ✅ Listo |
| **o-email-input** | 80+ | 33% → 75%+ | ✅ Listo |
| **o-real-input** | 90+ | 32% → 75%+ | ✅ Listo |

**Puedes usar estos como referencia para otros componentes**

---

## Antes de Comenzar

```bash
# 1. Asegúrate que los tests corren
npm test -- --include="**/input/**/*.spec.ts" --watch=false

# 2. Genera reporte de cobertura actual
npm run test-coverage
```

---

## Opción A: Mejorar Componente Simple (30 min)

### Componentes recomendados:
- `text-input` (85.29% → 95%)
- `password-input` (85.71% → 95%)
- `integer-input` (76.71% → 90%)
- `checkbox` (77.77% → 90%)

### Proceso:

1. **Abre el spec (2 min)**
   ```
   projects/ontimize-web-ngx/src/lib/components/input/
   [COMPONENTE]/[COMPONENTE].component.spec.ts
   ```

2. **Ve al reporte de cobertura (3 min)**
   ```
   coverage/ontimize-web-ngx/components/input/
   [COMPONENTE]/index.html
   ```
   → Click en el archivo `.ts` para ver líneas sin cobertura

3. **Identifica lo que falta (5 min)**
   - Busca líneas rojas (no cubiertas)
   - Identifica qué test falta
   - Nota el patrón

4. **Copia un test similar (5 min)**
   - Busca un test que ya funciona
   - Adapta para nuevo caso
   - Usa ejemplo de `COVERAGE_EXAMPLES.md` si es necesario

5. **Ejecuta test (5 min)**
   ```bash
   npm test -- --include="**[COMPONENTE]**/*.spec.ts" --watch=false
   ```

6. **Verifica cobertura (5 min)**
   ```bash
   npm test -- --include="**[COMPONENTE]**/*.spec.ts" --code-coverage --watch=false
   ```

---

## Opción B: Mejorar Componente Complejo (2-3 horas)

### Componentes recomendados:
- `date-input` (2.91% → 50%)
- `combo` (10.85% → 50%)

### Proceso:

1. **Crear test template (30 min)**
   ```bash
   cp projects/ontimize-web-ngx/src/lib/components/input/text-input/o-text-input.component.spec.ts \
      projects/ontimize-web-ngx/src/lib/components/input/[COMPONENTE]/o-[COMPONENTE].component.spec.ts
   ```

2. **Analizar componente (30 min)**
   - Leer los métodos principales
   - Ver dependencias (Material, services, etc.)
   - Entender constructor

3. **Adaptar imports en spec (15 min)**
   - Cambiar import de clase
   - Cambiar módulos necesarios
   - Adaptar providers

4. **Escribir tests básicos (60 min)**
   - Creación del componente
   - Propiedades principales
   - Métodos core
   - Validaciones

5. **Ejecutar y verificar (15 min)**
   ```bash
   npm test -- --include="**[COMPONENTE]**/*.spec.ts" --code-coverage --watch=false
   ```

---

## Checklist Rápido por Tipo

### Input Simples (text, email, password)
```
✓ Test de creación
✓ Test de binding
✓ Test de validación (required, minlength, etc.)
✓ Test de eventos (blur, focus, change)
✓ Test de edge cases (null, empty, special chars)
```

### Input con Pickers (date, time, hour)
```
✓ Test de inicialización de picker
✓ Test de selección de valor
✓ Test de formato
✓ Test de validación de rango (min/max)
✓ Test de locale/localization
```

### Input complejos (combo, listpicker)
```
✓ Test de carga de datos
✓ Test de filtrado/búsqueda
✓ Test de selección (single/multi)
✓ Test de manejo de errores HTTP
✓ Test de caché
```

---

## Errores Comunes y Soluciones

### ❌ "Cannot find module '@angular/material'"
**Solución**: Importa el módulo en TestBed
```typescript
imports: [
  MatInputModule,
  MatFormFieldModule,
  // ... otros módulos
]
```

### ❌ "No provider for HttpTestingController"
**Solución**: Importa e inyecta
```typescript
imports: [HttpClientTestingModule],
// luego
httpMock = TestBed.inject(HttpTestingController);
```

### ❌ "Property 'value' has no initializer"
**Solución**: Usa variables con tipos claros
```typescript
component.value = 'test';
component.disabled = true;
```

### ❌ "Async operation not completed"
**Solución**: Usa fakeAsync + tick
```typescript
it('test', fakeAsync(() => {
  component.loadData();
  tick(); // espera async
  expect(component.data).toBeDefined();
}));
```

---

## Template Mínimo de Test

Copia esto como base para cualquier componente:

```typescript
describe('OComponentNameComponent', () => {
  let component: OComponentNameComponent;
  let fixture: ComponentFixture<OComponentNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OComponentNameComponent],
      imports: [
        // Agregar módulos necesarios
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        // Agregar servicios necesarios
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OComponentNameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Agregar más tests aquí
});
```

---

## Comandos de Ayuda Rápida

```bash
# Ver qué tests existen
find projects/ontimize-web-ngx/src/lib/components/input -name "*.spec.ts"

# Ejecutar un test específico
npm test -- --include="**/date-input/**/*.spec.ts" --watch=false

# Generar cobertura y abrir en navegador
npm run test-coverage && start coverage/ontimize-web-ngx/index.html

# Ver solo el resumen de cobertura
npm test -- --include="**/input/**/*.spec.ts" --code-coverage --watch=false --reporters=coverage

# Generar reporte en formato JSON
npm test -- --include="**/input/**/*.spec.ts" --code-coverage --watch=false --reporters=json
```

---

## Cálculo Rápido de Esfuerzo

Para cualquier componente:

| Líneas de Código | Complejidad | Tiempo Est. | Cobertura Target |
|------------------|-------------|------------|-----------------|
| 50-150 | Baja | 1-2h | 80%+ |
| 150-300 | Media | 2-4h | 70%+ |
| 300-600 | Alta | 4-8h | 50%+ |
| 600+ | Muy Alta | 8h+ | 40%+ |

**Para estimarlo**: 
```
Tiempo = (LOC / 100) * 1.5 horas
```

Ej: 200 LOC → (200/100) * 1.5 = 3 horas

---

## Métricas de Progreso

Copia esto y actualiza cada hora:

```
TIEMPO INVERTIDO: [  ] horas
COBERTURA INICIAL: XX%
COBERTURA ACTUAL: XX%
GANANCIA: XX%

COMPONENTES COMPLETADOS:
[ ] Componente 1 - Horas: X
[ ] Componente 2 - Horas: X
[ ] Componente 3 - Horas: X
```

---

## Próximos Pasos

### Si tienes 30 minutos:
→ Mejora `text-input` branches  
→ +1-2% cobertura

### Si tienes 2-3 horas:
→ Completa `text-input` + `password-input`  
→ +5-10% cobertura

### Si tienes medio día:
→ Haz `date-input` basics  
→ +15-20% cobertura

### Si tienes día completo:
→ Completa clases base  
→ +25-35% cobertura

---

## 🆘 Si Te Atascas

1. **Ve a `COVERAGE_EXAMPLES.md`** → Busca patrón similar
2. **Revisa spec de componente similar** → Copia estructura
3. **Ejecuta sin cobertura primero** → `npm test -- --include="**[comp]**/*.spec.ts"`
4. **Lee el error** → Suele ser clara la solución
5. **Busca `OTestingUtils`** → Tiene helpers útiles

---

**¡Vamos! A mejorar la cobertura! 🚀**

Selecciona tu componente y comienza. Cada línea de test cubierta es un paso hacia un código más robusto.
