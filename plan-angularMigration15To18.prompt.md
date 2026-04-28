# Plan: Migración Angular 15 → 18 + Standalone — ontimize-web-ngx

## TL;DR
Migración incremental de ontimize-web-ngx (Angular 15.2.9 → 18) combinada con adopción de standalone components. Se usa una estrategia de ramas `migration/16.x.x`, `migration/17.x.x`, `migration/18.x.x` partiendo de la rama `18.x.x` (copia del código actual de `15.x.x`). El flex-layout se resuelve con fork temporal (`@ngbracket/ngx-layout`) en la fase 16, y se sustituye por CSS nativo en la fase 18. Los standalone components se introducen progresivamente a partir de la fase 17, completándose en la 18.

## Datos clave del codebase (reales)
- 58 NgModules, 0 standalone components
- 161 componentes, 237 spec files (Karma + Jasmine)
- 100+ usages de `Injector.get()`, 50+ UntypedForm refs
- 24 archivos SCSS de theming custom
- flex-layout activamente usado (fxLayout, fxFlex, fxLayoutAlign en 30+ templates)
- 2 class-based guards (AuthGuardService, CanActivateFormLayoutChildGuard)
- Dependencias clave: @ngx-translate ~13.0.0, ngx-material-timepicker 12.1.0, angular-resizable-element 3.3.4, ngx-skeleton-loader 7.0.0, moment.js 2.29.2

## Estrategia de Ramas

```
15.x.x (actual, intocable)
  └── 18.x.x (copia de 15.x.x, punto de partida)
       ├── migration/16.x.x (Angular 16)
       │    └── migration/17.x.x (Angular 17)
       │         └── migration/18.x.x (Angular 18 final)
       └── (merge final a 18.x.x cuando esté listo)
```

---

## FASE 1: Angular 15 → 16 — Rama `migration/16.x.x`

### 1.1 Preparación del entorno
- Crear rama `18.x.x` desde `15.x.x`
- Crear rama `migration/16.x.x` desde `18.x.x`
- Actualizar Node.js mínimo a 16.14+ (requerido por Angular 16)
- Actualizar TypeScript a ~5.0

### 1.2 Actualizar dependencias core
- `@angular/core`, `@angular/cli`, `@angular/compiler`, etc. → 16.x
- `@angular/material` + `@angular/cdk` → 16.x
- `zone.js` → ~0.13.x
- `ng-packagr` → 16.x
- `rxjs` → mantener ~7.8.0 (compatible)
- Actualizar `tsconfig.json` y `tsconfig.lib.json` según requiera Angular 16

### 1.3 Resolver `@angular/flex-layout` (BLOQUEANTE)
- **Acción**: Reemplazar `@angular/flex-layout@15.0.0-beta.42` → `@ngbracket/ngx-layout@16.x`
- **Motivo**: flex-layout fue abandonado oficialmente. El fork mantiene compatibilidad temporal
- **Files**: `package.json`, todos los módulos que importan `FlexLayoutModule`
- **No reemplazar a CSS nativo aún** — se pospone a Fase 3 para reducir riesgo

### 1.4 Actualizar third-party dependencies
- `@ngx-translate/core` → verificar v14+ compatible con Angular 16
- `ngx-material-timepicker` → buscar versión compatible Angular 16
- `angular-resizable-element` → buscar versión compatible
- `ngx-skeleton-loader` → actualizar a versión compatible
- `moment.js` → mantener (no hay breaking change)

### 1.5 Ajustes menores de API
- Revisar deprecaciones de Angular 16 (ej. `RouterModule` APIs)
- Required inputs (`input required`) son opcionales, no actuar aún
- `DestroyRef` / `takeUntilDestroyed` disponibles, no adoptar aún

### 1.6 Verificación
- `npm run build` — librería compila sin errores
- `npm test` — suite de 237 specs pasa
- Smoke test manual de componentes clave (form, table, list, grid, app-layout)

---

## FASE 2: Angular 16 → 17 — Rama `migration/17.x.x`

### 2.1 Actualizar dependencias core
- Angular 17.x, Material 17.x, CDK 17.x
- TypeScript → ~5.2+
- `ng-packagr` → 17.x
- `@ngbracket/ngx-layout` → 17.x (si existe) o preparar reemplazo
- `zone.js` → ~0.14.x

### 2.2 Control flow migration (`*ngIf` → `@if`, `*ngFor` → `@for`)
- **Herramienta**: `ng generate @angular/core:control-flow` (schematic automático)
- **Alcance**: 161 componentes con templates
- **Revisión**: Templates que mezclen flex-layout directives con `*ngIf`/`*ngFor` pueden necesitar ajuste manual
- **Prioridad**: Ejecutar schematic primero, revisar diff después

### 2.3 Migrar `Injector.get()` → `inject()` (parcial)
- **Alcance**: 100+ usages en 25+ archivos
- **Estrategia**: Empezar por clases base (`OServiceBaseComponent`, `OComponent`, `OServiceComponent`)
- **Files clave**:
  - `o-service-component.class.ts` (9 usages)
  - `o-table.component.ts` (7 usages)
  - `o-form.component.ts` (4 usages)
  - `o-translate.service.ts` (4 usages)
  - `base-service.class.ts` (3 usages)
