# Guía de migración para consumidores — Ontimize Web NGX 18

> Última actualización: 2026-07-03

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

**Después (Angular 18, Material 3 nativo desde 18.0.0-next.2):**
```scss
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;
@use '@angular/material' as mat;

// Paleta predefinida de Material 3
$theme: ontimize-style.o-mat-light-theme((
  primary:  mat.$azure-palette,
  tertiary: mat.$blue-palette,    // opcional
));

$dark-theme: ontimize-style.o-mat-dark-theme((
  primary: mat.$azure-palette,
));

@include ontimize-style.ontimize-theme-styles($theme);

.dark-theme {
  @include ontimize-style.ontimize-theme-all-component-color($dark-theme);
}
```

#### Cómo crear una paleta Material 3

`primary` y `tertiary` deben ser **paletas Material 3** (mapas Sass con tonos `0..100`). Hay tres formas de obtener una paleta:

**1. Paleta predefinida de Angular Material** (la más rápida)

Angular Material 18 expone 12 paletas listas para usar:

| Paleta | Tono base aproximado |
|---|---|
| `mat.$red-palette` | rojo |
| `mat.$green-palette` | verde |
| `mat.$blue-palette` | azul |
| `mat.$yellow-palette` | amarillo |
| `mat.$cyan-palette` | cian |
| `mat.$magenta-palette` | magenta |
| `mat.$orange-palette` | naranja |
| `mat.$chartreuse-palette` | verde lima |
| `mat.$spring-green-palette` | verde primavera |
| `mat.$azure-palette` | azul cielo |
| `mat.$violet-palette` | violeta |
| `mat.$rose-palette` | rosa |

```scss
@use '@angular/material' as mat;

$theme: ontimize-style.o-mat-light-theme((
  primary: mat.$azure-palette,
));
```

**2. Paleta custom generada por el CLI** (recomendado para branding corporativo)

Si tu color de marca no encaja con ninguna predefinida, usa el schematic oficial de Angular Material que genera la paleta M3 completa a partir de un color HEX semilla:

```bash
ng generate @angular/material:m3-theme
```

El schematic te pregunta interactivamente:
- **Primary color** (HEX, p. ej. `#1464a5`)
- **Secondary / tertiary / neutral / neutral-variant / error** (opcionales — derivados del primary si se omiten)
- **Output path** (dónde guardar el fichero, p. ej. `src/_my-theme.scss`)

> ⚠️ **Adaptar la salida del schematic al factory de Ontimize**
>
> El schematic emite un fichero pensado para `mat.define-theme()` nativo, que **NO es compatible directamente** con `o-mat-light-theme`. La salida del schematic suele tener este aspecto:
>
> ```scss
> // GENERADO POR EL SCHEMATIC — no usar tal cual
> $theme: mat.define-theme((
>   color: (
>     theme-type: light,
>     primary: $_primary,
>     tertiary: $_tertiary,
>   ),
> ));
> ```
>
> Para integrarlo con `o-mat-light-theme` / `o-mat-dark-theme`:
>
> 1. **Mantén** la definición de paletas (`$_palettes`, `$_primary`, `$_tertiary` con sus `map.merge`).
> 2. **Reescribe** las dos últimas líneas pasando solo `primary` y `tertiary` al nivel raíz del config (sin envoltorio `color:`, sin `theme-type:`):
>
> ```scss
> // VERSIÓN ADAPTADA A ONTIMIZE
> $theme: ontimize-style.o-mat-light-theme((
>   primary:  $_primary,
>   tertiary: $_tertiary,
> ));
>
> $dark-theme: ontimize-style.o-mat-dark-theme((
>   primary:  $_primary,
>   tertiary: $_tertiary,
> ));
> ```
>
> El `theme-type` lo fija automáticamente la propia función (`o-mat-light-theme` → light, `o-mat-dark-theme` → dark), así que no hay que pasarlo.

> El algoritmo del schematic usa HCT (Hue/Chroma/Tone), que es el sistema oficial de Material 3 — los tonos se derivan de forma perceptualmente uniforme, no por interpolación lineal del color seed.

**3. Paleta inline en SCSS** (avanzado)

Si prefieres no añadir un fichero más, copia la paleta generada por el CLI directamente en tu tema. Una paleta M3 tiene esta estructura (los valores son los emitidos por el CLI para `#1464a5`):

```scss
$primary: (
  0:   #000000,
  10:  #001d36,
  20:  #003259,
  25:  #003d6b,
  30:  #00497d,
  35:  #005591,
  40:  #0d61a2,
  50:  #367abd,
  60:  #5494d8,
  70:  #70aff5,
  80:  #9fcaff,
  90:  #d1e4ff,
  95:  #eaf1ff,
  98:  #f8f9ff,
  99:  #fdfcff,
  100: #ffffff,
);

$theme: ontimize-style.o-mat-light-theme((
  primary: $primary,
));
```

Los tonos M3 son **distintos** a las escalas M2 (`50..900`). Algunos puntos clave:
- `40` ≈ tono medio (equivalente al `500` M2 para el color principal)
- `90` ≈ tono claro (`primary-container` se deriva de aquí en light themes)
- `10`/`20` ≈ tonos oscuros (`on-primary-container` en light, fondo en dark)

> No intentes generar la paleta a mano: el algoritmo HCT de Material es complejo. Usa el CLI o copia la salida del CLI.

