# Migración Angular 15 → 18 — Estado actual

> Última actualización: 20 abril 2026 (documentación density en MIGRATION_GUIDE.md)

## Repositorios y ramas

| Repo | Ruta local | Rama | Estado |
|------|-----------|------|--------|
| **ontimize-web-ngx** (framework) | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx` | `migration/18.x.x` | ✅ Migrado |
| **ontimize-web-ngx-extra-components** | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-extra-components` | `migration/18.x.x` | ✅ Migrado |
| **ontimize-web-ngx-gallery** | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-gallery` | `migration/18.x.x` | ✅ Migrado |
| **ontimize-web-ngx-playground** (demo) | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-playground` | `migration/18.x.x` | ✅ Migrado (PASO 6 pendiente) |
| **ontimize-web-ngx-filemanager** | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-filemanager` | `15.x.x` | ⏳ Pendiente |
| **ontimize-web-ngx-report** | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-report` | `15.x.x` | ⏳ Pendiente |
| **ontimize-web-ngx-charts** | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-charts` | `15.x.x` | ⏳ Pendiente |
| **ontimize-web-ngx-map** | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-map` | `15.x.x` | ⏳ Pendiente |
| **ontimize-web-ngx-quickstart** (demo) | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-quickstart` | `15.x.x` | ⏳ Pendiente |

## Versiones actuales en migration/18.x.x

- **Angular**: 18.2.14
- **TypeScript**: 5.5.4
- **zone.js**: 0.14.10
- **ng-packagr**: ^18.2.0
- **Node.js**: v20.18.3 (usar `nvs use 20.18.3`, no nvm)
- **Tests del framework**: 2277 specs, 0 fallos ✅ (13 abril 2026)

---

## ESTADO GLOBAL

| Sub-paso | Estado | Commits |
|----------|--------|---------|
| Fase 1: Angular 15→16 | ✅ Completado | `73f94ceb` |
| Fase 2: Angular 16→17 | ✅ Completado | `aea34eec` → `f137d53f` |
| Fase 3.1: Angular 17→18 deps | ✅ Completado | `c9a5c0ea` |
| Sub-paso 3.3: Standalone components | ✅ Completado | `f7a67058` → `ca5ae142` |
| Migración SCSS M2 | ✅ Completado | `10492030` |
| Sub-paso 3.4: Typed Forms | ✅ Completado | `e5c002bd` |
| Sub-paso 3.5: Eliminación flex-layout | ✅ Completado | `028637cc`, `0650715e`, `6ebb3a74` |
| Fixes CSS: clases `o-flex-*` y playground layout | ✅ Completado | `2bdfae9c`, `21bcdea` (playground) |
| `provideOntimizeWeb()` — bootstrap standalone | ✅ Completado | `754ef7d9` |
| Sub-paso 3.6: Guards funcionales | ✅ Completado | `95164dfa` |
| Sub-paso 3.7: NgModules `@deprecated` | ✅ Completado | `a801a9be` |
| Sub-paso 3.8: Tests | ✅ Completado | — (2277 SUCCESS, 0 fallos) |
| Playground migrado | ✅ Completado | `3e47f22` (repo playground) |
| Playground: control flow (`@if`/`@for`) | ✅ Completado | `8686e0b` (repo playground) |
| `bootstrapApplication()` — ontimizePostBootstrap + OntimizeMatIconRegistry | ✅ Completado | `e7e1f664` |
| Sub-paso 3.8: SCSS versioning (v15/v18) | ✅ Completado | `4a874b0c`, `a86070ed` |
| **Material Symbols Outlined (icons v18)** | ✅ **Completado** | `017a2a75` |
| **v18 theme: remove button overrides** | ✅ **Completado** | `017a2a75` |
| **Playground PASO 6: Standalone bootstrap** | ✅ **Completado** | `232a4c0` (repo playground) |
| **Sub-paso 3.9: MIGRATION_GUIDE.md** | ✅ **Completado** | `e2b6ad4a` |
| **Sub-paso 3.2: Material M3** | ⏳ **Pospuesto** (post-migración) | — |

---

## FASES COMPLETADAS

### Fase 1: Angular 15 → 16 — commit `73f94ceb`

- Actualización de todas las dependencias core a Angular 16

### Fase 2: Angular 16 → 17 — commits `aea34eec` → `f137d53f`

| Commit | Descripción |
|--------|-------------|
| `aea34eec` | Deps update a Angular 17 |
| `427af21b` | Control flow syntax (`@if`, `@for`, `@switch`) |
| `f01e38c8` | Migración `Injector.get()` → `inject()` en servicios y leaf components |
| `bbf4e06c` | Guards funcionales (`canActivateFn`, `canActivateChildFn`) |
| `fbc8ce7d` | Primer batch de pipes y directives standalone |
| `f137d53f` | Fix test specs para inject() y standalone |

### Fase 3.1: Angular 17 → 18 deps — commit `c9a5c0ea`

- Actualización de todas las dependencias a Angular 18.2

### Sub-paso 3.3: Standalone components — ✅ COMPLETADO (7 abril 2026)

**Todos** los componentes, directivas y pipes del framework son ahora `standalone: true`.

#### Pipes y directives — commit `26f04af4`
- **8 pipes** + **9 directives** convertidos a standalone
- `OSharedModule`, `OTranslateModule`, `o-directives.ts` actualizados

#### Componentes standalone — batches (commits `f7a67058` → `ca5ae142`)

| Commit | Batch | Componentes |
|--------|-------|-------------|
| `f7a67058` | Containers | `ORowComponent`, `OColumnComponent`, `ORowCollapsibleComponent`, `OColumnCollapsibleComponent` |
| `d62989a0` | Buttons/toggles | `OButtonComponent`, `OCheckboxComponent`, `OSlideToggleComponent`, `OSliderComponent` |
| `356419fb` | Text inputs | `OTextInputComponent`, `OPasswordInputComponent`, `OTextareaInputComponent`, `OSearchInputComponent` |
| `4eb5d8a0` | Numeric/date inputs | `OEmailInputComponent`, `ONIFInputComponent`, `OIntegerInputComponent`, `ORealInputComponent`, `OPercentInputComponent`, `OCurrencyInputComponent`, `ODateInputComponent`, `OPhoneInputComponent` |
| varios | Context/bar menus | Todos los componentes de menú |
| varios | App header/sidenav | Todos los subcomponentes |
| varios | Table renderers/editors | Todos los cell renderers y editors |
| varios | Table extensions | Header, footer, dialogs, row, sort, skeleton, contextmenu |
| `cd208fd5` | Table columns | `OTableColumnComponent`, `OTableColumnCalculatedComponent` |
| `26139cd2` | Dual-list, filter-builder | `ODualListSelectorComponent`, `OFilterBuilderComponent` |
| `61c5bf62` | Inputs batch 20 | `OComboComponent`, `OListPickerComponent`, `OTimeInputComponent`, `OHtmlInputComponent`, + módulos |
| `84575843` | Cell editors | Todos los table cell editors |
| `0fe465ef` | List, Grid, DateRangeLegacy | `OListComponent`, `OGridComponent`, `ODaterangeInputComponent` (legacy) |
| `4a07e52c` | Tree, Form, Snackbar | `OTreeComponent`, `OFormComponent`, `OFormToolbarComponent`, `OSnackBarComponent` |
| `8cf3f445` | Shared components | `ODialogComponent`, `ODialogInternalComponent`, `Error403Component`, `OLoadFilterDialogComponent`, `OStoreFilterDialogComponent`, `OErrorComponent`, `OValidatorComponent` |
| `f4c30a9b` | Layouts | `OAppLayoutComponent`, `OCardMenuLayoutComponent`, todos los `OFormLayout*` |
| `ca5ae142` | CKEditor + OTable | `CKEditorComponent`, `OTableComponent` |

> **Nota**: `OTableColumnComponent` se excluye del array `imports[]` de `OTableComponent` para evitar dependencias circulares estáticas (se resuelve vía `forwardRef`).

### Sub-paso 3.4: Typed Forms — ✅ COMPLETADO (7 abril 2026) — commit `e5c002bd`

- Eliminados todos los `UntypedFormGroup`/`UntypedFormControl` → `FormGroup`/`FormControl`
- Parámetros de validadores → `AbstractControl`
- 30 archivos modificados (source + specs), 2235 tests pasan

### Migración SCSS M2 — ✅ COMPLETADO — commit `10492030`

- **32 archivos SCSS modificados** con prefijo `m2-` para Angular Material 18:
  - `mat.define-palette` → `mat.m2-define-palette`
  - `mat.define-typography-level` → `mat.m2-define-typography-level`
  - `mat.get-color-from-palette` → `mat.m2-get-color-from-palette`
  - `mat.font-size/weight/family` → `mat.m2-font-size/weight/family`
  - `mat.define-light-theme/dark-theme` → `mat.m2-define-light-theme/dark-theme`
  - `mat.$red-palette` → `mat.$m2-red-palette` (y `amber`, `light-blue`)
- APIs root-level **sin cambio**: `mat.core()`, `mat.all-component-themes()`, density mixins
- `ng-package.json`: añadido `assets` para incluir SCSS en el paquete npm

### Sub-paso 3.5: Eliminación de flex-layout — ✅ COMPLETADO (8 abril 2026)

**Commits**: `028637cc` → `0650715e` → `6ebb3a74`

- Creado `flex-layout.scss` con clases CSS utilitarias (`o-flex-row`, `o-flex-fill`, `o-layout-align-*`, etc.)
- Eliminados todos los atributos `fxLayout`, `fxFlex`, `fxLayoutAlign`, `fxLayoutGap` de ~90 templates HTML del framework
- `MediaObserver` (`@ngbracket/ngx-layout`) → `BreakpointObserver` (`@angular/cdk/layout`) en 4 componentes:
  - `o-app-sidenav`, `o-date-input`, `o-daterange-input`, `o-grid`
- Eliminado `@ngbracket/ngx-layout` de `package.json` y peer deps de la librería
- Bindings dinámicos (`[fxLayout]`, `[fxLayoutAlign]`, `[fxLayoutGap]`) → `[ngClass]`/`[ngStyle]`/`[style.gap]`
- `OContainerComponent`: getter `layoutAlignStyles` para alineación dinámica de containers

**Fixes post-flex-layout** (imports transitivos que desaparecieron al quitar FlexLayoutModule):
- `NgClass` añadido explícitamente a: `o-card-menu-item`, `o-form`, `o-radio`, `o-table-visible-columns-dialog`, `o-table-header-column-filter-icon`
- `OContextMenuDirective` añadido a `o-combo` y `o-list-picker`
- `MatTooltipModule` añadido a `o-time-input`
- `imports[]` completado en `o-table-cell-editor-real` (estaba vacío)
- `FormsModule` + `IsEmptyValuePipe` añadidos a `o-table-filter-by-column-data-dialog`
- `OHourTimepickerDirective` añadido a `o-table-cell-editor-time`
- Comas sobrantes eliminadas en `shared.module.ts` y `o-table.component.ts`

### Fixes de runtime en playground — ✅ COMPLETADO (9-10 abril 2026)

Serie de errores en runtime descubiertos al arrancar la playground tras la migración. Todos resueltos con commits en `migration/18.x.x`.

#### Patrón TDZ (Temporal Dead Zone) — imports circulares en fesm2022

Los bundles fesm2022 de Angular 18 son más estrictos con `const` TDZ. Círculos `A→B→A` en imports estáticos causan `Cannot access 'X' before initialization`.

| Error | Causa | Fix |
|-------|-------|-----|
| `Cannot access 'OBaseTableCellEditor' before initialization` | `o-base-table-cell-editor.class` ↔ `o-table-column.component` | `O_TABLE_COLUMN_TOKEN = new InjectionToken(...)` + `injector.get(token, null)` en constructor base; `OTableColumnComponent` provee el token con `useExisting: forwardRef(...)` |
| `Cannot access 'O_TABLE_CELL_RENDERERS_INPUTS' before initialization` | Mismo ciclo | Extraído a `cell-renderer-inputs.ts` sin imports de clases |
| `Cannot access 'OBaseTableCellRenderer' before initialization` | Mismo ciclo en renderer | Renderer base usa el mismo `O_TABLE_COLUMN_TOKEN` |
| `Cannot access 'OTreeComponent' before initialization` | `o-tree.component` ↔ `tree-node.component` | `O_TREE_NODE_TOKEN` + `import type` |

#### NullInjectorError — pipes y DI en standalone

Los field initializers `inject(Pipe)` en clases base se ejecutan para todas las subclases. Cada subclase standalone necesita proveer los tokens de los pipes de la cadena de herencia.

| Componente | Fix |
|-----------|-----|
| `OTableCellRendererRealComponent` | `providers: [ORealPipe, { provide: OIntegerPipe, useExisting: ORealPipe }]` |
| `OTableCellRendererCurrencyComponent` | `providers: [OCurrencyPipe, { provide: ORealPipe, ... }, { provide: OIntegerPipe, ... }]` |
| `OTableCellRendererPercentageComponent` | ídem patrón currency |
| `ORealInputComponent`, `OPercentInputComponent`, `OCurrencyInputComponent` | mismo patrón |
| Combo renderers (real/currency/percentage) | mismo patrón |
| List-picker renderers (real/currency/percentage) | mismo patrón |

#### NullInjectorError — O_TABLE_COLUMN_TOKEN en columna calculada

`OTableColumnCalculatedComponent` extiende `OTableColumnComponent` pero no incluía `O_TABLE_COLUMN_TOKEN` en sus `providers`. Añadido `{ provide: O_TABLE_COLUMN_TOKEN, useExisting: forwardRef(() => OTableColumnCalculatedComponent) }`.

También: `injector.get(O_TABLE_COLUMN_TOKEN)` → `injector.get(O_TABLE_COLUMN_TOKEN, null)` en ambas clases base (editor y renderer) para tolerar uso fuera de `o-table-column`.

#### Otros errores runtime

| Error | Causa | Fix |
|-------|-------|-----|
| `TypeError: Cannot set properties of undefined (setting 'type')` | `@Optional()` no funciona con `@Inject(TOKEN)` en constructor | Usar `injector.get(token, null)` en constructor en lugar de parámetro con `@Inject` |
| `NG0303: Can't bind to 'ngTemplateOutlet'` | `NgTemplateOutlet` faltaba en imports de `OComboComponent` y `OListPickerDialogComponent` | Añadido a `imports[]` |
| `TypeError: Cannot read properties of undefined (reading 'isSameOrBefore')` | `getValueAsMoment()` retorna `undefined` para controles vacíos | Guards `Util.isDefined()` en los 4 validadores de `ODateRangeInputComponent` |
| Form field height 4px | `height: 24px` en `.mat-mdc-form-field.icon-field` incompatible con MDC | Eliminada la regla de `height` en `input.scss` |
| `Error: A valid data source must be provided` en MatTree | `setDatasource()` llamado en `ngAfterViewInit` pero MatTree valida en `ngAfterContentChecked` | Llamar también `setDatasource()` en `ngOnInit` de `OTreeComponent` |

