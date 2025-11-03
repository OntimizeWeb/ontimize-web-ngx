# Análisis de Errores en Tests - Ontimize Web NGX

## Resumen Ejecutivo

**Estado Actual**: 
- ✅ 423 tests pasando (65%)
- ⚠️ 226 tests fallando (35%)
- 0 errores de compilación

## Categorías de Errores Identificadas

### 1. **Componentes Combo Renderer** (Alta prioridad)
**Problema**: Los combo renderers heredan de `OComboCustomRenderer` que requiere `OComboComponent` en el injector.

**Archivos afectados**:
- `o-combo-renderer-currency.component.spec.ts`
- `o-combo-renderer-real.component.spec.ts`  
- `o-combo-renderer-integer.component.spec.ts`
- `o-combo-renderer-percentage.component.spec.ts`
- Otros combo renderers...

**Código problemático**:
```typescript
constructor(protected injector: Injector) {
  super(injector); // Llama a OComboCustomRenderer
  this.currencyService = this.injector.get(CurrencyService);
}

// En OComboCustomRenderer:
constructor(protected injector: Injector) {
  this.comboComponent = this.injector.get(OComboComponent); // ❌ FALLA aquí
}
```

**Solución**:
```typescript
// En el test:
const mockOComboComponent = jasmine.createSpyObj('OComboComponent', [
  'registerRenderer',
  'getDataArray'
]);

await TestBed.configureTestingModule({
  // ...
  providers: [
    { provide: OComboComponent, useValue: mockOComboComponent },
    ...otherProviders
  ]
});

const mockInjector = TestBed.inject(Injector);
component = new OComboRendererCurrencyComponent(mockInjector);
```

### 2. **Componentes Table Cell Renderer/Editor** (Prioridad media)
**Problema**: Similar a combo renderers, algunos requieren `OTableComponent` u otros servicios específicos.

**Archivos afectados**:
- `o-table-cell-renderer-*.component.spec.ts` (varios)
- `o-table-cell-editor-*.component.spec.ts` (varios)

**Solución similar**: Proveer mocks de `OTableComponent` en el injector.

### 3. **Componentes con ComponentStateService** (Prioridad media)
**Problema**: Componentes como `OFilterBuilderComponent`, `OFormLayoutManagerComponent` intentan acceder a `componentStateService` que puede no estar inicializado.

**Código problemático**:
```typescript
initialize(): void {
  this.componentStateService.initialize(this); // ❌ Puede ser undefined
  // ...
}
```

**Solución**:
```typescript
// Mock del service
const mockComponentStateService = jasmine.createSpyObj('AbstractComponentStateService', [
  'initialize',
  'initializeState'
]);
mockComponentStateService.state = {};

// Inyectar en el componente después de crearlo
component.componentStateService = mockComponentStateService;
```

### 4. **Componentes con ngOnInit/ngAfterViewInit** (Prioridad baja)
**Problema**: Con instanciación manual, los lifecycle hooks no se ejecutan automáticamente.

**Solución**:
```typescript
component = new ComponentName(dependencies);
// Llamar manualmente si es necesario:
if (component.ngOnInit) {
  component.ngOnInit();
}
```

### 5. **Componentes Tree** (Prioridad alta)
**Problema**: `OTreeComponent` y `OTreeNodeComponent` tienen dependencias complejas y circulares.

**Archivos afectados**:
- `o-tree.component.spec.ts`
- `o-tree-node/tree-node.component.spec.ts`

**Requiere**: Análisis específico de dependencias.

## Estrategia de Corrección Recomendada

### Fase 1: Componentes Combo Renderer (Impacto: ~20-30 tests)
1. Crear mock de `OComboComponent` en cada test
2. Proveerlo en el TestBed
3. Verificar que `registerRenderer()` se llame correctamente

### Fase 2: Componentes Table (Impacto: ~30-40 tests)
1. Crear mock de `OTableComponent` con métodos básicos
2. Proveerlo en tests de cell renderers/editors
3. Validar que los componentes se registren correctamente

### Fase 3: Servicios de Estado (Impacto: ~15-20 tests)
1. Mockear `AbstractComponentStateService`
2. Inyectar en componentes que lo requieran
3. Verificar que `initialize()` funcione sin errores

### Fase 4: Componentes Complejos (Impacto: ~20-30 tests)
1. Analizar componentes Tree, Form, Layout
2. Resolver dependencias específicas
3. Ajustar tests caso por caso

### Fase 5: Tests Legacy (Impacto: ~10-20 tests)
1. Revisar tests que usan TestBed.createComponent (no convertidos)
2. Decidir si convertir o arreglar con el enfoque tradicional

## Patrón General de Corrección

```typescript
// 1. Identificar dependencias del constructor
constructor(
  protected injector: Injector,
  // ... otras dependencias
) {
  // 2. Identificar servicios obtenidos del injector
  this.someService = this.injector.get(SomeService);
}

// 3. En el test, crear mocks y proveerlos
const mockSomeService = jasmine.createSpyObj('SomeService', ['method1', 'method2']);

await TestBed.configureTestingModule({
  providers: [
    { provide: SomeService, useValue: mockSomeService },
    // ... otros providers
  ]
});

// 4. Instanciar manualmente
const mockInjector = TestBed.inject(Injector);
component = new ComponentName(mockInjector, ...otherDeps);

// 5. Configurar propiedades adicionales si es necesario
component.someProperty = mockValue;

// 6. Llamar lifecycle hooks manualmente si se requiere
if (component.ngOnInit) {
  component.ngOnInit();
}
```

## Próximos Pasos Sugeridos

1. **Ejecutar subset de tests** para validar hipótesis:
   ```bash
   npm run test:lib -- --include='**/combo-renderer/**/*.spec.ts'
   ```

2. **Corregir un componente de cada categoría** como prueba

3. **Crear scripts de corrección masiva** solo después de validar el patrón

4. **No automatizar** hasta tener 3-5 archivos corregidos manualmente y validados

## Notas Importantes

- ⚠️ **NO crear scripts de corrección masiva todavía**
- ✅ Corregir manualmente primero 5-10 archivos
- ✅ Validar que el patrón funciona
- ✅ Documentar casos especiales
- ⚠️ Los tests con TestBed.createComponent que funcionan bien, **NO tocarlos**
