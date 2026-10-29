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

### 3.2 Material 3 (M3) theming migration ✅ COMPLETADO
- ✅ `o-material.theme.scss` usa sintaxis M3 real (`mat.system-level-colors/typography/elevation/shape/motion/state`, `mat.all-component-themes($m3-theme)`) y emite tokens `--mat-sys-*` (104 usos en 21 ficheros del lib) — mergeado a `migration/18.x.x` (commit `63265bf9`, "merge theming/m3")
- ✅ `projects/ontimize-web-ngx/src/lib/theming/` reemplaza al antiguo `shared/material/`: `ontimize-style.scss` (entry point del tema), `ontimize-base-style.scss` (paletas, `o-mat-light-theme()`, bg-levels), `ontimize-tokens.scss` (mixin `o-apply-tokens`, tokens `--o-*`), `themes/ontimize-blue.scss` y `themes/oxygen.scss`, `typography/*.scss`, `fonts/noto.scss` y `fonts/poppins.scss`, `styles/layout.scss`, `styles/paginator.scss`, `styles/flex-layout.scss`
- Resto M2 deliberado: `mat.m2-define-palette`/`mat.m2-get-color-from-palette` en `ontimize-base-style.scss` se mantiene como helper de compatibilidad para leer paletas M2 que aún declaren los consumidores (documentado en `MIGRATION-STATUS.md`)

### 3.3 Standalone migration completa ✅ COMPLETADO (parcial)
- **Convertir todos los componentes restantes** a `standalone: true`
- **Romper OSharedModule** en imports individuales:
  - Cada componente standalone importa directamente lo que necesita (CommonModule, pipes, directivas, Material modules)
- **Mantener módulos wrapper** para API pública backward-compatible:
  - `OntimizeWebModule` sigue existiendo pero internamente re-exporta standalone components
  - ✅ `provideOntimizeWeb()` implementado en `src/lib/config/o-provide.ts` (commit `754ef7d9`)
    - Exportado en `public-api.ts` como `provideOntimizeWeb` y `ProvideOntimizeWebOptions`
    - Equivalente funcional a `OntimizeWebModule.forRoot()` para `bootstrapApplication()`

### 3.4 Typed Forms ✅ COMPLETADO
- ✅ 0 ocurrencias de `UntypedFormGroup`/`UntypedFormControl` en `projects/ontimize-web-ngx/src/lib` (verificado)

### 3.5 Eliminar flex-layout → CSS nativo ✅ COMPLETADO
- ✅ `@angular/flex-layout` / `@ngbracket/ngx-layout` ya no aparecen en ningún `package.json`; `FlexLayoutModule` con 0 usos
- ✅ Los hits residuales de `fxLayout`/`fxFlex`/`fxLayoutAlign`/`fxLayoutGap` son solo comentarios de mapping en `.scss`/`.ts`, no atributos reales en templates
- ✅ `projects/ontimize-web-ngx/src/lib/theming/styles/flex-layout.scss` contiene las clases utilitarias `o-flex-*`, `o-layout-align-*`, `o-flex-fill`, documentadas en `MIGRATION_GUIDE.md`

### 3.6 Completar guards funcionales ✅ COMPLETADO
- ✅ `AuthGuardService` → functional wrapper `authGuard` (ya existía)
- ✅ `PermissionsGuardService` → functional wrapper `permissionsGuard` (ya existía)
- ✅ `CanActivateFormLayoutChildGuard` → migrado a `inject()` + functional wrapper `canActivateFormLayoutChildGuard` (commit `95164dfa`)

### 3.7 API pública final ✅ COMPLETADO
- ✅ Standalone components ya exportados directamente vía `export *` en los index files
- ✅ NgModules wrapper marcados como `@deprecated` en JSDoc (54 módulos, commit `a801a9be`)
- ✅ `provideOntimizeWeb()` exportado en `public-api.ts`
- ✅ Functional guards exportados automáticamente vía `export *`

