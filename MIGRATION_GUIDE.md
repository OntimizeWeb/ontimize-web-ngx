# Guía de migración para consumidores — Ontimize Web NGX 18

Esta guía cubre los pasos necesarios para migrar un proyecto consumidor de **ontimize-web-ngx 15** (Angular 15) a **ontimize-web-ngx 18** (Angular 18).

---

## 1. Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20.x |
| Angular CLI | 18.x |
| TypeScript | 5.4+ |

```bash
node --version   # >= 20.0.0
ng version       # Angular CLI: 18.x
```

---

## 2. Actualizar dependencias

### 2.1 Actualizar Angular y dependencias core

```bash
ng update @angular/core@18 @angular/cli@18 @angular/material@18 @angular/cdk@18
```

### 2.2 Actualizar ontimize-web-ngx

```bash
npm install ontimize-web-ngx@18
```

### 2.3 Eliminar @angular/flex-layout / @ngbracket/ngx-layout

Si tu proyecto usa `FlexLayoutModule` o `@ngbracket/ngx-layout`, elimínalo:

```bash
npm uninstall @angular/flex-layout @ngbracket/ngx-layout
```

Sustituye los atributos de plantilla:

| Antes | Después |
|---|---|
| `fxLayout="row"` | `class="o-flex-row"` |
| `fxLayout="column"` | `class="o-flex-column"` |
| `fxLayoutAlign="start center"` | `class="o-layout-align-start-center"` |
| `fxFlex` | `class="o-flex"` |
| `fxFlex="grow"` | `class="o-flex-grow"` |
| `fxLayoutGap="8px"` | `style="gap: 8px"` |
| `fxFill` / `fxFlexFill` | `class="o-flex-fill"` |

#### Clases de tamaño porcentual — row vs column

Las clases `o-flex-50`, `o-flex-20`, `o-flex-80`, `o-flex-45`, `o-flex-100` usan `max-width` y están diseñadas para hijos de un contenedor **row**. Si el padre es `o-flex-column` (flex-direction: column), usa las variantes `o-flex-col-*` que usan `max-height` en su lugar:

| `fxFlex` en padre **row** | `fxFlex` en padre **column** |
|---|---|
| `o-flex-20` | `o-flex-col-20` |
| `o-flex-45` | `o-flex-col-45` |
| `o-flex-50` | `o-flex-col-50` |
| `o-flex-80` | `o-flex-col-80` |
| `o-flex-100` | `o-flex-col-100` |

Ontimize Web NGX 18 incluye clases CSS utilitarias equivalentes en `flex-layout.scss` (importado automáticamente por el tema).

---

## 3. Theming — migrar a `ontimize-style` (Material 3)

### 3.1 Actualizar el import de estilos en `styles.scss`

**Antes (Angular 15):**
```scss
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;
// o bien:
@use 'ontimize-web-ngx/theming/ontimize-style-v8' as ontimize-style;
```

**Después (Angular 18):**
```scss
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;

@use '@angular/material' as mat;

$primary: mat.m2-define-palette($mat-custom-primary);
$accent:  mat.m2-define-palette($mat-custom-accent);

$theme:      ontimize-style.o-mat-light-theme($primary, $accent);
$dark-theme: ontimize-style.o-mat-dark-theme($primary, $accent);

@include ontimize-style.ontimize-theme-styles($theme);

.dark-theme {
  @include ontimize-style.ontimize-theme-all-component-color($dark-theme);
}
```

> **Nota**: el import se llamaba `ontimize-style.v18` durante la transición;
> desde la versión 18.0.0 final el sufijo `.v18` ha desaparecido. Actualiza
> los `@use` de tu `styles.scss` / `app.scss` quitando ese sufijo.

> **Fuente Noto Sans**: `ontimize-style.scss` ya importa `fonts/noto.scss`
> internamente. No es necesario que el consumidor añada
> `@use 'ontimize-web-ngx/theming/fonts/noto'` en su propio `styles.scss`.

### 3.1.bis Nuevas API M3 y CSS custom properties `--o-*`