#### O-table virtual scroll — tabla no visible con `virtual-scroll="yes"`

Múltiples problemas de timing y CSS:

| Problema | Causa | Fix |
|---------|-------|-----|
| Contenido en DOM pero invisible | `scrollStrategy.dataLength` nunca se asignaba → `updateContent()` siempre salía por `dataLength === 0` | Asignar `scrollStrategy.dataLength = resultsLength` en `executeDataProcessing` antes de emitir datos |
| Viewport sin tamaño medido | `updateContent()` usaba `viewport.getViewportSize()` = 0 antes de medir | Llamar `viewport.checkViewportSize()` en `initViewPort()` y añadir guard en `updateContent()` cuando `viewportSize === 0` |
| `.o-table-body` sin ancho | `.o-table-container` tiene `align-items: flex-start` (migración de `fxLayoutAlign="start stretch"` perdió el "stretch") | Añadir `width: 100%` a `.o-table-body` en `o-table.component.scss` |

### Fix CSS clases `o-flex-*` — ✅ COMPLETADO (13 abril 2026) — commit `2bdfae9c`

Problemas detectados en la playground tras la migración de flex-layout:

| Problema | Causa | Fix |
|---------|-------|-----|
| `o-layout-align-*` no alineaba el contenido | Faltaba `display: flex` — `justify-content`/`align-items` no tienen efecto sin él | Añadido `display: flex` a las 15 clases `o-layout-align-*` en `flex-layout.scss` |
| `o-flex-fill` no llenaba el contenedor | Estaba definida como `flex: 1 1 auto` (propiedad de hijo flex), no como `fxFlexFill` original | Redefinida como `width: 100%; height: 100%; min-width: 100%; min-height: 100%` |