- **Patrón**: Mover inyecciones a `inject()` a nivel de campo de clase donde sea posible
- **CUIDADO**: En clases con herencia profunda, `inject()` solo funciona en contexto de inyección (constructor o field initializer). Las clases base que usan `this.injector.get()` en métodos de ciclo de vida necesitan refactoring cuidadoso

### 2.4 Guards funcionales (parcial)
- Migrar `AuthGuardService` (implements CanActivate) → functional guard con `canActivateFn`
- Migrar `CanActivateFormLayoutChildGuard` (implements CanActivateChild) → functional guard
- Migrar `ShareCanActivateChildService` según necesidad
- **Files**:
  - `services/auth-guard.service.ts`
  - `layouts/form-layout/guards/o-form-layout-can-activate-child.guard.ts`
  - `services/share-can-activate-child.service.ts`

### 2.5 Preparar standalone (inicio gradual)
- Marcar como `standalone: true` los **componentes hoja** (sin dependencias internas):
  - Pipes: OTranslatePipe, OCurrencyPipe, etc.
  - Directivas simples: OHiddenDirective, OMatErrorDirective, etc.
  - Componentes hoja: OBreadcrumbComponent, OImageComponent, OButtonComponent
- **Mantener los NgModules wrapper** para backwards compatibility:
  ```
  @NgModule({ imports: [OBreadcrumbComponent], exports: [OBreadcrumbComponent] })
  export class OBreadcrumbModule {}
  ```

### 2.6 Verificación
- `npm run build` — librería compila sin errores
- `npm test` — specs pasan
- Verificar que los NgModules wrapper siguen funcionando para consumidores existentes
- Smoke test de componentes clave

---

## FASE 3: Angular 17 → 18 — Rama `migration/18.x.x`

### 3.1 Actualizar dependencias core
- Angular 18.x, Material 18.x (M3), CDK 18.x
- TypeScript → ~5.4+
- `ng-packagr` → 18.x
- `zone.js` → ~0.14.x (estable)

### 3.2 Material 3 (M3) theming migration (ALTO RIESGO)
- **Alcance**: 24 archivos SCSS de theming custom
- **Changes**: API de mixins/paletas/typography reescrita en M3
- **Files clave**:
  - `shared/material/o-material.theme.scss` — núcleo de theming
  - `shared/material/custom.material.module.ts` — re-exports de Material modules
  - `components/theming/app-global.theme.scss` — tema global
  - 18+ component-specific theme files (`o-table.theme.scss`, `o-form.theme.scss`, etc.)
- **Herramienta**: `ng generate @angular/material:m3-theme` para scaffold inicial
- **Estrategia**: Migrar tema core primero, luego componentes uno a uno. Validar visualmente cada componente

### 3.3 Standalone migration completa
- **Convertir todos los componentes restantes** a `standalone: true`
- **Romper OSharedModule** en imports individuales:
  - Cada componente standalone importa directamente lo que necesita (CommonModule, pipes, directivas, Material modules)
- **Mantener módulos wrapper** para API pública backward-compatible:
  - `OntimizeWebModule` sigue existiendo pero internamente re-exporta standalone components
  - Crear `provideOntimizeWeb()` como alternativa standalone para bootstrap

### 3.4 Typed Forms
- **Alcance**: 50+ UntypedFormGroup/Control refs en 25+ archivos
- **Files clave**:
  - `o-form-data-component.class.ts` — clase base de form data
  - `o-form.component.ts` — formulario principal
  - `o-validators.ts` — validadores custom
  - Todos los input components que usan UntypedFormControl
- **Estrategia**: Inferir tipos de dominio para cada formulario. Empezar por clases base, propagar a derivados

### 3.5 Eliminar flex-layout → CSS nativo
- **Alcance**: Reemplazar `@ngbracket/ngx-layout` por CSS flexbox/grid nativo en 30+ templates
- **Mapping**:
  - `fxLayout="row"` → `display: flex; flex-direction: row;`
  - `fxLayout="column"` → `display: flex; flex-direction: column;`
  - `fxLayoutAlign="space-between center"` → `justify-content: space-between; align-items: center;`
  - `fxFlex` → CSS flex shorthand
  - `fxLayoutGap="8px"` → `gap: 8px;`
  - `fxLayout.lt-md` (responsive) → CSS `@media` queries
- Eliminar dependencia de `@ngbracket/ngx-layout` del package.json

### 3.6 Completar guards funcionales
- Verificar que todos los guards son funcionales
- Limpiar clases de guard obsoletas si quedaron

### 3.7 API pública final
- Actualizar `public-api.ts`:
  - Exportar standalone components directamente
  - Mantener NgModules wrapper como deprecated
  - Exportar `provideOntimizeWeb()` para bootstrap standalone
- Actualizar documentación de la API