La versión 18 del framework genera internamente un theme Material 3 vía
`mat.define-theme()` (Material emite los `--mat-*` tokens del sistema) y
expone un juego paralelo de variables Ontimize bajo el prefijo `--o-*`:

- Paletas derivadas de la paleta M2 declarada por el consumer: `--o-primary-50`,
  `--o-primary-500`, `--o-primary-contrast-500`, `--o-accent-*`, `--o-warn-*`.
- Foreground: `--o-fg-text`, `--o-fg-secondary-text`, `--o-fg-divider`,
  `--o-fg-icon`, `--o-fg-disabled`, `--o-fg-title`, `--o-fg-hint`, …
- Background: `--o-bg-card`, `--o-bg-background`, `--o-bg-level-0`,
  `--o-bg-level-04`, `--o-bg-level-06`, `--o-bg-level-08`, `--o-bg-level-1`,
  `--o-bg-status-bar`, `--o-bg-app-bar`, `--o-bg-sidenav-overlay`.
- Typography: `--o-font-family` y, por cada level (`body-1`, `input`, `body-2`,
  `subtitle-1`, `subtitle-2`, `headline-5`, `headline-6`, `caption`, `button`):
  `--o-font-<level>-size`, `--o-font-<level>-line-height`,
  `--o-font-<level>-weight`.
  El level `input` controla el `font-size` de los `mat-form-field` y es
  independiente de `body-1` para poder ajustarlos por separado.

Para styles propios **no** llames a `mat.m2-get-color-from-palette()` ni a
`mat.m2-font-size()`. Usa los tokens directamente:

```scss
// Antes
.my-button { color: mat.m2-get-color-from-palette($primary, 500); }
// Después
.my-button { color: var(--o-primary-500); }

.my-label  { font-size: var(--o-font-body-2-size); }
```

### 3.1.quater Sobrescribir tokens Material (M3)

Además de los `--o-*`, el framework emite los ~500 tokens `--mat-*` que
genera `mat.all-component-themes()` (p. ej. `--mat-sidenav-container-shape`,
`--mdc-text-button-label-text-color`, `--mat-form-field-…`). Puedes
sobrescribirlos en el selector que quieras para ajustar el look Material:

```scss
// Esquinas rectas en el sidenav y etiqueta de botones oscura
.o-app-sidenav {
  --mat-sidenav-container-shape: 0;
  --mdc-text-button-label-text-color: #000;
}
```

El framework ya aplica algunos de estos overrides en sus mixins de
componente (`o-app-sidenav-theme`, etc.); los apps pueden añadir los
suyos en cualquier scope sin tocar Sass.

> **Orden de emisión**: `o-apply-tokens` se emite **después** de
> `mat.all-component-themes()`, de modo que los overrides de `--mat-*`
> y `--mdc-*` definidos en `ontimize-tokens.scss` siempre prevalecen
> sobre los valores por defecto de Material M3.

### 3.1.quinquies Dark mode — tokens de superficie

El framework adapta automáticamente los tokens de superficie M3
(`--mat-sys-surface`, `--mat-sys-background`, `--mat-*-container-color`, …)
al dark mode leyendo el mapa `background` del `$dark-theme`. En concreto:

| Token M3 | Light | Dark |
|---|---|---|
| `--mat-sys-surface` / `surface-bright` | `#ffffff` | `#252525` |
| `--mat-sys-surface-dim` / `--mat-sys-background` | `#f9fafb` | `#1a1a1a` |
| `--mat-sys-surface-container` | `#f5f5f5` | `#2e2e2e` |
| `--mat-sys-surface-container-high` | `#f0f0f0` | `#303030` |
| `--mat-sys-surface-container-highest` | `#e8e8e8` | `#3a3a3a` |
| menú, tabla, toolbar, tree… | `#ffffff` | `#252525` |
| paginator, sidenav | `#f9fafb` | `#1a1a1a` |

Para activar el dark mode en tu app basta con añadir la clase `.o-dark`
al elemento raíz y llamar a `ontimize-theme-all-component-color` con
el `$dark-theme`:

```scss
.o-dark {
  @include ontimize-style.ontimize-theme-all-component-color($dark-theme);
}
```