### 3.8 Verificación final ✅ COMPLETADO (parcial)
- ✅ `npm run build` — sin errores
- ✅ `npm test` — **2277 SUCCESS, 31 skipped, 0 failures**
- ⏳ Smoke test visual exhaustivo de componentes en playground (pendiente)
- ⏳ Verificar que la API pública es consumible con standalone bootstrap (`provideOntimizeWeb()`)

### 3.8bis Restructurar scss theming por versión de Angular — ⚠️ IMPLEMENTADO Y LUEGO REVERTIDO (decisión vigente: NO versionar)

- Este punto se implementó (`ontimize-style.v18.scss` / `ontimize-style-v15.scss` separados, commits `4a874b0c`/`a86070ed`) y **posteriormente se revirtió explícitamente** durante el cleanup de M3 (commit `fdcb42da`: "elimina ficheros v8/v15/legacy... renombra .v18.scss → .scss")
- **Estado actual del código**: un único `ontimize-style.scss` (sin sufijo de versión) + `ontimize-base-style.scss` + `ontimize-tokens.scss` en `projects/ontimize-web-ngx/src/lib/theming/`. No existen `ontimize-style.v18.scss`, `ontimize-style-v15.scss` ni `SCSS_VERSION_STRUCTURE.md`. `gulpfile.js` copia estos ficheros sin versión a `dist/theming/`, sin lógica de copia versionada
- La densidad, la fuente Noto Sans (`fonts/noto.scss`) y "Material Symbols Outlined" **sí** se implementaron, pero como parte del tema único M3, no de un fork v18 aislado (ver 3.2)
- **Decisión a confirmar con el equipo**: si se quiere reabrir el soporte visual paralelo v15/v18 para consumidores que no puedan migrar de golpe, hay que re-derivar este punto desde cero sobre la base M3 actual (no queda código de la versión anterior reutilizable tal cual). Si la decisión de "tema único" se da por buena, este punto debería marcarse como **descartado** en vez de pendiente

### 3.9 Documentar guía de migración para consumidores ✅ COMPLETADO
- ✅ `MIGRATION_GUIDE.md` existe con pasos detallados de migración de consumidores (deps, flex-layout, theming M3, bootstrap standalone, guards, typed forms, tokens SCSS, troubleshooting, migración de M3 next.1→next.2, desacoplo de inputs sin o-form, features por versión next.5→next.9)
- ✅ Incluye migración NgModule bootstrap → standalone bootstrap con `provideOntimizeWeb()` (sección 4)
- ⏳ Pendiente: publicar la guía junto con release notes de la versión 18 final (acción de release, no de código)

### 3.10 Desacoplamiento: Eliminar dependencias directas de los inputs hacia o-form ✅ COMPLETADO
- ✅ `OFormDataComponent` (clase base de `o-text-input`, `o-integer-input`, etc.) ya no inyecta `OFormComponent` directamente: usa `this.form = inject(O_FORM_CONTEXT, { optional: true })` con el token `O_FORM_CONTEXT` + interfaz `IOFormParent` (`interfaces/o-form-parent.interface.ts`)
- ✅ Cuando `this.form` es `null`, `getFormGroup()` construye su propio `FormGroup` standalone con clave `oattr || '_standalone'` — permite usar los inputs con `ngModel`/`formControl` fuera de `<o-form>`
- ✅ Commit dedicado: `9367e530 feat(inputs): decouple input components from OFormComponent (point 3.10)`
- ✅ Documentado en `MIGRATION_GUIDE.md` sección 13 (equivalencias HTML nativo → componentes Ontimize sin `<o-form>`)
- Resto de `OFormComponent` en `components/input/` limitado a un spec de test (`o-checkbox.component.spec.ts`), no a código de producción