### Fix playground layout — ✅ COMPLETADO (13 abril 2026) — commit `21bcdea` (repo playground)

| Problema | Causa | Fix |
|---------|-------|-----|
| `.left-border` con `max-width: calc(100% - 300px)` no ocupaba el ancho disponible | Inline styles incorrectos añadidos durante la migración flex-layout | Reemplazados con clase `o-flex` en 11 archivos HTML |
| Menú inputs no se renderizan bien | `<a>` con dos atributos `class` separados — el browser solo aplica el último | Fusionados en `class="menu-item o-flex"` (24 elementos en `inputs.component.html`) |

### `provideOntimizeWeb()` — ✅ COMPLETADO (13 abril 2026) — commit `754ef7d9`

Alternativa standalone a `OntimizeWebModule.forRoot()` para usar con `bootstrapApplication()`.

**Archivo**: `projects/ontimize-web-ngx/src/lib/config/o-provide.ts`

```typescript
export function provideOntimizeWeb(config: Config, options?: ProvideOntimizeWebOptions): EnvironmentProviders
```

Incluye: `provideHttpClient(withInterceptorsFromDi())`, `provideAnimations()`, `TranslateModule.forRoot(...)`, `NgxMaterialTimepickerModule`, `APP_CONFIG`, `ONTIMIZE_PROVIDERS`, permissions providers, `APP_INITIALIZER`.