### 3.1.ter Factory con typography / density configurables

`o-mat-light-theme` y `o-mat-dark-theme` admiten parámetros opcionales:

```scss
$theme: ontimize-style.o-mat-light-theme(
  $primary,
  $accent,
  $warn:       mat.m2-define-palette(mat.$m2-red-palette),
  $typography: my-typography.$typography,  // formato plano: ver abajo
  $density:    -4                          // 0 | -1 | -2 | -3 | -4 | -5
);
```

El tema `oxygen` incluido en el framework usa `$density: -4` por defecto
(look compacto). Para formas más aireadas o más compactas, pásale otro valor.

> **Altura de botones**: el framework controla la altura de todos los botones
> mediante el token `--o-button-height`, que se ajusta automáticamente con
> la escala de densidad del tema (40px en escala 0, 32px en `-2` por defecto,
> 24px en `-5`). Los tokens MDC derivados (`--mdc-text-button-container-height`,
> `--mdc-filled-button-container-height`, `--mdc-protected-button-container-height`,
> `--mdc-outlined-button-container-height`) leen `--o-button-height` y afectan
> a todos los botones de la aplicación. Si necesitas un valor diferente,
> sobrescríbelo en el scope deseado:
>
> ```scss
> html { --o-button-height: 36px; }         // global
> .my-toolbar { --o-button-height: 28px; }  // scope concreto
> ```

Formato del `$typography` (mapa plano, sin dependencia de Material):

```scss
$typography: (
  font-family: 'Noto Sans, "Helvetica Neue", sans-serif',
  levels: (
    body-1:     (size: 14px, line-height: 1.125em, weight: 400),
    input:      (size: 14px, line-height: 14px,    weight: 400),  // font-size de mat-form-field
    body-2:     (size: 12px, line-height: 15px,    weight: 400),
    subtitle-1: (size: 14px, line-height: 21px,    weight: 600),
    headline-6: (size: 18px, line-height: 24px,    weight: 500),
    // ...
  ),
  table: (
    small-row-height:      28px,
    medium-row-font-size:  12px,
    // ...
  ),
);
```

> **Nota**: el level `input` es obligatorio si quieres controlar el
> `font-size` de los inputs independientemente de `body-1`. El framework
> lo mapea a `--mat-form-field-container-text-size` y a los tokens
> `--mdc-*-text-field-input-text-size`.

Si no pasas `$typography` el tema usa la config por defecto (Noto Sans).

### 3.2 Añadir fuente de iconos en `index.html`

**Antes (Angular 15):**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

**Después (Angular 18):**
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

> **Nota**: Los iconos pasan de `material-icons` (ligatura) a `material-symbols-outlined` (fuente variable). Los nombres de los iconos no cambian.

### 3.3 Usar un tema predefinido (opcional)

Si no necesitas paletas personalizadas, puedes usar directamente el tema azul de Ontimize:

```scss
// styles.scss
@use 'ontimize-web-ngx/theming/themes/ontimize-blue' as theme;
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;

// theme.$theme y theme.$dark-theme están disponibles
@include ontimize-style.ontimize-theme-styles(theme.$theme);

.dark-theme {
  @include ontimize-style.ontimize-theme-all-component-color(theme.$dark-theme);
}
```

### 3.4 Diferencias visuales v15 vs v18

| Aspecto | v15 | v18 |
|---|---|---|
| **Fuente** | Poppins | Noto Sans |
| **Iconos** | Material Icons (ligatura) | Material Symbols Outlined |
| **Sidenav** | Fondo derivado del color primary + sombra + esquinas redondeadas (Material default) | Fondo neutro (`--o-bg-app-bar`), sin sombra, esquinas rectas (`--mat-sidenav-container-shape: 0`) |
| **Botones** | Estilos custom (borde, color, hover) | Altura fija 32 px via `--o-button-height`; resto defaults de Angular Material |
| **Density** | Aplicada (checkbox, list, radio, menu, tree) | Configurable via `$density` en el factory |
| **Tabs** | Fondo inactivo personalizado | Defaults de Angular Material |
| **Material theming** | M2 (`mat.m2-define-light-theme`) | **M3** (`mat.define-theme` interno) |
| **Tokens CSS** | Sass variables en build-time | **CSS custom properties `--o-*` y `--mat-*`** runtime |
| **Background levels** | Derivados del primary vía `mix()` | Colores fijos (`#f9FAFB`, `#f7f7f7`, `#f2f2f2`, `#e0e0e0`, `white`) independientes de la paleta |

