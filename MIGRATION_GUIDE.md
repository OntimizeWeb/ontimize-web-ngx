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
- Typography: `--o-font-family` y, por cada level (`body-1`, `input`, `body-2`, `subtitle-1`, `subtitle-2`, `headline-5`, `headline-6`, `caption`, `button`): `--o-font-<level>-size`, `--o-font-<level>-line-height`, `--o-font-<level>-weight`. El level `input` controla el `font-size` de los `mat-form-field` y es independiente de `body-1`.
- Sizing: `--o-button-height`, `--o-input-icon-size`.

> ⚠️ **Eliminado en 18.0.0-next.2**: los tokens `--o-primary-*`, `--o-accent-*`, `--o-warn-*` (y sus variantes `-contrast-*`) ya **no se emiten**. Ver sección [Migración a Material 3 nativo](#migracion-a-material-3-nativo-desde-18-0-0-next-1) para la tabla de equivalencias M3.

Para styles propios **no** llames a `mat.m2-get-color-from-palette()`. Usa los tokens M3 directamente:

```scss
// Antes (M2)
.my-button { color: mat.m2-get-color-from-palette($primary, 500); }
// Después (M3 sys token)
.my-button { color: var(--mat-sys-primary); }

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

El framework 18.0.0-next.2 emite tokens **Material 3 nativos** (`--mat-sys-*`, `--mdc-*`) y tokens custom de Ontimize (`--o-*` para superficies, foreground, typography y sizing). **Tu SCSS custom debería consumir esos tokens en vez de llamar a `mat.m2-*` en tiempo de build.**

| Necesitas… | Usa… |
|---|---|
| Color primary | `var(--mat-sys-primary)` (texto/icono encima: `var(--mat-sys-on-primary)`) |
| Tinte primary (containers) | `var(--mat-sys-primary-container)` (texto: `var(--mat-sys-on-primary-container)`) |
| Color accent (M3 = tertiary) | `var(--mat-sys-tertiary)` / `var(--mat-sys-on-tertiary)` |
| Color warn (M3 = error) | `var(--mat-sys-error)` / `var(--mat-sys-on-error)` |
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
  color: var(--mat-sys-primary);
  font-size: var(--o-font-body-2-size);
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

Los demás tokens `--o-*` (`--o-bg-*`, `--o-fg-*`, `--o-font-*`, `--o-button-height`, `--o-input-icon-size`) **no cambian**.

### 12.3 Por qué este breaking change

En `18.0.0-next.1`, el theme M3 interno se construía con paletas Material hardcoded (`mat.$azure-palette` + `mat.$blue-palette`) que **no reflejaban el color de marca del consumer**. Esto causaba que tokens MDC como `--mdc-filled-button-container-color` (botones filled) o el color de los sliders, checkboxes, ripples, etc. saliera siempre en azul Material por defecto, ignorando la paleta del consumer.

Adoptar la firma M3 nativa permite que el theme sí use la paleta del consumer, así que **todos los componentes Material toman automáticamente el color de marca correcto** — sin necesidad de overrides manuales en cada componente.