### 3.11 Inputs `row-height` y `dense` sin efecto → density del tema ✅ DOCUMENTADO
- Con Material 3 (MDC) el input `row-height` (`small | medium | large`, definido en `o-service-component.class.ts` y usado por `o-table`/`o-list`/`o-grid`) y el atributo `dense` de `mat-list`/`mat-selection-list` **dejaron de funcionar**: las alturas de fila las controla la propiedad `density` del tema (parámetro `density` del factory `o-mat-light-theme`/`o-mat-dark-theme`, mixin `ontimize-theme-density-extended(<escala>)` por scope, o mixins `mat.*-density()` por componente)
- ✅ Documentado en `MIGRATION_GUIDE.md` (sección 3.5) y en `CHANGELOG.md` (18.0.0-next.9, Breaking Changes)
- ✅ Playground actualizado: eliminados los selectores ROW_HEIGHT de los ejemplos (table basic, list-item-card, list-item-card-image), los atributos `row-height` en ejemplos y code-samples (layout-manager, tree detail) y el atributo `dense` (inputs events); eliminado también el `dense` residual del diálogo de export del framework
- ⏳ Pendiente decidir: deprecar formalmente el input `rowHeight` (`@deprecated` en `o-service-component.class.ts`) o recablearlo a los tokens de density por componente (post-migración)

### FASE 4 (opcional, post-migración)
### 4.1 Crear nuevo theme "Oxygen" basado en diseño de Figma ✅ COMPLETADO
- ✅ `projects/ontimize-web-ngx/src/lib/theming/themes/oxygen.scss` existe: paleta M3 propia (primary `#1464A5`/secondary `#5b93c0`/tertiary `#8ab2d2`, derivada del Figma), con `typography/oxygen.scss` propia y density `-4` por defecto (ver `MIGRATION_GUIDE.md` § 3.1.ter)
- Pendiente solo verificación visual pixel-a-pixel contra el Figma final (no bloqueante)

### 4.2 Considerar migración a Jest (opcional, para post-migración)
- Evaluar esfuerzo de migración de Karma + Jasmine → Jest + `jest-preset-angular`
- Configurar `jest.config.js`, actualizar scripts de test, migrar reporters

### 4.3 Añadir Luxon como nuevo default de fechas; deprecar (sin eliminar) moment.js — ✅ COMPLETADO (16 julio 2026)

Decisión: Luxon pasa a ser el motor de fechas **por defecto** del framework. `MomentService`, `OMomentPipe` y `OntimizeMomentDateAdapter` **no se han tocado ni eliminado** — quedan marcados `@deprecated` y siguen funcionando exactamente igual (moment.js sigue siendo dependencia real del paquete), para quien quiera seguir usándolos explícitamente. `date-range-legacy` sí se elimina (componente ya deprecado, sin motivo para conservarlo). Plan detallado en `C:\Users\patricia.martinez\.claude\plans\snappy-yawning-wall.md`.

**Fase A — Adapter y formatos, nuevos (Luxon) + intactos (moment, deprecados)** — ✅ COMPLETADO
- [x] `@angular/material-luxon-adapter`, `luxon`, `@types/luxon` añadidos a `package.json` (raíz y lib) e instalados
- [x] Crear `OntimizeLuxonDateAdapter` (`shared/material/date/ontimize-luxon-date-adapter.ts`, extiende `LuxonDateAdapter` de `@angular/material-luxon-adapter`)
- [x] Deprecar `OntimizeMomentDateAdapter` (JSDoc `@deprecated`, sin cambios de lógica)
- [x] Crear `mat-luxon-date-formats.factory.ts` (`OntimizeMatLuxonDateFormats`/`luxonDateFormatFactory`, formatos `'D'`/`'DD'`)
- [x] Deprecar `mat-date-formats.factory.ts` (moment, `'L'`/`'LL'`, JSDoc `@deprecated`)
- [x] Crear `LuxonService` (`services/luxon.service.ts`, misma firma pública que `MomentService`)
- [x] Deprecar `MomentService` (JSDoc `@deprecated`, sin cambios de lógica)
- [x] Crear `OLuxonPipe` (`pipes/o-luxon.pipe.ts`, pipe `oLuxon`)
- [x] Deprecar `OMomentPipe` (JSDoc `@deprecated`, sin cambios de lógica)
- [x] Reescribir `Util.parseByValueType` (`util/util.ts`) a Luxon, mismo contrato de entrada/salida
- [x] `types/date-custom-class.type.ts`: `DateCustomClassFunction` con parámetro `any` (compatible con `Moment` y `DateTime` a la vez, no rompe consumidores existentes)
- [x] (No estaba en el plan original) `o-translate.service.ts` sincronizaba el locale de `MomentService` en cada cambio de idioma (`propagateLang` → `momentService.load(lang)`); se añadió el mismo cableado para `LuxonService.load(lang)`, si no el locale de los componentes Luxon nunca se habría actualizado con el idioma activo