### 3.5 Configurar density en Angular 18 (opcional)

Material 3 aplica la density definida en el theme. El factory
`o-mat-light-theme` / `o-mat-dark-theme` acepta el parámetro `$density`
(defecto `-2`, compact). Valores válidos: `0` (default Material), `-1`, `-2`, `-3`, `-4`, `-5`.

**Opción A — Parámetro del factory (recomendado)**

```scss
$theme: ontimize-style.o-mat-light-theme(
  $primary, $accent,
  $density: -4
);

@include ontimize-style.ontimize-theme-styles($theme);
```

`ontimize-theme-styles` aplica internamente `ontimize-theme-density-extended($density)`, que emite los tokens nativos de Material y además los overrides extendidos descritos abajo.

**Opción B — Sobrescribir la densidad por scope**

Para aplicar una densidad distinta en una zona concreta de la app después de aplicar el tema:

```scss
@include ontimize-style.ontimize-theme-styles(theme.$theme);  // densidad del tema

.compact-zone {
  @include ontimize-style.ontimize-theme-density-extended(-5);
}

.relaxed-zone {
  @include ontimize-style.ontimize-theme-density-extended(0);
}
```

**Opción C — `map.merge` sobre un tema ya construido**

```scss
@use "sass:map";
@use "ontimize-web-ngx/theming/themes/oxygen" as theme;

$theme-compact: map.merge(theme.$theme, (density: -4));

@include ontimize-style.ontimize-theme-styles($theme-compact);
```

#### Sistema de densidad extendido

Angular Material define los tokens de densidad en `@angular/material/core/tokens/_density.scss` como listas indexadas por escala. Cuando se pide una escala más profunda que la lista de un componente, Material hace clamp al último valor definido. **`mat-form-field` y `mat-paginator` no tienen valores para `-4`/`-5`** — sus tokens se quedan en los valores de `-3`.

Ontimize exporta `ontimize-theme-density-extended($scale)` (usado internamente por `ontimize-theme-styles`) que añade overrides manuales para esos componentes y mantiene `--o-button-height` coherente con la escala.

| Token | escala 0 | -1 | -2 (default) | -3 | -4 | -5 |
|---|---|---|---|---|---|---|
| `--o-button-height` | 40px | 36px | 32px | 28px | 28px | 24px |
| `--mat-form-field-container-height` | 56px (Mat) | 52px (Mat) | 48px (Mat) | 44px (Mat) | **40px** | **36px** |
| `--mat-form-field-container-vertical-padding` | 16px (Mat) | 14px (Mat) | 12px (Mat) | 10px (Mat) | **8px** | **6px** |
| `--mat-form-field-filled-label-display` | **block** | **block** | **block** | **block** | **block** | **block** |
| `--mdc-filled-text-field-label-text-size` | default | default | default | **12px** | **11px** | **11px** |
| `--mat-paginator-container-size` | 56px (Mat) | 52px (Mat) | 48px (Mat) | 40px (Mat) | **36px** | **32px** |

Notas:
- **Label flotante siempre visible**: Material por defecto fija `filled-label-display: none` desde escala `-3`. Ontimize la fuerza a `block` en todas las escalas porque `mat-label` es parte de la semántica del campo.
- **Tamaño de label reducido en escalas profundas** (`-3` a `-5`) para mantener legibilidad cuando el campo se reduce.
- **`--o-button-height` por escala**: el token Ontimize que controla todos los botones MDC se ajusta automáticamente.

**Opción D — Por componente Material individual**

```scss
@use '@angular/material' as mat;

.zona-form-compacto {
  @include mat.form-field-density(-3);
}
```

---

## 4. Bootstrap de la aplicación

### 4.1 Opción A — Standalone bootstrap (recomendado para Angular 18)