Exportado en `public-api.ts` como `provideOntimizeWeb` y `ProvideOntimizeWebOptions`.

**Uso**:
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideOntimizeWeb(CONFIG),
    provideRouter(routes),
  ]
});
```

### Sub-paso 3.6: Guards funcionales — ✅ COMPLETADO (13 abril 2026) — commit `95164dfa`

| Guard | Estado anterior | Estado actual |
|-------|----------------|---------------|
| `AuthGuardService` | clase + `authGuard` fn (ya existía) | ✅ sin cambios |
| `PermissionsGuardService` | clase + `permissionsGuard` fn (ya existía) | ✅ sin cambios |
| `CanActivateFormLayoutChildGuard` | constructor con `Injector` + `Injector.get()` | ✅ Migrado a `inject()` con `{ optional: true }` + nuevo `canActivateFormLayoutChildGuard` fn wrapper |

### Sub-paso 3.7: API pública final — ✅ COMPLETADO (13 abril 2026) — commit `a801a9be`

- **54 NgModules wrapper** marcados con `/** @deprecated Use the standalone component directly. */`
- Excluidos de la deprecación: `OntimizeWebModule`, `OTranslateModule` (tiene `forRoot()`), `OSharedModule`, `OPermissionsModule`, `OFormLayoutManagerModule`, `CustomMaterialModule`
- Los componentes standalone ya se exportaban directamente vía `export *` en los index files
- Functional guards (`authGuard`, `permissionsGuard`, `canActivateFormLayoutChildGuard`) exportados automáticamente

### Sub-paso 3.8: Tests — ✅ COMPLETADO (13 abril 2026)

```
Chrome 146: Executed 2277 of 2277 (skipped 31) SUCCESS — Total time: ~70s
```

### bootstrapApplication() — ontimizePostBootstrap + OntimizeMatIconRegistry — ✅ COMPLETADO (14 abril 2026) — commit `e7e1f664`

- `ontimizePostBootstrap` acepta `NgModuleRef<any> | ApplicationRef` para ser usable como `.then()` en `bootstrapApplication()`
- `provideOntimizeWeb()` registra `OntimizeMatIconRegistry` explícitamente (no tiene `providedIn:'root'`, solo estaba en `CustomMaterialModule`)
- `main.ts` de la playground limpiado: eliminados duplicados de `provideAnimations`, `provideHttpClient`, `APP_CONFIG` y `...ONTIMIZE_PROVIDERS` (todos ya incluidos en `provideOntimizeWeb()`)

### Sub-paso 3.8: SCSS versioning (v15/v18) — ✅ COMPLETADO (15 abril 2026) — commits `4a874b0c`, `a86070ed`

Arquitectura SCSS versionada con base compartida + estilos específicos por versión:

| Fichero | Descripción |
|---------|-------------|
| `ontimize-base-style.scss` | Base compartida: paletas, `o-mat-light-theme()`, layout, bg-levels, o-material-theme |
| `ontimize-style.v15.scss` | v15: Poppins, density, botones custom, sidenav con primary |
| `ontimize-style.v18.scss` | v18: Noto Sans, sin density, sin overrides de botones, sidenav neutro |
| `fonts/noto.scss` | `@font-face` Noto Sans + `--mdc-typography-font-family` CSS custom property |
| `themes/ontimize-blue.v15.scss` | Tema azul para Angular 15 (usa `ontimize-style.v15`) |
| `themes/ontimize-blue.v18.scss` | Tema azul para Angular 18 (usa `ontimize-style.v18`) |

`gulpfile.js` actualizado para copiar `.v15`, `.v18` y `ontimize-base-style.scss` a `dist/theming/`.

**Uso en Angular 18:**
```scss
@use 'ontimize-web-ngx/theming/ontimize-style.v18' as ontimize-style;
// + importar fonts/noto.scss en styles.scss
// + añadir Material Symbols Outlined en index.html
```

**Uso en Angular 15:**
```scss
@use 'ontimize-web-ngx/theming/ontimize-style.v15' as ontimize-style;
// continúa usando Poppins y estilos de botón v15
```

### Material Symbols Outlined — ✅ COMPLETADO (15 abril 2026) — commit `017a2a75`

Migración de `material-icons` (ligature font) a `material-symbols-outlined` (variable font) en todos los templates del framework:

- **57 ficheros modificados**: todos los `class="material-icons"` → eliminados (mat-icon usa el default font set)
- `OntimizeMatIconRegistry.initialize()` → `setDefaultFontSetClass('material-symbols-outlined')`
- `icon.service.ts` → clase actualizada en HTML dinámico
- `fake-icon-registry.ts` → `getDefaultFontSetClass()` retorna `['material-symbols-outlined']`
- `typography.scss` → selector ampliado a `.material-icons, .material-symbols-outlined`
- SVG icon set simplificado (eliminadas definiciones de monedas sin uso)
- **v18 theme sin overrides de botones** — los botones heredan los estilos por defecto de Angular Material

### Playground: control flow — ✅ COMPLETADO (11 abril 2026) — commit `8686e0b` (repo playground)

- 21 templates migrados de `*ngIf`/`*ngFor` a `@if`/`@for` con el schematic automático
- PASO 3 del plan playground completado

### Playground migrado — ✅ COMPLETADO (8 abril 2026) — commit `3e47f22` (repo playground)

- `package.json` actualizado: dependencia `ontimize-web-ngx` apunta a tgz local (`../ontimize-web-ngx/dist/`)
- Eliminado `@angular/flex-layout` / `@ngbracket/ngx-layout` de dependencias directas
- Añadido `@ngbracket/ngx-layout@^18.0.0` + npm `overrides` para alias `@angular/flex-layout` (requerido por companion packages v15)
- SCSS M2 migrado en temas del playground (4 archivos)
- `@` escapados con `&#64;` en templates (parser control flow Angular 17+)
- Copia local de `o-gallery-theme-compat.scss` (tema gallery M2-compatible)
- `MediaObserver` → `BreakpointObserver` en `screen-configuration.component.ts`
- `UntypedFormControl` → `AbstractControl` en `validators.component.ts`
- **103 templates HTML** migrados: `fxLayout/fxFlex/fxLayoutAlign/fxLayoutGap` → clases CSS `o-flex-*`
- `CommonModule` añadido a `SharedModule` (se perdía al quitar FlexLayoutModule que lo re-exportaba transitivamente)
- **Build playground: 0 errores** ✅

