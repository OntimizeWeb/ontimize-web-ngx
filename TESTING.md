# 🧪 Guía de Testing para Ontimize Web NGX

## 📊 Estado Actual de Cobertura

**Cobertura actual: ~70%** (151 archivos de test implementados)
- **158 componentes** (.component.ts)
- **59 servicios** (.service.ts) 
- **151 archivos de test** (.spec.ts)
- **Última actualización**: Diciembre 2025

## 🎯 Objetivos de Cobertura

| Componente | Meta Mínima | Meta Ideal |
|------------|-------------|------------|
| **Servicios críticos** | 80% | 90% |
| **Componentes principales** | 70% | 85% |
| **Utilidades y helpers** | 90% | 95% |
| **Cobertura general** | 70% | 80% |

## 🚀 Plan de Incremento de Cobertura

### Fase 1: Fundamentos ✅ COMPLETADA
- [x] ✅ Configuración mejorada de Karma/Jasmine
- [x] ✅ Utilidades de testing comunes (`OTestingUtils`)
- [x] ✅ Scripts de generación automática de tests
- [x] ✅ Tests para servicios críticos (Auth, Dialog, etc.)

### Fase 2: Componentes Base ✅ COMPLETADA
- [x] ✅ Tests para componentes de input (text, date, combo, etc.)
- [x] ✅ Tests para componentes de botones y navegación
- [x] ✅ Tests para componentes de layout

### Fase 3: Componentes Complejos 🔄 EN PROGRESO
- [x] ✅ Tests para tabla (o-table) - Parcial
- [x] ✅ Tests para formularios (o-form) - Parcial
- [x] ✅ Tests para lista (o-list) - Parcial
- [x] ✅ Tests para tree (o-tree) - Parcial

### Fase 4: Servicios y Utilidades 🔄 EN PROGRESO
- [x] ✅ Tests para servicios principales
- [x] ✅ Tests para pipes y directivas - Parcial
- [ ] 📝 Tests para utilidades especializadas (complementar)

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

| Período | Estado | Cobertura Alcanzada |
|---------|--------|-------------------|
| **Q1 2025** | ✅ Completado | 70% |
| **Q2 2025** | 🔄 En progreso | 75% |
| **Q3 2025** | 📋 Planeado | 80% |
| **Q4 2025** | 📋 Planeado | 85%+ |

## 🚨 Criterios de Aceptación

Antes de hacer merge de nuevas features:
- [ ] ✅ Tests unitarios para nueva funcionalidad
- [ ] ✅ Cobertura mínima del 70% en archivos modificados
- [ ] ✅ Todos los tests existentes pasan
- [ ] ✅ No hay regresión en cobertura global

## 📌 Próximas Acciones (Q2 2025)

### Enfoque en Cobertura
- [ ] Aumentar cobertura de componentes complejos (table, form, list)
- [ ] Completar cobertura de pipes y directivas especializadas
- [ ] Mejorar tests de servicios HTTP con casos edge
- [ ] Añadir tests de integración para workflows complejos

### Mejoras de Infraestructura
- [ ] Actualizar utilidades de testing (`OTestingUtils`)
- [ ] Implementar helpers para testing de componentes Material
- [ ] Crear templates de tests para componentes nuevos
- [ ] Documentar patrones de testing por tipo de componente

### Automatización
- [ ] Integración continua mejorada (CI/CD)
- [ ] Reportes de cobertura automáticos en PRs
- [ ] Alertas de regresión en cobertura
- [ ] Análisis de código con SonarQube integrado

## 🎓 Recursos de Aprendizaje

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

> 💡 **Tip**: Ejecuta `npm run generate-tests` para crear automáticamente la estructura básica de tests para componentes y servicios sin tests existentes.