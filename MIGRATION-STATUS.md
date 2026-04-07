# Migración Angular 15 → 18 — Estado actual

> Última actualización: 7 abril 2026

## Repositorios y ramas

| Repo | Ruta local | Rama |
|------|-----------|------|
| **ontimize-web-ngx** (framework) | `E:\workspace\angular\ontimize-web-ngx\15x\ontimize-web-ngx` | `migration/18.x.x` |
| **playground** (demo) | `E:\workspace\angular\ontimize-web-ngx\15x\demos\ontimize-web-ngx-playground` | `migration/18.x.x` |

## Versiones actuales en migration/18.x.x

- **Angular**: 18.2.14
- **TypeScript**: 5.5.4
- **zone.js**: 0.14.10
- **ng-packagr**: ^18.2.0
- **Node.js**: v20.18.3 (nvm)
- **Tests del framework**: 2247 specs OK (sub-paso 3.3 completo)

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

### Sub-paso 3.3: Standalone components — COMPLETADO ✅

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

**Nota técnica**: `OTableColumnComponent` se excluye del array `imports[]` de `OTableComponent` para evitar dependencias circulares estáticas (se inyecta vía `forwardRef`). Los 2247 tests pasan.

### Migración SCSS M2 — commit `10492030`

- **32 archivos SCSS modificados** con prefijo `m2-` para Angular Material 18:
  - `mat.define-palette` → `mat.m2-define-palette`
  - `mat.define-typography-level` → `mat.m2-define-typography-level`
  - `mat.get-color-from-palette` → `mat.m2-get-color-from-palette`
  - `mat.font-size/weight/family` → `mat.m2-font-size/weight/family`
  - `mat.define-light-theme/dark-theme` → `mat.m2-define-light-theme/dark-theme`
  - `mat.$red-palette` → `mat.$m2-red-palette` (y `amber`, `light-blue`)
- APIs root-level **sin cambio**: `mat.core()`, `mat.all-component-themes()`, density mixins
- `ng-package.json`: añadido `assets` para incluir SCSS en el paquete npm

### Playground migrado — commit `b9f7bf1` (repo playground)

- `package.json` actualizado a Angular 18
- `@ngbracket/ngx-layout ^18.0.0` como reemplazo de `@angular/flex-layout`
- Alias npm: `@angular/flex-layout@npm:@ngbracket/ngx-layout@^18.0.0` (para paquetes companion v15)
- SCSS M2 migrado en temas del playground (4 archivos)
- `@` escapados con `&#64;` en templates (parser control flow Angular 17+)
- Copia local de `o-gallery-theme-compat.scss` (tema gallery M2-compatible)
- **Build del playground OK** — genera dist con todos los chunks correctamente

---

## PENDIENTE POR HACER

### Sub-paso 3.3: Standalone components — ✅ COMPLETADO (7 abril 2026)

### Sub-paso 3.5: Eliminación de flex-layout

- Reemplazar `fxLayout`, `fxFlex`, `fxLayoutAlign` con CSS Grid/Flexbox nativo
- Eliminar dependencia de `@ngbracket/ngx-layout`
- Afecta tanto framework como playground

### Sub-paso 3.2: Migración a Material M3

- Migrar de M2 theming (actualmente con prefijo `m2-`) a M3 tokens
- Requiere reestructurar los tokens de tema
- 24+ archivos SCSS de theming

### Sub-paso 3.4: Typed Forms

- Migrar `UntypedFormGroup`/`UntypedFormControl` a `FormGroup`/`FormControl` tipados
- ~50+ refs en 25+ archivos

---

## WORKFLOW DE VALIDACIÓN

Para cada sub-paso:

```bash
# 1. Hacer cambios en el framework
# 2. Ejecutar tests
npx ng test ontimize-web-ngx --browsers=ChromeHeadless --watch=false

# 3. Build completo (NO solo ng build — incluye SCSS bundling)
npm run build

# 4. Generar .tgz
cd dist/ontimize-web-ngx && npm pack

# 5. En playground: reinstalar
Remove-Item node_modules\ontimize-web-ngx -Recurse -Force
npm install --legacy-peer-deps

# 6. Build playground
npx ng build

# 7. Servir
npx ng serve
```

---

## NOTAS TÉCNICAS IMPORTANTES

### Build pipeline completo del framework

`npm run build` NO es solo `ng build`. Incluye 5 pasos:

```
ng build
  → build-theme (bundle-scss --config → genera dist/theme.scss, 47KB)
  → build-styles (scss-bundle → genera dist/ontimize.scss)
  → copy-files (copia SVGs)
  → copy-files-themes (gulp: copia ontimize-style.scss, ontimize-style-v8.scss a dist/theming/)
```

### Paquetes companion v15

Los paquetes companion (`ontimize-web-ngx-extra-components`, `ontimize-web-ngx-gallery`) son v15 y necesitan:
- **Alias npm** para `@angular/flex-layout`: `npm install "@angular/flex-layout@npm:@ngbracket/ngx-layout@^18.0.0"`
- **Copias locales** de sus temas SCSS que usan APIs M2 deprecated (ver `o-gallery-theme-compat.scss` en playground)

### PowerShell y exit codes

Angular CLI escribe progreso a stderr. PowerShell lo interpreta como error (exit code 1). Verificar que `dist/` contenga los chunks para confirmar éxito real.

### Tests y standalone

Al convertir un componente a standalone, hay que mover su declaración de `declarations` a `imports` en los `TestBed.configureTestingModule()` de sus tests. Ver `o-testing-utils.ts` como referencia.