---

## PENDIENTE

### 1. Sub-paso 3.2: Migración a Material M3 — framework (POSPUESTO)

- Migrar de M2 theming (prefijo `m2-`) a M3 tokens
- **Alcance**: 310 llamadas `mat.m2-get-color-from-palette()` en 36 ficheros
- **Decisión**: Pospuesto a post-migración — el framework funciona correctamente con M2 en Angular 18. La migración a M3 es un proyecto independiente de alto riesgo.
- Herramienta cuando se retome: `ng generate @angular/material:m3-theme`

### 2. Playground PASO 6: Standalone bootstrap — ✅ COMPLETADO (15 abril 2026) — commit `232a4c0` (repo playground)

- `main.ts` migrado a `bootstrapApplication(AppComponent, { providers: [provideOntimizeWeb(CONFIG), provideRouter(routes), ...] })`
- `app.module.ts` + `app-routing.module.ts` eliminados → `app.routes.ts`
- `main.module.ts` + `main-routing.module.ts` eliminados → `main.routes.ts`
- `layout.module.ts` + `layout-routing.module.ts` eliminados → `layout.routes.ts`
- `media.module.ts` + `media-routing.module.ts` eliminados → `media.routes.ts`
- `inputs-routing.module.ts` eliminado → `inputs.routes.ts` (sub-components siguen declarados en `InputsModule`)
- Shell components standalone: `ContainersComponent`, `LayoutManagerComponent`, `ImageComponent`, `GalleryComponent`, `ImageEditorComponent`
- Sub-features con componentes no-standalone (inputs sub-pages, containers-basic/collapsible, layout-manager sub-pages, media sub-pages) siguen en NgModules — cargados vía `loadChildren`