**Fase B — Componentes de producción migran su única implementación a Luxon** — ✅ COMPLETADO
- [x] `o-date-input` — provee `OntimizeLuxonDateAdapter`/`luxonDateFormatFactory` localmente; formato por defecto `'D'`
- [x] `o-daterange-input` (actual, no el legacy) — validadores de rango con `.toMillis()`
- [x] `o-hour-input` y `o-time-input`
- [x] `o-table-cell-editor-date` y `o-table-cell-editor-time` (de paso, corregido que éste último no proveía el adapter Ontimize — usaba `MomentDateAdapter` base en vez de `OntimizeMomentDateAdapter`)
- [x] `o-table-filter-by-column-data-dialog`
- [x] `o-table.component.ts` (`getColumnDataByAttr`, agrupación año/mes)
- [x] Renderers/combos internos (`o-table-cell-renderer-date/time`, `o-combo-renderer-date`, `o-list-picker-renderer-date`) pasan de `OMomentPipe` a `OLuxonPipe`; `o-testing-utils.ts` provee ahora también `OLuxonPipe` para los specs que instancian estos renderers
- [x] Playground: demo de `o-date-input` (`main/inputs/02.date`) ampliada con un ejemplo "Opting into moment.js explicitly" (datepicker nativo de Material + `OntimizeMomentDateAdapter`/`dateFormatFactory`/`OMomentPipe`), documentando en vivo la vía deprecada. `o-daterange-input`/`o-date-input` no exponen forma de sustituir su propio `DateAdapter` desde fuera (un componente hijo que redeclara un token en sus `providers` no puede ser sobreescrito por un ancestro), así que el demo del adapter explícito usa un datepicker nativo en vez de los wrappers — ver sección 20.5 de `MIGRATION_GUIDE.md`
- [x] (No estaba en el plan original) Los demos existentes de `02.date`/`21.daterange` tenían dos bugs reales que se habrían manifestado al ejecutar la playground: formatos en tokens de moment (`format="LL"`, `format="DD/MM/YYYY"`) que con el adapter Luxon activo significan otra cosa, y un callback `[date-class]` que llamaba a `m.date()` (API de moment) — con Luxon como default eso lanza en tiempo de ejecución porque `DateTime` no tiene ese método. Ambos corregidos (tokens traducidos a Luxon, callback pasado a `dt.day`)

**Fase C — Eliminación de `date-range-legacy`** — ✅ COMPLETADO
- [x] Borrado `components/input/date-range-legacy/` completo (componentes, directiva, módulo, specs) y sus exports (`components/input/index.ts`, `config/o-modules.ts`)
- [x] Playground: borrado demo `21.daterange/date-range-legacy/` y su registro en `inputs.module.ts`/`inputs.routes.ts`/`inputs.component.html`/`inputs-home.component.html`, y las claves i18n `INPUT.BUTTON.DATERANGELEGACY`/`INPUTS.DATERANGELEGACY*`