### 3.8 Verificación final
- `npm run build` — sin errores
- `npm test` — suite completa pasa
- Verificar bundle size (esperar ~10-15% reducción)
- Smoke test exhaustivo de TODOS los componentes
- Verificar theming visual de todos los componentes
- Verificar que la API pública es consumible tanto con NgModules como con standalone imports

---

## FASE TRANSVERSAL (paralela): Testing Framework

### Consideración (Issue #34)
- **Estado actual**: Karma 6.4.2 + Jasmine 3.6.0 (237 specs)
- **Karma está deprecated desde Angular 16**
- **Recomendación**: Migrar a Jest durante Fase 2 o Fase 3
  - Instalar `jest-preset-angular`, configurar `jest.config.js`
  - Migrar scripts de test en `package.json`
  - Actualizar integración SonarQube (karma-sonarqube → jest-sonar-reporter)
- **Decisión**: Hacer durante Fase 2 para evitar acumular cambios en Fase 3
- **Alternativa**: Postponer a post-migración si la carga es excesiva

---

## Archivos relevantes

### Configuración y build
- `package.json` — dependencias root
- `projects/ontimize-web-ngx/package.json` — peer dependencies de la librería
- `angular.json` — configuración del workspace
- `projects/ontimize-web-ngx/ng-package.json` — configuración ng-packagr
- `tsconfig.json`, `projects/ontimize-web-ngx/tsconfig.lib.json` — TypeScript config
- `projects/ontimize-web-ngx/karma.conf.js` — configuración de tests

### Módulo raíz y API pública
- `projects/ontimize-web-ngx/src/lib/ontimize-web-ngx.module.ts` — root module con `forRoot()`
- `projects/ontimize-web-ngx/src/public-api.ts` — public API surface
- `projects/ontimize-web-ngx/src/lib/config/o-modules.ts` — `ONTIMIZE_MODULES` array
- `projects/ontimize-web-ngx/src/lib/config/o-providers.ts` — providers config

### Clases base (efecto cascada en Injector.get → inject)
- `projects/ontimize-web-ngx/src/lib/components/o-service-component.class.ts` — 9 Injector.get usages
- `projects/ontimize-web-ngx/src/lib/components/o-component.class.ts` — base component
- `projects/ontimize-web-ngx/src/lib/components/o-form-data-component.class.ts` — base form data
- `projects/ontimize-web-ngx/src/lib/components/o-service-base-component.class.ts` — base service component

### Theming
- `projects/ontimize-web-ngx/src/lib/shared/material/o-material.theme.scss` — core theming
- `projects/ontimize-web-ngx/src/lib/shared/material/custom.material.module.ts` — Material module
- `projects/ontimize-web-ngx/src/lib/components/theming/app-global.theme.scss` — global theme
- 18+ component-specific `*.theme.scss` files

### Guards
- `projects/ontimize-web-ngx/src/lib/services/auth-guard.service.ts`
- `projects/ontimize-web-ngx/src/lib/layouts/form-layout/guards/o-form-layout-can-activate-child.guard.ts`

### Shared Module (a romper en Fase 3)
- `projects/ontimize-web-ngx/src/lib/shared/shared.module.ts`

---

## Verificación

1. **Por cada fase**: `npm run build` + `npm test` deben pasar antes de merge
2. **Smoke test manual** de componentes core: o-form, o-table, o-list, o-grid, o-tree, o-app-layout, o-app-sidenav, inputs principales
3. **Verificación visual del theming** tras Fase 3 (M3) — comparar screenshots before/after
4. **Verificación de API pública**: consumir la librería desde un proyecto dummy con NgModules y con standalone bootstrap
5. **Bundle size check**: comparar dist/ tras cada fase (esperar reducción progresiva)
6. **Ejecutar `ng update` schematics** disponibles antes de cada fase para aprovechar migraciones automáticas

---

## Decisiones

- **flex-layout**: Fork temporal (`@ngbracket/ngx-layout`) en Fases 1-2, reemplazo a CSS nativo en Fase 3
- **Standalone adoption**: Gradual — leaf components en Fase 2, completa en Fase 3
- **Backward compatibility**: Mantener NgModules wrapper deprecated en Fase 3 para no romper consumidores actuales
- **Testing framework**: Migrar a Jest durante Fase 2 (Karma deprecated desde Angular 16)
- **Typed Forms**: Postponer a Fase 3 junto con standalone para evitar sobrecarga en Fases 1-2
- **Signals**: No adoptar en esta migración (opcional, para futura iteración)
- **Zoneless**: No adoptar (experimental en v18, no recomendado para librería pública)

---

## Consideraciones adicionales

1. **Soporte 15.x.x**: Se mantendrá la rama `15.x.x` durante un período de transición. El nivel de backport será bajo (solo fixes críticos/seguridad). Publicar guía de migración para consumidores de la librería — la versión 18 será un major bump.

2. **CI/CD pipeline**: Los pipelines se irán adaptando en cada rama `migration/x.x.x` de forma incremental, ajustando versiones de Node, scripts de build/test y configuraciones según la versión de Angular correspondiente.

3. **moment.js**: Aunque no es parte de la migración Angular, moment.js está en modo mantenimiento. Considerar migración a date-fns o luxon como tarea futura (post-migración).