### 3. Addons pendientes de migrar

Los planes de migración están en cada repo pero aún no se han ejecutado:

| Addon | Ruta local | Plan |
|-------|-----------|------|
| `ontimize-web-ngx-filemanager` | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-filemanager` | `plan-angularMigration15To18.prompt.md` |
| `ontimize-web-ngx-report` | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-report` | `plan-angularMigration15To18.prompt.md` |
| `ontimize-web-ngx-charts` | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-charts` | `plan-angularMigration15To18.prompt.md` |
| `ontimize-web-ngx-map` | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-map` | `plan-angularMigration15To18.prompt.md` |
| `ontimize-web-ngx-quickstart` | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-quickstart` | `plan-angularMigration15To18.prompt.md` |

Cada plan sigue 3 fases (16→17→18) con estrategia de ramas `migration/16.x.x` → `migration/17.x.x` → `migration/18.x.x`.

### 3. Smoke test visual playground

La playground usa ahora `bootstrapApplication()`. Verificación visual pendiente de:
- Todos los inputs (text, combo, date, etc.)
- Tables (paginación, scroll, filtros)
- Forms con CRUD
- Dark theme toggle
- Layout manager (tabs, dialog, sidenav)
- Gallery, extra-components

---

## WORKFLOW DE VALIDACIÓN

```bash
# Activar Node 20 (SIEMPRE antes de cualquier comando Angular)
export PATH="$HOME/AppData/Local/nvs/node/20.18.3/x64:$PATH"