**Fase D — Dependencias y registro global** — ✅ COMPLETADO
- [x] `custom.material.module.ts`: `MatLuxonDateModule`/`OntimizeLuxonDateAdapter` registrados como default (sustituye a `MatMomentDateModule` en el wiring por defecto; el de moment sigue disponible para quien lo provea a mano)
- [~] Verificación de tree-shaking de moment/`@angular/material-moment-adapter` pendiente de un build+bundle-analyzer real de una app consumidora sin símbolos deprecados (no bloqueante — ambas dependencias siguen declaradas, así que en el peor caso quedan en el bundle de quien no haga tree-shaking, sin romper nada)

**Fase E — Documentación** — ✅ COMPLETADO
- [x] `CHANGELOG.md` (`18.0.0-next.10`): Features (Luxon default) + Deprecations (Moment*) + Breaking Changes (`date-range-legacy` eliminado) — `DateCustomClassFunction` no es breaking change tras la rectificación
- [x] `MIGRATION_GUIDE.md` sección 20: tabla de equivalencias de formato moment→luxon, cómo seguir en moment explícitamente (con ejemplo de datepicker nativo), nota sobre `[date-class]`, qué hacer si se usaba `o-daterange-legacy-input`, nota sobre `o-calendar`; checklist de migración (sección 10) actualizado
- [x] Auditoría de addons (`ontimize-web-ngx-map/-charts/-filemanager/-report/-extra-components/-gallery/-quickstart`) ya hecha: solo `-extra-components` (`o-calendar`) consume `Util.parseByValueType` del framework — el input `value-format` (default `'L'` de moment) se corrigió a `'D'` (Luxon) al comprobar el contrato en la práctica; `-charts` usa moment en solitario sin tocar el framework, no afectado

**Verificación de tests**: `npm test` da ~700 fallos preexistentes no relacionados (mismo número con o sin los cambios de esta tarea, confirmado comparando la lista de specs fallidos antes/después vía `git stash`; parece incompatibilidad de Chrome 150 con la configuración de Karma existente, no algo introducido aquí). Los cambios de esta tarea no añaden ningún fallo nuevo y arreglan 3 (los specs de `date-range-legacy`, ahora eliminados). Build/pack/install en la playground pendiente de ejecución manual por el usuario.




---

## FASE TRANSVERSAL (paralela): Testing Framework

### Consideración (Issue #34) — ⏳ NO INICIADO (verificado)
- **Estado actual real**: Karma 6.4.2 sigue en `package.json` y `projects/ontimize-web-ngx/karma.conf.js`/`config/karma.conf.js` siguen presentes — la migración a Jest **no se ha hecho**, pese a que el plan la agendaba para la Fase 2
- **Karma está deprecated desde Angular 16**
- Los 2277 tests en verde (ver 3.8) corren sobre Karma + Jasmine, no sobre Jest
- **Decisión pendiente**: dado que ya se ha llegado a Angular 18 sin hacer este cambio, decidir si se aborda ahora (antes del release 18 final) o se mueve definitivamente a la Fase 4 post-migración (ver 4.2, que ya la lista como opcional)

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
- **Testing framework**: Se decidió migrar a Jest durante Fase 2, pero no se hizo — a fecha de hoy (Fase 3 completa) el proyecto sigue en Karma + Jasmine (ver FASE TRANSVERSAL)
- **Typed Forms**: Postponer a Fase 3 junto con standalone para evitar sobrecarga en Fases 1-2
- **Signals**: No adoptar en esta migración (opcional, para futura iteración)
- **Zoneless**: No adoptar (experimental en v18, no recomendado para librería pública)

---

## Consideraciones adicionales

1. **Soporte 15.x.x**: Se mantendrá la rama `15.x.x` durante un período de transición. El nivel de backport será bajo (solo fixes críticos/seguridad). Publicar guía de migración para consumidores de la librería — la versión 18 será un major bump.

2. **CI/CD pipeline**: Los pipelines se irán adaptando en cada rama `migration/x.x.x` de forma incremental, ajustando versiones de Node, scripts de build/test y configuraciones según la versión de Angular correspondiente.

3. **moment.js**: Aunque no es parte de la migración Angular, moment.js está en modo mantenimiento. Considerar migración a date-fns o luxon como tarea futura (post-migración).
