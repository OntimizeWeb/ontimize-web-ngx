# 🧪 Guía de Testing para Ontimize Web NGX

## 📊 Estado Actual de Cobertura

**Cobertura actual: ~5%** (11 archivos de test de 217 archivos total)
- **158 componentes** (.component.ts)
- **59 servicios** (.service.ts) 
- **Solo 11 archivos de test** (.spec.ts)

## 🎯 Objetivos de Cobertura

| Componente | Meta Mínima | Meta Ideal |
|------------|-------------|------------|
| **Servicios críticos** | 80% | 90% |
| **Componentes principales** | 70% | 85% |
| **Utilidades y helpers** | 90% | 95% |
| **Cobertura general** | 70% | 80% |

## 🚀 Plan de Incremento de Cobertura

### Fase 1: Fundamentos (Semanas 1-2)
- [x] ✅ Configuración mejorada de Karma/Jasmine
- [x] ✅ Utilidades de testing comunes (`OTestingUtils`)
- [x] ✅ Scripts de generación automática de tests
- [ ] 🔄 Tests para servicios críticos (Auth, Dialog, etc.)

### Fase 2: Componentes Base (Semanas 3-4)
- [ ] 📝 Tests para componentes de input (text, date, combo, etc.)
- [ ] 📝 Tests para componentes de botones y navegación
- [ ] 📝 Tests para componentes de layout

### Fase 3: Componentes Complejos (Semanas 5-6)
- [ ] 📝 Tests para tabla (o-table)
- [ ] 📝 Tests para formularios (o-form)
- [ ] 📝 Tests para lista (o-list)
- [ ] 📝 Tests para tree (o-tree)

### Fase 4: Servicios y Utilidades (Semanas 7-8)
- [ ] 📝 Tests para todos los servicios restantes
- [ ] 📝 Tests para pipes y directivas
- [ ] 📝 Tests para utilidades (Util, Codes, etc.)

## 🛠️ Herramientas y Configuración

### Scripts Disponibles

```bash
# Ejecutar todos los tests con cobertura
npm test

# Ejecutar tests en modo CI (sin watch)
npm run test-ci

# Ejecutar tests con watch y cobertura
npm run test-watch

# Generar reporte de cobertura
npm run test-coverage

# Generar tests automáticos para archivos sin tests
npm run generate-tests
```

### Configuración de Karma

La configuración actual incluye:
- **Reportes**: HTML, LCOV, Text Summary, Cobertura
- **Umbrales de cobertura**: 70% (configurable)
- **Soporte para SonarQube**
- **ChromeHeadless para CI**

## 📋 Tipos de Tests por Implementar

### 1. Tests de Componentes

#### Estructura Básica
```typescript
describe('ComponenteEjemplo', () => {
  let component: ComponenteEjemplo;
  let fixture: ComponentFixture<ComponenteEjemplo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponenteEjemplo],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: OTestingUtils.getCommonTestingModuleConfig().providers
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteEjemplo);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests específicos...
});
```

#### Casos de Test Esenciales
- ✅ **Creación**: El componente se crea correctamente
- 🔧 **Propiedades**: Valores por defecto y binding
- 🎨 **Renderizado**: DOM se genera correctamente
- 🎭 **Eventos**: Emisión y manejo de eventos
- ♿ **Accesibilidad**: Atributos ARIA y navegación
- 📱 **Responsividad**: Comportamiento en diferentes tamaños

### 2. Tests de Servicios

#### Estructura Básica
```typescript
describe('ServicioEjemplo', () => {
  let service: ServicioEjemplo;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServicioEjemplo]
    });
    service = TestBed.inject(ServicioEjemplo);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Tests específicos...
});
```

#### Casos de Test Esenciales
- ✅ **Creación**: El servicio se inyecta correctamente
- 🌐 **HTTP Requests**: Llamadas correctas a APIs
- 🔒 **Autenticación**: Manejo de tokens y sesiones
- ❌ **Manejo de errores**: Respuestas ante fallos
- 💾 **Estado**: Persistencia y gestión de datos

### 3. Tests de Utilidades

#### Casos de Test Esenciales
- ✅ **Funciones puras**: Input/output predecible
- 🔧 **Edge cases**: Valores null, undefined, vacíos
- 🎯 **Validaciones**: Reglas de negocio
- 🔄 **Transformaciones**: Mapeo de datos

## 📚 Recursos y Utilidades

### OTestingUtils - Utilidades Comunes

```typescript
// Configuración común de módulos de test
OTestingUtils.getCommonTestingModuleConfig()

// Creación de formularios mock
OTestingUtils.createMockFormGroup('controlName')

// Respuestas mock de servicios
OTestingUtils.createMockServiceResponse(data)
OTestingUtils.createMockErrorResponse(message)

// Manipulación del DOM
OTestingUtils.getElement(fixture, 'selector')
OTestingUtils.getAllElements(fixture, 'selector')
OTestingUtils.triggerEvent(element, 'click')
```

### Patrones de Testing Recomendados

1. **AAA Pattern**: Arrange, Act, Assert
2. **One assertion per test**: Un solo concepto por test
3. **Descriptive names**: Nombres descriptivos para tests
4. **Mock dependencies**: Simular dependencias externas
5. **Test edge cases**: Casos límite y errores

## 🎯 Métricas de Calidad

### Umbrales de Cobertura (Configurables en karma.conf.js)
```javascript
check: {
  global: {
    statements: 70,
    branches: 70,
    functions: 70,
    lines: 70
  }
}
```

### Reportes Generados
- **HTML**: `coverage/ontimize-web-ngx/index.html`
- **LCOV**: Para integración con SonarQube
- **Cobertura**: Para análisis XML

## 🔧 Comandos Útiles

```bash
# Ejecutar tests para un archivo específico
ng test --include="**/button/**/*.spec.ts"

# Ejecutar tests con debug
ng test --source-map=true

# Generar tests automáticos
npm run generate-tests

# Ver cobertura en tiempo real
npm run test-watch
```

## 📈 Roadmap de Cobertura

| Mes | Componente | Cobertura Objetivo |
|-----|------------|-------------------|
| **Mes 1** | Servicios críticos + Utilidades | 40% |
| **Mes 2** | Componentes input + Botones | 60% |
| **Mes 3** | Componentes complejos | 75% |
| **Mes 4** | Refinamiento + Optimización | 80%+ |

## 🚨 Criterios de Aceptación

Antes de hacer merge de nuevas features:
- [ ] ✅ Tests unitarios para nueva funcionalidad
- [ ] ✅ Cobertura mínima del 70% en archivos modificados
- [ ] ✅ Todos los tests existentes pasan
- [ ] ✅ No hay regresión en cobertura global

## 🎓 Recursos de Aprendizaje

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

> 💡 **Tip**: Ejecuta `npm run generate-tests` para crear automáticamente la estructura básica de tests para componentes y servicios sin tests existentes.