# 1. Tests del framework
cd c:/work/ontimize-web-ngx/18.x.x/ontimize-web-ngx
npm test
# → 2277 SUCCESS, 0 failures esperados

# 2. Build completo del framework (incluye SCSS bundling, copy-files, gulp)
npm run build
# → 5 pasos: ng build + build-theme + build-styles + copy-files + copy-files-themes

# 3. Generar tgz
cd dist && npm pack
# → ontimize-web-ngx-18.0.0-SNAPSHOT-0.tgz (~3.7 MB)

# 4. En playground: reinstalar y verificar
cd c:/work/ontimize-web-ngx/18.x.x/ontimize-web-ngx-playground
npm install --legacy-peer-deps
npx ng build
# → Build at: ... (0 errores esperados)

# 5. Arrancar playground para smoke test visual
npx ng serve
# → http://localhost:4200
```

---

## NOTAS TÉCNICAS

### Build pipeline completo del framework

`npm run build` NO es solo `ng build`. Incluye 5 pasos encadenados:

```
ng build
  → build-theme   (bundle-scss → dist/theme.scss, ~47KB)
  → build-styles  (scss-bundle → dist/ontimize.scss)
  → copy-files    (copia SVGs a dist/assets/)
  → copy-files-themes  (gulp → dist/theming/)