> ⚠️ **Breaking change en 18.0.0-next.2**: la firma del factory cambió de M2 (paletas `mat.m2-define-palette`, parámetros posicionales) a M3 (mapa de configuración, paletas Material 3). Ver sección [Migración a Material 3 nativo](#migracion-a-material-3-nativo-desde-18-0-0-next-1).

> **Nota**: el import se llamaba `ontimize-style.v18` durante la transición;
> desde la versión 18.0.0 final el sufijo `.v18` ha desaparecido. Actualiza
> los `@use` de tu `styles.scss` / `app.scss` quitando ese sufijo.

> **Fuente Noto Sans**: `ontimize-style.scss` ya importa `fonts/noto.scss`
> internamente. No es necesario que el consumidor añada
> `@use 'ontimize-web-ngx/theming/fonts/noto'` en su propio `styles.scss`.

### 3.1.bis CSS custom properties (Material 3 nativo)

El framework 18.0.0-next.2 emite tokens **Material 3 nativos** (`--mat-sys-*`, `--mdc-*`) más un juego complementario Ontimize (`--o-*`):

**Tokens de marca (M3 sys, generados desde la paleta del consumer):**
- `--mat-sys-primary` · `--mat-sys-on-primary` · `--mat-sys-primary-container` · `--mat-sys-on-primary-container`
- `--mat-sys-tertiary` · `--mat-sys-on-tertiary` · `--mat-sys-tertiary-container` · `--mat-sys-on-tertiary-container`
- `--mat-sys-error` · `--mat-sys-on-error` · `--mat-sys-error-container` · `--mat-sys-on-error-container`
- `--mat-sys-surface` · `--mat-sys-surface-container` · `--mat-sys-background`

**Tokens Ontimize (`--o-*`):**
- Foreground: `--o-fg-text`, `--o-fg-secondary-text`, `--o-fg-divider`, `--o-fg-icon`, `--o-fg-disabled`, `--o-fg-title`, `--o-fg-hint`, …
- Background: `--o-bg-card`, `--o-bg-background`, `--o-bg-level-0`, `--o-bg-level-04`, `--o-bg-level-06`, `--o-bg-level-08`, `--o-bg-level-1`, `--o-bg-status-bar`, `--o-bg-app-bar`, `--o-bg-sidenav-overlay`.
- Typography: `--o-font-family` (solo la familia — los tamaños heredan de los tokens M3 `--mat-sys-*`).
- Sizing: `--o-input-icon-size`.

> ⚠️ **Eliminado en 18.0.0-next.2**: los tokens `--o-primary-*`, `--o-accent-*`, `--o-warn-*` (y sus variantes `-contrast-*`) ya **no se emiten**. Ver sección [Migración a Material 3 nativo](#migracion-a-material-3-nativo-desde-18-0-0-next-1) para la tabla de equivalencias M3.

> ⚠️ **Eliminado en 18.0.0-next.3**: `--o-button-height` y todos los tokens `--o-font-<level>-size/line-height/weight` ya **no se emiten**. Ver tablas de equivalencias más abajo.

#### Equivalencias de tokens tipográficos eliminados

| Token eliminado | Equivalente M3 |
|---|---|
| `--o-font-body-1-size` | `--mat-sys-body-medium-size` |
| `--o-font-body-1-line-height` | `--mat-sys-body-medium-line-height` |
| `--o-font-body-1-weight` | `--mat-sys-body-medium-weight` |
| `--o-font-body-2-size` | `--mat-sys-body-small-size` |
| `--o-font-subtitle-1-size` | `--mat-sys-title-medium-size` |
| `--o-font-subtitle-1-line-height` | `--mat-sys-title-medium-line-height` |
| `--o-font-subtitle-2-size` | `--mat-sys-title-small-size` |
| `--o-font-headline-5-size` | `--mat-sys-headline-small-size` |
| `--o-font-headline-6-size` | `--mat-sys-title-large-size` |
| `--o-font-caption-size` | `--mat-sys-label-small-size` |
| `--o-font-button-size` | `--mat-sys-label-large-size` |

#### Equivalencias del token de botón eliminado

| Token eliminado | Equivalente MDC / M3 |
|---|---|
| `--o-button-height` | `--mdc-text-button-container-height` |
| `--o-button-height` | `--mdc-filled-button-container-height` |
| `--o-button-height` | `--mdc-protected-button-container-height` |
| `--o-button-height` | `--mdc-outlined-button-container-height` |
| `--o-button-height` (button-toggle) | `--mat-standard-button-toggle-height` |

Para styles propios **no** llames a `mat.m2-get-color-from-palette()`. Usa los tokens M3 directamente:

```scss
// Antes (M2)
.my-button { color: mat.m2-get-color-from-palette($primary, 500); }
// Después (M3 sys token)
.my-button { color: var(--mat-sys-primary); }

.my-label  { font-size: var(--mat-sys-body-small-size); }
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

`o-mat-light-theme` y `o-mat-dark-theme` aceptan un mapa de configuración Material 3:

```scss
$theme: ontimize-style.o-mat-light-theme((
  primary:    mat.$azure-palette,             // paleta M3 predefinida o custom (CLI: ng generate @angular/material:m3-theme)
  tertiary:   mat.$blue-palette,              // opcional — Material lo deriva del primary si se omite
  typography: my-typography.$typography,      // opcional — formato plano: ver abajo
  density:    -4,                             // opcional — 0 | -1 | -2 | -3 | -4 | -5 (default -2)
));
```

El tema `oxygen` incluido en el framework usa `$density: -4` por defecto
(look compacto). Para formas más aireadas o más compactas, pásale otro valor.

> **Altura de botones**: la altura de los botones es de 40 px en escala 0 (Material por defecto) y 32 px para las escalas −1 a −5 (fijado por Ontimize). Si necesitas un valor diferente en un scope concreto, sobrescribe el token directamente:
>
> ```scss
> html { --mdc-filled-button-container-height: 40px; }    // global
> .my-toolbar { --mdc-outlined-button-container-height: 32px; }  // scope concreto
> ```

Formato del `$typography` (solo `font-family`; los tamaños heredan de los tokens M3 `--mat-sys-*`):

```scss
$typography: (
  font-family: 'Noto Sans, "Helvetica Neue", sans-serif',
);
```

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
| **Botones** | Estilos custom (borde, color, hover) | Altura 40 px en escala 0 (Material default), 32 px para escalas −1 a −5 vía tokens MDC; resto defaults de Angular Material |
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
$theme: ontimize-style.o-mat-light-theme((
  primary: mat.$azure-palette,
  density: -4,
));

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

Angular Material define los tokens de densidad en `@angular/material/core/tokens/_density.scss` como listas indexadas por escala.

Ontimize exporta `ontimize-theme-density-extended($scale)` (usado internamente por `ontimize-theme-styles`) que añade overrides de altura de botones para las escalas −1 a −5.

| Token | escala 0 | -1 | -2 (default) | -3 | -4 | -5 |
|---|---|---|---|---|---|---|
| `--mdc-*-button-container-height` | 40px (Mat) | **32px** | **32px** | **32px** | **32px** | **32px** |

Notas:
- **Altura de botones**: Material gestiona `--mdc-*-button-container-height` nativamente para la escala 0 (40 px). Ontimize fija el valor a 32 px para todas las escalas −1 a −5 mediante `$_extended-density-tokens`. Si necesitas un valor diferente, sobrescribe el token directamente en el scope que corresponda.

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

El framework 18.0.0-next.2 emite tokens **Material 3 nativos** (`--mat-sys-*`, `--mdc-*`) y tokens custom de Ontimize (`--o-*` para superficies, foreground, typography y sizing). **Tu SCSS custom debería consumir esos tokens en vez de llamar a `mat.m2-*` en tiempo de build.**

| Necesitas… | Usa… |
|---|---|
| Color primary | `var(--mat-sys-primary)` (texto/icono encima: `var(--mat-sys-on-primary)`) |
| Tinte primary (containers) | `var(--mat-sys-primary-container)` (texto: `var(--mat-sys-on-primary-container)`) |
| Color accent (M3 = tertiary) | `var(--mat-sys-tertiary)` / `var(--mat-sys-on-tertiary)` |
| Color warn (M3 = error) | `var(--mat-sys-error)` / `var(--mat-sys-on-error)` |
| Foreground (texto, iconos, dividers) | `var(--o-fg-text)`, `var(--o-fg-secondary-text)`, `var(--o-fg-icon)`, `var(--o-fg-divider)`, `var(--o-fg-hint)`, `var(--o-fg-disabled)` |
| Background de superficie / niveles | `var(--o-bg-card)`, `var(--o-bg-background)`, `var(--o-bg-level-0…1)`, `var(--o-bg-status-bar)` |
| Font-size / weight / line-height | `var(--mat-sys-body-medium-size)`, `var(--mat-sys-body-medium-weight)`, `var(--mat-sys-body-medium-line-height)`, `var(--o-font-family)` |

Ejemplo (antes vs después):

```scss
// Antes (M2)
.my-button {
  color: mat.m2-get-color-from-palette($primary, 500);
  font-size: mat.m2-font-size($typography, body-2);
}

// Después (M3-ready, runtime-overridable)
.my-button {
  color: var(--mat-sys-primary);
  font-size: var(--mat-sys-body-small-size);
}
```

> **Importante**: en 18.0.0-next.2 los tokens `--o-primary-*`, `--o-accent-*`, `--o-warn-*` (y sus `-contrast-*`) **ya no se emiten**. Si tu SCSS los referenciaba, migra a los `--mat-sys-*` (tabla de equivalencias en la sección 11).

Ontimize Web NGX 18.0.0-next.2 aplica theming Material 3 nativo: `mat.define-theme()` se construye con la paleta declarada por la app (paleta predefinida `mat.$azure-palette` etc., o paleta custom generada por `ng generate @angular/material:m3-theme`), por lo que **todos** los tokens `--mdc-*` / `--mat-sys-*` reflejan automáticamente el color de marca del consumer.

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
    por var(--mat-sys-primary)/var(--o-fg-*)/var(--o-font-*)
[ ] Si vienes de 18.0.0-next.1: migrar firma del factory a M3 (mapa-config) y
    sustituir --o-primary-*/--o-accent-*/--o-warn-* por --mat-sys-* (sección 11)
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

**Solución**: usa los tokens M3 que Material emite en runtime:

```scss
// Antes
.my-class { font-size: mat.m2-font-size($typography, body-2); }
// Después
.my-class { font-size: var(--mat-sys-body-small-size); }
```

### `mat-toolbar color="primary"` / `mat-icon color="accent"` no aplica color

**Causa**: Angular Material 18 usa un theme M3 internamente. El mixin `toolbar.color()` de Material solo emite los selectores `.mat-primary`/`.mat-accent`/`.mat-warn` cuando el tema es M2 (`get-theme-version == 0`). Con M3 esos selectores no se generan.

El mismo problema afecta en menor medida a `mat-icon`, `mat-progress-bar` y `mat-progress-spinner` — aunque para estos `mat.color-variants-backwards-compatibility()` sí los cubre.

**Solución**: el framework lo gestiona internamente desde la versión 18.0.0. No es necesario hacer nada en el consumer. Si en un addon propio tienes este problema, añade en tu theming:

```scss
// Restaura color="primary|accent|warn" en mat-toolbar con M3 theme
.mat-toolbar {
  &.mat-primary {
    --mat-toolbar-container-background-color: var(--mat-sys-primary);
    --mat-toolbar-container-text-color: var(--mat-sys-on-primary);
  }
  &.mat-accent {
    --mat-toolbar-container-background-color: var(--mat-sys-tertiary);
    --mat-toolbar-container-text-color: var(--mat-sys-on-tertiary);
  }
  &.mat-warn {
    --mat-toolbar-container-background-color: var(--mat-sys-error);
    --mat-toolbar-container-text-color: var(--mat-sys-on-error);
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

---

## 12. Migración a Material 3 nativo (desde 18.0.0-next.1) {#migracion-a-material-3-nativo-desde-18-0-0-next-1}

La versión `18.0.0-next.2` cambia la API de theming a Material 3 nativo. Si vienes de `18.0.0-next.1` (todavía API M2), aplica estos cambios.

### 12.1 Reescribir el factory en `styles.scss` / `app.scss`

**Antes (`18.0.0-next.1`):**
```scss
@use '@angular/material' as mat;
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;

$mat-custom-primary: ( 50: #..., 100: #..., 500: #1976d2, /* ... */ );
$primary: mat.m2-define-palette($mat-custom-primary);
$accent:  mat.m2-define-palette($mat-custom-primary);

$theme: ontimize-style.o-mat-light-theme($primary, $accent, $warn, $typography, -2);
```

**Después (`18.0.0-next.2`):**
```scss
@use '@angular/material' as mat;
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;

// Opción A — paleta Material 3 predefinida (la más rápida)
$theme: ontimize-style.o-mat-light-theme((
  primary:    mat.$azure-palette,
  tertiary:   mat.$blue-palette,           // opcional
  typography: $typography,
  density:    -2,
));

// Opción B — paleta M3 custom generada con el CLI de Angular Material
//   ng generate @angular/material:m3-theme
//   (genera un fichero .scss con la paleta como mapa Sass partiendo de un HEX seed)
@use './m3-theme' as m3;

$theme: ontimize-style.o-mat-light-theme((
  primary: m3.$primary-palette,
  density: -2,
));
```

> Ver [sección 3.1 → Cómo crear una paleta Material 3](#cómo-crear-una-paleta-material-3) para los detalles de cada opción y la lista completa de paletas predefinidas.

Cambios clave:
- Argumentos posicionales → mapa de configuración M3
- `$accent` desaparece — usa `tertiary` (rol M3)
- `$warn` desaparece — Material lo deriva como `error` automáticamente
- Las paletas M2 (`mat.m2-define-palette`) ya **no se aceptan** — pasa una paleta M3 (predefinida o generada por el CLI)

### 12.2 Reemplazar `--o-primary-*`, `--o-accent-*`, `--o-warn-*` en SCSS custom

Estos tokens **ya no se emiten**. Migra a los tokens M3 sys:

| Token eliminado | Token M3 equivalente |
|---|---|
| `--o-primary-500` | `--mat-sys-primary` |
| `--o-primary-contrast-500` | `--mat-sys-on-primary` |
| `--o-primary-50` / `-100` (tints) | `--mat-sys-primary-container` o `color-mix(in srgb, var(--mat-sys-primary) X%, transparent)` |
| `--o-primary-800` / `-900` | `--mat-sys-on-primary-container` |
| `--o-primary-A100` / `A200` | `color-mix(in srgb, var(--mat-sys-primary) X%, transparent)` |
| `--o-accent-500` | `--mat-sys-tertiary` |
| `--o-accent-contrast-500` | `--mat-sys-on-tertiary` |
| `--o-accent-100` | `--mat-sys-tertiary-container` |
| `--o-accent-800` | `--mat-sys-on-tertiary-container` |
| `--o-warn-500` | `--mat-sys-error` |
| `--o-warn-contrast-500` | `--mat-sys-on-error` |

Los demás tokens `--o-*` (`--o-bg-*`, `--o-fg-*`, `--o-font-family`, `--o-input-icon-size`) **no cambian**.

### 12.3 Por qué este breaking change

En `18.0.0-next.1`, el theme M3 interno se construía con paletas Material hardcoded (`mat.$azure-palette` + `mat.$blue-palette`) que **no reflejaban el color de marca del consumer**. Esto causaba que tokens MDC como `--mdc-filled-button-container-color` (botones filled) o el color de los sliders, checkboxes, ripples, etc. saliera siempre en azul Material por defecto, ignorando la paleta del consumer.

Adoptar la firma M3 nativa permite que el theme sí use la paleta del consumer, así que **todos los componentes Material toman automáticamente el color de marca correcto** — sin necesidad de overrides manuales en cada componente.

---

## 13. Migrar formularios con inputs HTML nativos a componentes Ontimize (sin o-form)

Esta sección cubre la migración de formularios que usan inputs HTML nativos (`<input>`, `<select>`) a sus equivalentes Ontimize sin necesidad de `<o-form>`. El patrón de binding cambia de `[value]`+evento nativo a `[(ngModel)]`+`(onChange)`.

### 13.1 Tabla de equivalencias rápida

| HTML nativo | Componente Ontimize | Notas |
|---|---|---|
| `<input type="text">` | `<o-text-input>` | |
| `<input type="number">` | `<o-integer-input>` / `<o-real-input>` | |
| `<input type="date">` | `<o-date-input>` | añadir `value-type="string"` si el valor es ISO string |
| `<select>` con opciones estáticas | `<o-combo>` con `[static-data]` | los datos deben ser array de objetos |
| `<select>` con búsqueda custom | `<o-combo>` | la búsqueda interna sustituye el panel custom |
| `<div>` readonly / calculado | `<o-text-input read-only="yes">` | |
| `<select disabled>` derivado | `<o-text-input read-only="yes">` | |

### 13.2 Cambios de binding

#### Antes: `[value]` + evento nativo

```html
<input
  type="text"
  [value]="serialNumber"
  (input)="onSerialNumberChange($any($event.target).value)"
/>
```

#### Después: `[(ngModel)]` + `(onChange)`

```html
<o-text-input
  label="Nº de serie"
  [(ngModel)]="serialNumber"
  (onChange)="onSerialNumberChange($event.newValue)"
  required="yes"
  max-length="100"
></o-text-input>
```

El evento `(onChange)` recibe un objeto `{ newValue, oldValue }`. Si solo necesitas el nuevo valor:

```typescript
// antes
onSerialNumberChange(value: string) { ... }

// después
onSerialNumberChange(event: { newValue: string }) {
  const value = event.newValue;
  ...
}
// o destructurando
onSerialNumberChange({ newValue }: { newValue: string }) { ... }
```

### 13.3 Input de texto (`o-text-input`)

```html
<!-- ANTES -->
<div class="field-group">
  <label>Nº de Serie <span class="required-star"> *</span></label>
  <input
    type="text"
    [class.input--error]="!!serialNumberError"
    maxlength="100"
    [placeholder]="'PLACEHOLDER' | oTranslate"
    [value]="serialNumber"
    (input)="onSerialNumberChange($any($event.target).value)"
  />
  @if (serialNumberError) {
    <div class="field-error">{{ serialNumberError | oTranslate }}</div>
  }
</div>

<!-- DESPUÉS -->
<o-text-input
  label="EQUIPMENT_SERIAL_NUMBER"
  [(ngModel)]="serialNumber"
  (onChange)="onSerialNumberChange($event.newValue)"
  required="yes"
  max-length="100"
  placeholder="EQUIPMENT_SERIAL_NUMBER_PLACEHOLDER"
></o-text-input>
```

> La etiqueta, el asterisco de requerido y los mensajes de error los gestiona el propio componente. Elimina el `<label>`, el `<div class="field-error">` y la lógica de `serialNumberError`.

### 13.4 Select con opciones de string (`o-combo`)

`o-combo` requiere un array de objetos. Transforma el array de strings en el componente:

```typescript
// ANTES: array de strings
manufacturers: string[] = ['Petzl', '3M', 'Honeywell'];
selectedManufacturer = '';

onManufacturerChange(value: string) {
  this.selectedManufacturer = value;
  this.filterModels();
}

// DESPUÉS: getter que envuelve los strings
get manufacturersData() {
  return this.manufacturers.map(m => ({ value: m, label: m }));
}

onManufacturerChange({ newValue }: { newValue: string }) {
  this.selectedManufacturer = newValue;
  this.filterModels();
}
```

```html
<!-- ANTES -->
<select
  [value]="selectedManufacturer"
  (change)="onManufacturerChange($any($event.target).value)"
>
  <option value="">{{ 'EQUIPMENT_MANUFACTURER_ALL' | oTranslate }}</option>
  @for (m of manufacturers; track m) {
    <option [value]="m">{{ m }}</option>
  }
</select>

<!-- DESPUÉS -->
<o-combo
  label="manufacturer"
  columns="value;label"
  value-column="value"
  visible-columns="label"
  [static-data]="manufacturersData"
  [(ngModel)]="selectedManufacturer"
  (onChange)="onManufacturerChange($event)"
  empty-option="yes"
></o-combo>
```

`empty-option="yes"` añade automáticamente la opción vacía equivalente al `<option value="">`.

### 13.5 Select con búsqueda custom (`o-combo` con filtro)

El panel de búsqueda custom (botón trigger + input + lista de opciones) se reemplaza completamente por `o-combo`, que incluye búsqueda interna:

```html
<!-- ANTES: panel custom con búsqueda manual -->
<div class="search-select">
  <button (click)="toggleModelDropdown()">
    {{ selectedModelName || ('PLACEHOLDER' | oTranslate) }}
    <mat-icon>expand_more</mat-icon>
  </button>
  @if (isModelDropdownOpen) {
    <div class="select-panel">
      <input [value]="modelSearch" (input)="onModelSearch($event.target.value)" />
      @for (model of filteredModels; track model) {
        <button (click)="selectModel(model.id)">{{ model.name }}</button>
      }
    </div>
  }
</div>

<!-- DESPUÉS: o-combo con búsqueda integrada -->
<o-combo
  label="MODEL"
  columns="id;name"
  value-column="id"
  visible-columns="name"
  [static-data]="models"
  [(ngModel)]="selectedModelId"
  (onChange)="onModelChange($event.newValue)"
  required="yes"
  filter-case-sensitive="no"
></o-combo>
```

Elimina del componente: `isModelDropdownOpen`, `modelSearch`, `filteredModels`, `toggleModelDropdown()`, `onModelSearch()`.

### 13.6 Input de fecha (`o-date-input`)

```html
<!-- ANTES -->
<input
  type="date"
  [class.input--error]="!!manufacturingDateError"
  [max]="todayISO"
  [value]="manufacturingDate"
  (change)="onManufacturingDateChange($any($event.target).value)"
/>

<!-- DESPUÉS -->
<o-date-input
  label="EQUIPMENT_MANUFACTURING_DATE"
  [(ngModel)]="manufacturingDate"
  (onChange)="onManufacturingDateChange($event.newValue)"
  value-type="string"
  [max]="todayDate"
  required="yes"
></o-date-input>
```

> `value-type="string"` indica que el valor enlazado es un string ISO (`"2024-03-15"`). Si el modelo usa objetos `Date`, omite el atributo o usa `value-type="date"`.
> El atributo `[max]` en `o-date-input` acepta un objeto `Date`, no un string ISO — ajusta el tipo en el componente:

```typescript
// antes
todayISO = new Date().toISOString().split('T')[0]; // "2024-03-15"

// después
todayDate = new Date();
```

### 13.7 Campos calculados / readonly

Los campos derivados (calculados, no editables) se sustituyen por `o-text-input` con `read-only="yes"`:

```html
<!-- ANTES: div con formato manual -->
<div class="readonly-field">
  {{ expirationDate ? formatDisplayDate(expirationDate) : ('PLACEHOLDER' | oTranslate) }}
</div>

<!-- DESPUÉS -->
<o-text-input
  label="EQUIPMENT_EXPIRATION_DATE"
  [value]="expirationDate"
  read-only="yes"
></o-text-input>
```

> `o-date-input` también acepta `read-only="yes"` si quieres mostrar el valor con formato de fecha.

Los selects deshabilitados/derivados siguen el mismo patrón:

```html
<!-- ANTES: select disabled con una sola opción -->
<select [attr.disabled]="!maintenanceTemplateName ? '' : null">
  <option>{{ maintenanceTemplateName || ('PLACEHOLDER' | oTranslate) }}</option>
</select>

<!-- DESPUÉS -->
<o-text-input
  label="maintenanceTemplate"
  [value]="maintenanceTemplateName"
  read-only="yes"
></o-text-input>
```

### 13.8 Validación y errores

Con inputs HTML nativos la validación es manual (variables `xError`, div de error, clase CSS de error). Los componentes Ontimize gestionan esto automáticamente cuando se usan con `required="yes"` o `[(ngModel)]` con validators de Angular:

```typescript
// ANTES: validación manual
serialNumberError = '';

validate(): boolean {
  if (!this.serialNumber) {
    this.serialNumberError = 'SERIAL_NUMBER_REQUIRED';
    return false;
  }
  this.serialNumberError = '';
  return true;
}

// DESPUÉS: validación Angular + ReactiveFormsModule (opcional)
import { NgModel } from '@angular/forms';

@ViewChild('serialInput') serialInput!: NgModel;

validate(): boolean {
  // el componente marca el estado invalid automáticamente
  return this.serialInput.valid;
}
```

O con `ReactiveFormsModule`:

```typescript
form = new FormGroup({
  serialNumber: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  manufacturingDate: new FormControl('', Validators.required),
  modelId: new FormControl(null, Validators.required),
});

onSave() {
  if (this.form.invalid) return;
  const { serialNumber, manufacturingDate, modelId } = this.form.value;
  // ...
}
```

```html
<o-text-input
  formControlName="serialNumber"
  label="EQUIPMENT_SERIAL_NUMBER"
  required="yes"
></o-text-input>
```

### 13.9 Checklist de migración

- [ ] Reemplazar cada `<input type="text">` por `<o-text-input>`
- [ ] Reemplazar cada `<input type="date">` por `<o-date-input value-type="string">`
- [ ] Reemplazar cada `<select>` por `<o-combo>` con `[static-data]` (transformar strings a objetos)
- [ ] Cambiar `[value]="x" (input/change)="f($event.target.value)"` → `[(ngModel)]="x" (onChange)="f($event.newValue)"`
- [ ] Cambiar `[max]="todayISO"` (string) a `[max]="todayDate"` (Date) en date inputs
- [ ] Eliminar `<label>`, asteriscos de required y `<div class="field-error">` — los gestiona el componente
- [ ] Sustituir divs readonly y selects disabled por `<o-text-input read-only="yes">`
- [ ] Eliminar lógica de validación manual si se usa `required="yes"` + `NgModel` o `FormGroup`
- [ ] Eliminar panel de búsqueda custom si se migra a `o-combo` con `filter-case-sensitive="no"`

---

## 14. Clear SaSS — superficies neutras, scrollbar y paleta neutral (desde 18.0.0-next.4)

Esta versión introduce tres mejoras de theming opcionales agrupadas bajo el nombre **Clear SaSS**: superficies sin tinte de color primario, scrollbar con thumb en color de marca, y niveles de superficie derivados de la paleta neutral.

### 14.1 Activar el mixin `ontimize-neutral-surfaces`

Por defecto, Material 3 aplica un tinte del color primario a las superficies elevadas (tarjetas, menús, drawers…). El nuevo mixin `ontimize-neutral-surfaces` desactiva ese tinte y ajusta varios tokens para un aspecto limpio y neutral.

Llama al mixin **después** de `ontimize-theme-styles()` en tu `styles.scss` / `app.scss`:

```scss
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;

// Tema claro
html {
  @include ontimize-style.ontimize-theme-styles($theme);
  @include ontimize-style.ontimize-neutral-surfaces($theme); // ← añadir
}

// Tema oscuro
html.o-dark {
  @include ontimize-style.ontimize-theme-styles($dark-theme);
  @include ontimize-style.ontimize-neutral-surfaces($dark-theme); // ← añadir
}
```

El mixin aplica los siguientes cambios:

| Token | Valor | Efecto |
|---|---|---|
| `--mat-sys-surface-tint` | `transparent` | Elimina el tinte primario en superficies elevadas |
| `--mdc-elevated-card-container-elevation` | `0` | Tarjetas planas sin sombra |
| `--mdc-slider-inactive-track-color` | nivel-08 de la paleta neutral | Track inactivo del slider visible sin tinte primario |
| `--mat-sys-outline-variant` | divider del foreground (opacidad, sin color) | Bordes y divisores neutros |
| `--mat-sys-outline` | `var(--mat-sys-outline-variant)` | Chips, expansion panels, switches, steppers, button toggles alineados con el resto de bordes neutros (desde 18.0.0-next.5) |
| `--mat-sys-background` | nivel-0 de la paleta neutral | Fondo de la aplicación desde la paleta |
| `--mdc-outlined-text-field-outline-color` | `var(--mat-sys-outline-variant)` | Borde de los inputs outline alineado con dividers (desde 18.0.0-next.5) |
| `--mdc-filled-text-field-active-indicator-color` | `var(--mat-sys-outline-variant)` | Indicador inferior de los inputs fill alineado con dividers (desde 18.0.0-next.5) |

Adicionalmente, `o-apply-tokens` (mixin obligatorio, llamado por `ontimize-theme-styles`) atenúa los placeholders de los inputs vía `--o-fg-hint`:

| Token | Valor | Efecto |
|---|---|---|
| `--mdc-filled-text-field-input-text-placeholder-color` | `var(--o-fg-hint)` | Placeholder filled con opacidad 38% (claro/oscuro auto) |
| `--mdc-outlined-text-field-input-text-placeholder-color` | `var(--o-fg-hint)` | Placeholder outline con opacidad 38% (claro/oscuro auto) |

> Para personalizar todos los hints/placeholders a la vez, sobreescribe `--o-fg-hint` en el selector raíz de tu tema.

### 14.2 Scrollbar con color de marca

La implementación global del scrollbar usa el token `--o-scroll-thumb`. Este token se compila en tiempo de build SCSS a un valor `rgba()` estático usando el color primario al 30% de opacidad.

> **Por qué estático**: Los pseudo-elementos `::-webkit-scrollbar-*` no heredan CSS custom properties en tiempo de ejecución. El valor de `--mat-sys-primary` no está disponible en ese contexto, por lo que el color se resuelve en build con `mat.get-theme-color()`.

El scrollbar claro/oscuro se obtiene automáticamente porque el tema oscuro usa el tono 80 de la paleta primaria (más claro), mientras el tema claro usa el tono 40.

#### Personalizar el color del scrollbar

Si necesitas un color diferente, sobreescribe el token en tu fichero de estilos:

```scss
// En el selector donde aplicas el tema (e.g. html o :root)
html {
  @include ontimize-style.ontimize-theme-styles($theme);
  --o-scroll-thumb: rgba(0, 0, 0, 0.2); // ← valor custom
}
```

### 14.3 Pasar la paleta neutral en temas custom

Si defines un tema propio con `o-mat-light-theme` / `o-mat-dark-theme`, pasa la paleta neutral para que los niveles de superficie se deriven de ella en lugar de usar valores hexadecimales fijos:

```scss
$theme: ontimize-style.o-mat-light-theme((
  primary:  $_primary,
  tertiary: $_tertiary,
  neutral:  map.get($_palettes, neutral), // ← añadir
  density:  -4,
));

$dark-theme: ontimize-style.o-mat-dark-theme((
  primary:  $_primary,
  tertiary: $_tertiary,
  neutral:  map.get($_palettes, neutral), // ← añadir
  density:  -4,
));
```

La paleta neutral debe incluir los tonos que se corresponden con los niveles de superficie:

| Tono | Nivel | Tema |
|---|---|---|
| `97` | `level-0` / background | claro |
| `96` | `level-04` | claro |
| `93` | `level-06` | claro |
| `85` | `level-08` | claro |
| `100` | `level-1` / card | claro |
| `13` | `level-0` / background | oscuro |
| `19` | `level-04` | oscuro |
| `20` | `level-06` | oscuro |
| `24` | `level-08` | oscuro |
| `15` | `level-1` / card | oscuro |

Si la paleta no incluye alguno de estos tonos, las funciones de background usan los valores hexadecimales predeterminados como fallback.

---

## 15. Nuevas features en `o-form` (desde 18.0.0-next.5)

### 15.1 Capturar errores de insert / update / delete

`OFormComponent` expone tres nuevos outputs que se emiten cuando la operación de persistencia falla, complementando a los ya existentes `onInsert` / `onUpdate` / `onDelete` (que solo emiten en caso de éxito):

| Output | Cuándo se emite |
|---|---|
| `onInsertError` | El insert falla |
| `onUpdateError` | El update falla |
| `onDeleteError` | El delete falla |

Los tres emiten el error en bruto (`any`): puede ser un `string` con el mensaje de negocio devuelto por el backend, un `HttpErrorResponse` de Angular para errores de red/servidor, o un `ServiceResponse` con `isSuccessful() === false`.

El diálogo de error por defecto del framework actúa como **fallback**: solo se muestra cuando **no hay ningún listener** suscrito al evento correspondiente (se comprueba con `EventEmitter.observed`). Así:

- Si **no te suscribes** → comportamiento idéntico a 15.x (se muestra el diálogo).
- Si **te suscribes** → la UI de error la controlas tú al 100%; el diálogo del framework no aparece. Esto evita feedback duplicado (diálogo + tu snack-bar/UI custom).

```html
<o-form entity="customers"
        keys="CUSTOMERID"
        (onInsertError)="onInsertError($event)"
        (onUpdateError)="onUpdateError($event)">
  <o-text attr="NAME"></o-text>
  <o-text attr="EMAIL"></o-text>
</o-form>
```

```typescript
import { HttpErrorResponse } from '@angular/common/http';

onInsertError(err: any) {
  if (err instanceof HttpErrorResponse) {
    this.snackBar.open(`Error ${err.status}: ${err.message}`, 'OK');
  } else {
    // string de negocio del backend
    this.snackBar.open(err, 'OK');
  }
}
```

### 15.2 Inyectar payload extra antes de insert / update

El evento `onBeforeInsert` / `onBeforeUpdate` (ya existente en 15.x) se emite **síncronamente** con el objeto `values` que se va a enviar al backend, pasado por referencia. Mutando el objeto en el handler puedes inyectar campos de auditoría, contexto de sesión, etc., sin tener que crear componentes ocultos ni sobrescribir el form:

```html
<o-form (onBeforeInsert)="inject($event)" (onBeforeUpdate)="inject($event)">
  ...
</o-form>
```

```typescript
inject(values: any) {
  values.TENANT_ID  = this.auth.tenantId;
  values.AUDIT_USER = this.auth.userId;
  values.AUDIT_TS   = new Date().toISOString();
}
```

> **Importante**: hay que **mutar** la referencia recibida (`values.X = ...` o `Object.assign(values, {...})`), no reasignarla (`values = {...values, X}` no funciona — la reasignación es local al handler).

Limitaciones: no se puede asociar un `sqlType` a los campos inyectados por esta vía, ni cancelar la operación desde el handler. Si necesitas alguna de las dos cosas, hereda y sobrescribe `getAttributesValuesToInsert` / `getAttributesSQLTypes`.

### 15.3 Controlar la visibilidad del botón "atrás" con `show-back-button`

Hasta ahora el botón atrás del toolbar solo aparecía cuando el form se renderizaba como detalle (parámetro de navegación `isdetail=true`). El nuevo input `show-back-button` permite controlar su visibilidad de forma declarativa.

| Valor | Comportamiento |
|---|---|
| *(omitido)* o `'auto'` | Visible cuando `isDetail === true` (**comportamiento por defecto, idéntico a 15.x**) |
| `'yes'` / `'true'` / `'all'` | Siempre visible |
| `'no'` / `'false'` | Nunca visible |
| Lista de modos separados por `;` con los códigos `R` (INITIAL), `I` (INSERT), `U` (UPDATE) | Visible solo cuando el form está en alguno de los modos listados |

Los códigos siguen el mismo vocabulario que `header-actions` para mantener coherencia (`R` = visualizar registro, `I` = insertar, `U` = actualizar).

```html
<!-- Como en 15.x: visible solo cuando es detalle -->
<o-form>...</o-form>

<!-- Siempre visible -->
<o-form show-back-button="yes">...</o-form>

<!-- Nunca visible -->
<o-form show-back-button="no">...</o-form>

<!-- Solo durante edición/creación -->
<o-form show-back-button="I;U">...</o-form>

<!-- Solo cuando se está visualizando un registro -->
<o-form show-back-button="R">...</o-form>
```

El input se propaga internamente al `o-form-toolbar`. No requiere cambios en los formularios existentes.

---

## 16. Nuevas features y fixes standalone (desde 18.0.0-next.6)

### 16.1 `initial-filter-function` en componentes de selección

Los componentes que extienden `OFormServiceComponent` (`o-combo`, `o-listpicker`, `o-radio`, etc.) admiten ahora el input `initial-filter-function`, que ya existía en tabla, lista y grid. Acepta una función `() => { [key: string]: any }` cuyo resultado se fusiona con el filtro de la consulta en cada petición de datos, tras la resolución de `parent-keys`.

```html
<o-combo attr="COUNTRY"
         entity="countries"
         value-column="ID"
         columns="ID;NAME"
         [initial-filter-function]="activeCountriesFilter">
</o-combo>
```

```typescript
activeCountriesFilter = () => ({ ACTIVE: 1 });
```

### 16.2 Fixes de inyección en componentes standalone

Los siguientes errores de `NullInjectorError` se producían al usar los componentes como standalone (sin importar los módulos legacy ya deprecados). Están corregidos en `18.0.0-next.6` y no requieren ningún cambio en el código de la aplicación.

| Componente | Token que fallaba | Causa |
|---|---|---|
| `o-form` (standalone) | `CanDeactivateFormGuard` | El guard solo estaba declarado en el deprecado `OFormModule` |
| `o-date-input` (standalone) | `MAT_DATE_FORMATS` | Solo se proporcionaba `DateAdapter`; `MatDatepickerInput` requiere ambos tokens |
| `OTableFilterByColumnDataDialogComponent` | `OTableFilterByColumnService` | `MatDialog` crea los diálogos bajo el inyector de la aplicación, no el de `OTableComponent` |

## 17. Cambios en `o-form` (desde 18.0.0-next.7)

### 17.1 Hooks `postCorrectQuery` / `postIncorrectQuery` y payload de `onLoadError`

El manejo de la respuesta de la consulta (`queryData`) se ha extraído a dos métodos `protected` sobrescribibles, alineándolo con el patrón ya existente para insert/update/delete (`postCorrectInsert` / `postIncorrectInsert`, etc.):

| Método | Cuándo se invoca |
|---|---|
| `postCorrectQuery(data)` | La consulta tiene éxito (por defecto llama a `setData(data)`) |
| `postIncorrectQuery(result)` | La consulta falla (respuesta no exitosa o error HTTP) |

Las subclases de `OFormComponent` pueden ahora sobrescribir `postIncorrectQuery` para personalizar el comportamiento de error en la carga sin reescribir todo el método de consulta.

> ⚠️ **Breaking change**: el output `onLoadError` ahora emite **siempre el objeto en bruto** (un `ServiceResponse` con `isSuccessful() === false`, o un `HttpErrorResponse`), igual que `onInsertError` / `onUpdateError` / `onDeleteError`. Anteriormente, en la rama de respuesta no exitosa emitía únicamente el `string` del mensaje (`resp.message`). Si tienes un listener suscrito a `onLoadError` que esperaba un texto, adáptalo para extraer el mensaje del objeto:

```typescript
import { HttpErrorResponse } from '@angular/common/http';

onLoadError(err: any) {
  const msg = err instanceof HttpErrorResponse ? err.message
            : (err && err.message) ? err.message
            : err;
  this.snackBar.open(msg, 'OK');
}
```

Otros dos cambios de comportamiento en el manejo de errores de carga:

- **`onLoadError` y `queryFallbackFunction` ya no son excluyentes.** Antes, si había un listener suscrito a `onLoadError`, el `queryFallbackFunction` no llegaba a ejecutarse. Ahora ambos se ejecutan si están presentes (son mecanismos independientes: notificación declarativa vs. callback de gestión/recuperación). El diálogo de error por defecto sigue siendo el único *fallback* real: solo aparece cuando **ni** hay listener de `onLoadError` **ni** `queryFallbackFunction` definido.
- **`queryFallbackFunction` se aplica ahora a ambas ramas de error** (respuesta no exitosa y error HTTP); antes solo se invocaba para errores HTTP.

---

## 18. Jerarquía visual de acciones — `variant`, `importance` y `action-styles` (desde 18.0.0-next.7)

Un sistema unificado para describir las acciones (botones) de forma **semántica**, desacoplado del tipo de botón de Angular Material. En lugar de elegir `type="RAISED"` + `color="primary"` button a button, defines *qué importancia* tiene la acción y *qué forma* quieres, y el framework resuelve el resto — incluido resaltar automáticamente la acción de crear como acción primaria.

### 18.1 El modelo `OActionStyle`

```typescript
type OActionVariant   = 'outline' | 'flat' | 'basic' | 'raised' | 'icon' | 'fab' | 'mini-fab';
type OActionImportance = 'primary' | 'warn' | 'default';

interface OActionStyle {
  variant?: OActionVariant;     // forma del botón (default: 'outline')
  importance?: OActionImportance; // relevancia semántica (default: 'default')
}
```

- **`importance`** colorea la acción:
  - `primary` → `var(--mat-sys-primary)`
  - `warn` → `var(--mat-sys-error)`
  - `default` → foreground Ontimize (`var(--o-fg-text)` / `var(--o-fg-icon)`)
- **`variant`** mapea a la directiva de botón de Material: `outline` → `mat-stroked-button`, `flat` → `mat-flat-button`, `basic` → `mat-button`, `raised` → `mat-raised-button`, `icon` → `mat-icon-button`, `fab` / `mini-fab` → `mat-fab` / `mat-mini-fab`.

> **Dónde aplica el color la `importance`**: en las formas de contenedor claro/transparente (`outline`, `basic`, `icon` y el elevado `raised`) la importancia colorea el **texto y el icono**. En las formas rellenas (`flat`, `fab`, `mini-fab`) colorea el **contenedor** (vía la paleta de Material) y el texto se mantiene en su color legible sobre el fondo. Así un botón `flat` + `warn` sale con fondo de error y texto legible, no con texto de error sobre fondo claro.

### 18.2 `o-button`: nuevos inputs `variant` e `importance`

`o-button` gana dos inputs que sustituyen (sin romper) a `type` y `color`:

```html
<!-- Antes (sigue funcionando, pero deprecado) -->
<o-button type="RAISED" color="primary" label="Guardar"></o-button>

<!-- Ahora -->
<o-button variant="raised" importance="primary" label="Guardar"></o-button>
```

| Input deprecado | Nuevo input | Notas |
|---|---|---|
| `type="STROKED"` | `variant="outline"` | |
| `type="FLAT"` | `variant="flat"` | |
| `type="BASIC"` | `variant="basic"` | |
| `type="RAISED"` | `variant="raised"` | |
| `type="ICON"` | `variant="icon"` | |
| `type="FAB"` / `type="FAB-MINI"` | `variant="fab"` / `variant="mini-fab"` | |
| `color="primary"` | `importance="primary"` | |
| `color="warn"` | `importance="warn"` | |
| `color="accent"` | *(sin equivalente)* | `accent` no tiene equivalente de `importance`; sigue funcionando vía el input legacy `color` |

> `type` y `color` siguen operativos por compatibilidad. Si defines ambos, **gana el nuevo input** (`variant` / `importance`).

### 18.3 `action-styles` en los componentes host

`o-form`, `o-table`, `o-grid`, `o-list` y `o-tree` aceptan el input opcional `action-styles`: un `Record<string, OActionStyle>` indexado por el `attr` de la acción. Permite configurar la apariencia de los botones integrados **sin** envolverlos en `o-button`.

```html
<o-grid entity="customers"
        [action-styles]="{
          insert:  { variant: 'flat', importance: 'primary' },
          refresh: { variant: 'basic' },
          delete:  { importance: 'warn' }
        }">
  ...
</o-grid>
```

Las claves son el `attr` interno exacto de cada acción:

| Componente | Acciones integradas (`attr`) |
|---|---|
| `o-form` (toolbar) | `insert`, `update`, `edit`, `delete`, `refresh`, `undo`, `cancel` |
| `o-table` | `insert`, `refresh`, `delete`, … (un `o-table-button` resuelve por su propio `attr`) |
| `o-grid` / `o-list` | `insert`, `refresh`, `delete` |
| `o-tree` | `insert`, `refresh`, `delete` |

> El input acepta tanto un objeto como un string JSON: `[action-styles]="{ insert: { variant: 'flat' } }"` o `action-styles='{"insert":{"variant":"flat"}}'`.

### 18.4 Resolución del estilo y reglas automáticas

El estilo final de cada acción se resuelve con esta precedencia (util puro `resolveActionStyle`):

1. **Configuración explícita** en `action-styles` (por `attr`).
2. **Reglas automáticas** del componente.
3. **Default global**: `outline` + `default`.

Por defecto, **la acción de crear se resalta como la única acción primaria** automáticamente, sin configurar nada:

| Componente | Regla automática |
|---|---|
| `o-table` / `o-grid` / `o-list` / `o-tree` | la acción de crear (`insert` / `add` / `new`) → `importance: primary` |
| `o-form` | el botón de confirmar es primario en modo INSERT (`attr=insert`) y en modo UPDATE / editable-detail (`attr=update`) |

El resto de acciones (refresh, edit, delete…) quedan en `default`. Para cambiarlo, sobreescribe con `action-styles`:

```html
<!-- Quitar el resaltado primario del insert y marcar delete como warn -->
<o-list [action-styles]="{ insert: { importance: 'default' }, delete: { importance: 'warn' } }">
```

### 18.5 Botones custom proyectados — `OActionStyleProvider`

Un `o-button` (o un `o-table-button`) **proyectado dentro** de un `o-table` / `o-grid` / `o-list` / `o-tree` / `o-form` resuelve su estilo por su `attr` desde el host, a través del token DI `OActionStyleProvider`. Así un botón custom adopta automáticamente el `action-styles` del host sin configurarlo en cada botón:

```html
<o-table entity="invoices" [action-styles]="{ export: { variant: 'flat', importance: 'primary' } }">
  <o-table-button attr="export" icon="download" (onClick)="export()"></o-table-button>
  <!-- el botón export sale flat + primary sin más config -->
</o-table>
```

Un `variant` / `importance` explícito en el botón **siempre prevalece** sobre lo que diga el host.

### 18.6 Alcance del `variant` por componente

`importance` (color) aplica a **todas** las acciones integradas. `variant` (forma) aplica donde el botón puede cambiar de directiva Material:

| Dónde | `importance` | `variant` |
|---|---|---|
| `o-button` | ✅ | ✅ |
| `o-table-button` (tabla) | ✅ | ✅ |
| Toolbar de `o-list` / `o-grid` (modo texto, `show-buttons-text`) | ✅ | ✅ |
| Toolbar de `o-form` (modo texto, `show-header-actions-text`) | ✅ | ✅ |
| Botones integrados de `o-tree` | ✅ | — (siempre `outline`) |

> En modo solo-icono (`show-buttons-text="no"` en list/grid, `show-header-actions-text="no"` en el o-form) los botones de toolbar son siempre `mat-icon-button`; el `variant` aplica en modo texto y al FAB flotante de insert.

### 18.7 Clases CSS para casos avanzados

La importancia se materializa en tres clases compartidas (definidas en `o-button-theme.scss`), por si necesitas colorear un botón Material propio igual que los del framework:

```html
<button mat-stroked-button class="o-button--importance-primary">…</button>
<button mat-stroked-button class="o-button--importance-warn">…</button>
<button mat-stroked-button class="o-button--importance-default">…</button>
```

> **Renombrado en 18.0.0-next.9**: estas clases se llamaban `o-action--importance-{primary,warn,default}` hasta `next.8` y ahora son `o-button--importance-{primary,warn,default}`. Si en tu CSS/HTML referenciabas las antiguas, renómbralas. La clase `o-action--filled-default` (acción `flat` + `default`, ver 18.9) **no** cambia.

> Si en v15 usabas clases como `o-button-primary`, `o-button-danger` o `o-button-default` en botones de diálogos/custom, migra a `o-button--importance-primary` / `o-button--importance-warn` / `o-button--importance-default` respectivamente.

### 18.8 Configuración global de toda la app (`O_ACTION_STYLES_CONFIG`)

En lugar de repetir `[action-styles]` en cada componente, puedes fijar los defaults **una sola vez** para toda la aplicación mediante un injection token. Útil para branding/consistencia.

```typescript
import { provideOntimizeWeb, provideOActionStyles } from 'ontimize-web-ngx';

bootstrapApplication(AppComponent, {
  providers: [
    provideOntimizeWeb(CONFIG),
    provideOActionStyles({
      // baseline para TODAS las acciones (sustituye outline + default)
      default: { variant: 'flat' },
      // overrides por attr, en toda la app
      actions: {
        insert: { variant: 'flat', importance: 'primary' },
        delete: { importance: 'warn' }
      }
    }),
  ]
});
```

En un `AppModule` (NgModule) es idéntico, dentro de `providers: [ provideOActionStyles({ … }) ]`. Si prefieres no usar el helper, provee el token directamente:

```typescript
import { O_ACTION_STYLES_CONFIG } from 'ontimize-web-ngx';

{ provide: O_ACTION_STYLES_CONFIG, useValue: { actions: { insert: { variant: 'flat' } } } }
```

| Clave | Efecto |
|---|---|
| `default` | Estilo base aplicado a **todas** las acciones cuando nada más lo define (p. ej. `{ variant: 'flat' }` deja todos los botones flat). |
| `actions[attr]` | Default **por acción** en toda la app (p. ej. todos los `insert` flat, todos los `delete` warn). |

**Precedencia completa** (de mayor a menor), resuelta campo a campo:

| Nivel | Fuente |
|---|---|
| 1 | `[action-styles]` de la instancia (template) |
| 2 | token `actions[attr]` (app-wide por attr) |
| 3 | auto-reglas del componente (la acción de crear → `primary`) |
| 4 | token `default` (baseline app-wide) |
| 5 | default del framework (`outline + default`) |

Así, el `[action-styles]` de un componente concreto **siempre gana** sobre el token para esa instancia; el token por-attr (nivel 2) puede sobreescribir incluso el resaltado primario automático del botón crear; y el `default` del token (nivel 4) no pisa ese resaltado automático (queda por debajo de las auto-reglas).

> El equivalente global exacto de `[action-styles]="{ insert: { variant: 'flat' } }"` puesto en un componente es `provideOActionStyles({ actions: { insert: { variant: 'flat' } } })`. Usa `default` solo si quieres que el variant/importance aplique a **todas** las acciones, no solo al insert.

### 18.9 Acción `flat` + `default`: botón sólido neutro (y cómo recolorearlo)

En Material 3, un botón relleno (`mat-flat-button`) sin color toma por defecto el tono **primary**. Para que una acción `flat` con `importance: default` no parezca primaria, el framework la pinta como un **botón sólido neutro oscuro** (carbón `#2C2A29` con texto/icono blanco) mediante la clase `.o-action--filled-default`, y lo mantiene **oscuro tanto en claro como en oscuro** (un token adaptativo como `inverse-surface` se invertiría a claro en dark mode).

Solo se neutraliza `flat`. Las variantes `fab` / `mini-fab` —incluido el FAB flotante de insert de `o-list` / `o-grid`— **mantienen el fondo por defecto de Material**.

**Personalizar el color** (p. ej. al neutro de tu marca): usa los tokens de indirección en `:root`, **no** `--mdc-filled-button-container-color` directamente:

```scss
:root {
  --o-action-filled-default-bg: #1b1b1b;   // contenedor
  --o-action-filled-default-fg: #ffffff;   // texto + icono
}
```

> **Por qué los tokens de indirección y no el token MDC directo**: el tema oscuro re-emite `.o-action--filled-default` bajo `.o-dark` (especificidad `0,2,0`), así que un `.o-action--filled-default { --mdc-filled-button-container-color: … }` (`0,1,0`) perdería en dark mode. Los tokens `--o-action-filled-default-bg/-fg`, definidos en `:root` y heredados, se resuelven igual en ambos modos.

> Esto aplica a `flat` + `default` en `o-button`, `o-table-button` y las toolbars de `o-form` / `o-list` / `o-grid`. Para `flat` + `primary` / `warn` el color va al contenedor vía la paleta de Material (`[color]`), no por estos tokens.

---

## 19. Cambios y fixes (desde 18.0.0-next.8)

### 19.1 Renombrado de clases de importancia (`o-button--importance-*`) — **breaking**

En `18.0.0-next.9` las clases compartidas de importancia se renombraron de `o-action--importance-{primary,warn,default}` a `o-button--importance-{primary,warn,default}`. Afecta a `o-button`, `o-table-button`, la toolbar de `o-form`, `o-service-component` y los diálogos del framework. Si tu app referencia las clases antiguas en CSS/plantillas propias, renómbralas (ver sección [18.7](#187-clases-css-para-casos-avanzados)). La clase `o-action--filled-default` **no** cambia.

```diff
- <button mat-stroked-button class="o-action--importance-primary">…</button>
+ <button mat-stroked-button class="o-button--importance-primary">…</button>
```

### 19.2 `o-button`: `aria-label` para lectores de pantalla

`o-button` expone ahora un nombre accesible vía `aria-label`, imprescindible para botones solo-icono. Es aditivo (no requiere cambios), pero puedes personalizarlo:

```html
<!-- Botón solo-icono: sin label, el nombre accesible cae a attr → icono -->
<o-button attr="refresh" icon="refresh"></o-button>

<!-- Nombre accesible explícito (se traduce con oTranslate) -->
<o-button icon="delete" aria-label="BUTTONS.DELETE"></o-button>
```

Precedencia del nombre accesible: `aria-label` explícito → `label` → `attr` → nombre del icono.

### 19.3 `o-date-input`: `getValue()` respeta `value-type` y comportamiento con valores no válidos

`getValue()` devuelve ahora el valor según el `value-type` configurado (`timestamp` → `number`, `date` → `Date`, `iso-8601` → string ISO, `string` → string formateado), en lugar de devolver siempre un `timestamp`. Además, mientras el campo contiene una fecha incompleta/no válida (p. ej. al borrar un dígito), `getValue()` devuelve `undefined`, por lo que los suscriptores a `valueChanges` dejan de recibir el valor anterior. Si tu código asumía que `o-date-input` siempre entregaba un `timestamp` numérico, ajústalo al `value-type` declarado.

### 19.4 `o-table`: clase `empty-cell` según el contenido mostrado

La clase `empty-cell` (que reserva altura mínima en celdas vacías) se aplica ahora en función del contenido **mostrado**, no del valor crudo `row[column.name]`. Las columnas de acción y las no asociadas a un campo de datos nunca se marcan como vacías, y en columnas con renderer se evalúa el valor formateado. Cambio interno; no requiere acción salvo que dependieras del comportamiento anterior en CSS propio.