Reemplaza `AppModule` + `platformBrowserDynamic().bootstrapModule()` por `bootstrapApplication()`:

**Antes (`main.ts`):**
```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

**Después (`main.ts`):**
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideOntimizeWeb } from 'ontimize-web-ngx';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { CONFIG } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideOntimizeWeb(CONFIG),
    provideRouter(routes),
  ]
}).then(ref => ontimizePostBootstrap(ref));
```

> `provideOntimizeWeb(config)` es el equivalente standalone de `OntimizeWebModule.forRoot(config)`. Incluye automáticamente: `provideHttpClient`, `provideAnimations`, `TranslateModule`, `NgxMaterialTimepickerModule`, `APP_CONFIG`, todos los servicios Ontimize, y el `APP_INITIALIZER`.

**`app.routes.ts`:**
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
  { path: '', redirectTo: 'main', pathMatch: 'full' }
];
```

**`app.component.ts`** (debe ser standalone):
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent {}
```

### 4.2 Opción B — NgModule bootstrap (backward compatible)

Si prefieres mantener el `AppModule`, `OntimizeWebModule` sigue funcionando:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { CONFIG } from './app.config';

@NgModule({
  imports: [
    OntimizeWebModule.forRoot(CONFIG)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

> **Nota**: `OntimizeWebModule` y todos los módulos wrapper (`OFormModule`, `OTableModule`, etc.) están marcados como `@deprecated` en la versión 18. Seguirán funcionando pero se eliminarán en una versión futura.

---

## 5. Usar componentes standalone directamente

En Angular 18 puedes importar los componentes directamente sin módulos wrapper:

```typescript
// Mi componente standalone
import { OFormComponent, OTextInputComponent, OButtonComponent } from 'ontimize-web-ngx';

@Component({
  standalone: true,
  imports: [OFormComponent, OTextInputComponent, OButtonComponent],
  template: `
    <o-form ...>
      <o-text-input attr="name" ...></o-text-input>
      <o-button label="Guardar" type="RAISED"></o-button>
    </o-form>
  `
})
export class MyFormComponent {}
```

Si usas NgModules en tu aplicación, sigue usando los módulos wrapper por ahora:

```typescript
// my.module.ts — sigue funcionando aunque sea @deprecated
import { OFormModule, OInputsModule } from 'ontimize-web-ngx';
```

---

## 6. Rutas — migración de NgModule a rutas standalone (opcional)

Si tienes módulos de routing propios, puedes migrarlos a ficheros `.routes.ts`:

**Antes (`main-routing.module.ts`):**
```typescript
@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: MainComponent, children: [...] }
  ])],
  exports: [RouterModule]
})
export class MainRoutingModule {}
```

**Después (`main.routes.ts`):**
```typescript
import { Routes } from '@angular/router';

export const MAIN_ROUTES: Routes = [
  { path: '', component: MainComponent, children: [...] }
];
```

**Referenciado desde el parent:**
```typescript
{ path: 'main', loadChildren: () => import('./main/main.routes').then(m => m.MAIN_ROUTES) }
```

---

## 7. Guards funcionales

Los guards de clase de Angular están obsoletos. Si usas los guards de Ontimize, la API pública incluye las versiones funcionales:

```typescript
import { authGuard, permissionsGuard, canActivateFormLayoutChildGuard } from 'ontimize-web-ngx';

// En tus rutas:
{ path: 'protected', component: MyComponent, canActivate: [authGuard] }
{ path: 'admin', component: AdminComponent, canActivate: [permissionsGuard] }
```

---

## 8. Formularios tipados

Angular 18 requiere `FormGroup`/`FormControl` tipados. Si tienes `UntypedFormGroup`/`UntypedFormControl` en tu código:

```bash
# Migración automática (Angular schematic)
ng generate @angular/core:untyped-forms
```

O manualmente, reemplazar:
```typescript
// Antes
new UntypedFormGroup({ name: new UntypedFormControl('') });

// Después
new FormGroup({ name: new FormControl('') });
```

---

## 9. Material SCSS — M3 tokens via CSS custom properties

El framework 18 emite tokens Material 3 (`--mat-*`) y tokens custom de
Ontimize (`--o-*`). **Tu SCSS custom debería consumir esos tokens en vez
de llamar a `mat.m2-*` en tiempo de build.**

| Necesitas… | Usa… |
|---|---|
| Color de primary/accent/warn | `var(--o-primary-500)`, `var(--o-accent-500)`, `var(--o-warn-500)` |
| Foreground (texto, iconos, dividers) | `var(--o-fg-text)`, `var(--o-fg-secondary-text)`, `var(--o-fg-icon)`, `var(--o-fg-divider)`, `var(--o-fg-hint)`, `var(--o-fg-disabled)` |
| Background de superficie / niveles | `var(--o-bg-card)`, `var(--o-bg-background)`, `var(--o-bg-level-0…1)`, `var(--o-bg-status-bar)` |
| Font-size / weight / line-height | `var(--o-font-body-1-size)`, `var(--o-font-body-1-weight)`, `var(--o-font-body-1-line-height)`, `var(--o-font-family)` |

Ejemplo (antes vs después):

```scss
// Antes (M2)
.my-button {
  color: mat.m2-get-color-from-palette($primary, 500);
  font-size: mat.m2-font-size($typography, body-2);
}

// Después (M3-ready, runtime-overridable)
.my-button {
  color: var(--o-primary-500);
  font-size: var(--o-font-body-2-size);
}
```

> **Compatibilidad**: si todavía necesitas el mapa M2 del theme por otras
> razones, sigue disponible como `$theme` (contiene `color.primary`, etc.).
> Solo que invocar `mat.m2-font-size($typography, body-1)` ya no funciona
> porque la typography migró a un mapa plano. Para leer un tamaño de
> typography desde Sass: `map.get($typography, levels, body-1, size)`.

Ontimize Web NGX 18 aplica theming Material 3 internamente via
`mat.define-theme()`. Las paletas que tu app declara siguen siendo M2
(`mat.m2-define-palette`) para backwards compatibility: el framework las
traduce a tokens `--o-*` automáticamente.

---

## 10. Checklist de migración

```
[ ] Node.js >= 20 instalado
[ ] ng update @angular/core@18 @angular/cli@18 @angular/material@18
[ ] npm install ontimize-web-ngx@18
[ ] npm uninstall @angular/flex-layout (si aplica)
[ ] styles.scss: cambiar import a ontimize-style (sin .v18)
[ ] index.html: cambiar a Material Symbols Outlined
[ ] index.html: eliminar Material Icons font link
[ ] main.ts: migrar a bootstrapApplication() + provideOntimizeWeb() (opcional)
[ ] app.routes.ts: crear fichero de rutas standalone (opcional)
[ ] Guards: usar authGuard/permissionsGuard funcionales
[ ] SCSS propio: reemplazar mat.m2-get-color-from-palette()/m2-font-size()
    por var(--o-primary-*)/var(--o-fg-*)/var(--o-font-*)
[ ] Verificar smoke test visual: form, table, list, grid, sidenav
```

---

## 11. Problemas conocidos y soluciones

### Iconos muestran texto literal en lugar del icono

**Causa**: El link de `Material Icons` ha sido reemplazado por `Material Symbols Outlined`. El CSS antiguo `class="material-icons"` ya no carga la fuente.

**Solución**: Asegúrate de que `index.html` incluye:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,GRAD,FILL@20..48,100..700,-50..200,0..1"
        rel="stylesheet">
```
Y que **NO** tienes el link antiguo de Material Icons activo.

### Error `NG0303: Can't bind to 'ngTemplateOutlet'`

**Causa**: Al convertir un componente a standalone, falta importar `NgTemplateOutlet`.

**Solución**:
```typescript
import { NgTemplateOutlet } from '@angular/common';

@Component({ standalone: true, imports: [NgTemplateOutlet, ...] })
```

### `NullInjectorError` en standalone bootstrap

**Causa**: Algunos proveedores que antes venían de `AppModule` o `FlexLayoutModule` ya no están disponibles.

**Solución**: Verificar que `provideOntimizeWeb(CONFIG)` está en el array `providers` de `bootstrapApplication`. No es necesario añadir manualmente `provideAnimations()`, `provideHttpClient()` ni `ONTIMIZE_PROVIDERS` — todos están incluidos en `provideOntimizeWeb()`.

### Error de compilación SCSS: `Can't find stylesheet to import`

**Causa**: Si tu `styles.scss` importa `theme.scss` directamente (relativo a la fuente), puede fallar en local. `theme.scss` se genera durante `npm run build` del framework y solo existe en el paquete npm publicado.

**Solución**: Usa siempre los imports por nombre de paquete:
```scss
// ✅ Correcto
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;

// ❌ Incorrecto (ruta relativa al fuente del framework)
@use '../node_modules/ontimize-web-ngx/theming/ontimize-style';
```

### Error SCSS: `'Typography config does not have a level called "body-2"'`

**Causa**: tu SCSS custom llama a `mat.m2-font-size($typography, body-2)`.
La typography de Ontimize 18 ya no es un config M2: es un mapa plano
`{ font-family, levels, table }`, y el helper M2 no sabe leerlo.

**Solución**: usa los CSS custom properties `--o-font-<level>-size` que
el framework emite automáticamente:

```scss
// Antes
.my-class { font-size: mat.m2-font-size($typography, body-2); }
// Después
.my-class { font-size: var(--o-font-body-2-size); }
```

### `mat-toolbar color="primary"` / `mat-icon color="accent"` no aplica color

**Causa**: Angular Material 18 usa un theme M3 internamente. El mixin `toolbar.color()` de Material solo emite los selectores `.mat-primary`/`.mat-accent`/`.mat-warn` cuando el tema es M2 (`get-theme-version == 0`). Con M3 esos selectores no se generan.

El mismo problema afecta en menor medida a `mat-icon`, `mat-progress-bar` y `mat-progress-spinner` — aunque para estos `mat.color-variants-backwards-compatibility()` sí los cubre.

**Solución**: el framework lo gestiona internamente desde la versión 18.0.0. No es necesario hacer nada en el consumer. Si en un addon propio tienes este problema, añade en tu theming:

```scss
// Restaura color="primary|accent|warn" en mat-toolbar con M3 theme
.mat-toolbar {
  &.mat-primary {
    --mat-toolbar-container-background-color: var(--o-primary-500);
    --mat-toolbar-container-text-color: var(--o-primary-contrast-500);
  }
  &.mat-accent {
    --mat-toolbar-container-background-color: var(--o-accent-500);
    --mat-toolbar-container-text-color: var(--o-accent-contrast-500);
  }
  &.mat-warn {
    --mat-toolbar-container-background-color: var(--o-warn-500);
    --mat-toolbar-container-text-color: var(--o-warn-contrast-500);
  }
}
```

> Los tokens `--mat-toolbar-container-background-color` y `--mat-toolbar-container-text-color` son los que el CSS del componente `mat-toolbar` lee internamente. El texto en color se hereda al resto de elementos hijos via `color: var(--mat-toolbar-container-text-color)` en el host.

### Componentes de addons con `*ngIf`/`*ngFor` en templates

**Causa**: los addons migrados a Angular 18 pueden seguir usando la sintaxis de directivas estructurales (`*ngIf`, `*ngFor`, `*ngSwitch`). Aunque Angular 18 sigue soportándolas, producen warnings de deprecación y en algunos casos conflictos con `OnPush` + `@ViewChild`.

**Solución**: migrar templates a la nueva sintaxis de control flow:

| Antes | Después |
|---|---|
| `*ngIf="cond"` | `@if (cond) { ... }` |
| `*ngIf="cond; else tmpl"` | `@if (cond) { ... } @else { <ng-template> }` |
| `*ngFor="let x of list"` | `@for (x of list; track x) { ... }` |
| `[ngSwitch]="val"` + `*ngSwitchCase` | `@switch (val) { @case (a) { ... } @default { ... } }` |

El `NgIf`, `NgFor`, `NgSwitch` de `@angular/common` ya no necesitan importarse explícitamente en componentes standalone — la nueva sintaxis es nativa del compilador.