```

El tgz generado queda en `dist/ontimize-web-ngx-18.0.0-SNAPSHOT-0.tgz`.

### Paquetes companion — migración a Angular 18 completada (10 abril 2026)

`ontimize-web-ngx-extra-components` y `ontimize-web-ngx-gallery` han sido migrados a Angular 18 siguiendo la misma estrategia de 3 ramas incrementales.

| Addon | Ruta local | Rama activa | Versión |
|-------|-----------|-------------|---------|
| `ontimize-web-ngx-extra-components` | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-extra-components` | `migration/18.x.x` | `18.0.0-SNAPSHOT-0` |
| `ontimize-web-ngx-gallery` | `C:\work\ontimize-web-ngx\18.x.x\ontimize-web-ngx-gallery` | `migration/18.x.x` | `18.0.0-SNAPSHOT-0` |

Cambios destacados en los addons:
- `ngx-image-cropper` → v8 (standalone, `ImageCropperModule` → `ImageCropperComponent`)
- `FlexLayoutModule` eliminado de `o-components.ts`
- `luxon` añadido como dependencia (peer de `ngx-material-timepicker` transitivo del framework)
- `ontimize-web-ngx` apunta al tgz local `file:../ontimize-web-ngx/dist/ontimize-web-ngx-18.0.0-SNAPSHOT-0.tgz`

Los tgz de los addons se instalan en el playground:
- `file:../ontimize-web-ngx-extra-components/dist/ontimize-web-ngx-extra-components-18.0.0-SNAPSHOT-0.tgz`
- `file:../ontimize-web-ngx-gallery/dist/ontimize-web-ngx-gallery-18.0.0-SNAPSHOT-0.tgz`

`@ngbracket/ngx-layout` y el `overrides` eliminados del playground — ya no son necesarios con los addons en v18.

### Node.js

Usar `nvs` (no nvm):
```bash
export PATH="$HOME/AppData/Local/nvs/node/20.18.3/x64:$PATH"
```
Versiones disponibles: `20.18.3/x64` (activa), `18.10.0/x64`, `14.20.0/x64`.
Angular CLI requiere Node ≥ 18.19 — usar siempre la 20.18.3.

### Tests y standalone

Al convertir un componente a standalone, mover su declaración de `declarations[]` a `imports[]` en los `TestBed.configureTestingModule()` de sus specs. Ver `o-testing-utils.ts` como referencia.
