# Ontimize SCSS Theming — Versioned Structure

## Overview

The theming system is split into version-specific entry points to avoid visual
conflicts between Angular 15 and Angular 18 styles.

```
theming/
├── ontimize-base-style.scss      ← Shared foundation (palettes, o-material-theme, layout, bg-levels)
├── ontimize-style.v15.scss       ← Angular 15 styles (Poppins, density, custom buttons, primary sidenav)
├── ontimize-style.v18.scss       ← Angular 18 styles (Noto Sans, no density, Material defaults, neutral sidenav)
├── ontimize-style.scss           ← Legacy v18 entry point (backward-compatible, kept for existing consumers)
├── ontimize-style-v8.scss        ← Legacy v8/v15 entry point (backward-compatible)
├── fonts/
│   ├── poppins.scss              ← Poppins @font-face (used by v15)
│   └── noto.scss                 ← Noto Sans @font-face + CSS custom property (used by v18)
├── themes/
│   ├── ontimize-blue.scss        ← Blue theme (uses ontimize-style-v8, backward-compatible)
│   ├── ontimize-blue.v15.scss    ← Blue theme for Angular 15
│   ├── ontimize-blue.v18.scss    ← Blue theme for Angular 18
│   ├── ontimize-black-yellow.scss← Black-yellow theme (v8 style)
│   ├── fashion.scss              ← Fashion theme (uses ontimize-style.scss)
│   └── ontimize.scss             ← Default theme (uses ontimize-style.scss)
├── styles/
│   ├── layout.scss               ← Layout padding/margin attribute selectors
│   ├── flex-layout.scss          ← Flex utility classes (o-flex-row, o-layout-align-*, etc.)
│   ├── density.scss              ← Material density overrides (v15 only)
│   ├── paginator.scss            ← Paginator form field density fix
│   ├── ontimize/                 ← v18 variables and typography
│   └── ontimize-v8/              ← v15 variables, form/table/container overrides
├── typography/
│   ├── ontimize.scss             ← Typography config (Poppins-based scale + table typography)
│   └── o-table-typography.scss   ← Table-specific typography levels
└── addons/
    ├── report-on-demand.scss     ← Report addon theme
    └── charts-on-demand.scss     ← Charts addon theme
```

## Which entry point to use

| Angular version | Entry point | Font | Icons |
|----------------|-------------|------|-------|
| **Angular 18** | `ontimize-style.v18` | Noto Sans (`fonts/noto.scss`) | Material Symbols Outlined |
| **Angular 15** | `ontimize-style.v15` | Poppins (included automatically) | Material Icons |
| **Angular 8** (legacy) | `ontimize-style-v8` | Poppins (included automatically) | Material Icons |

## Usage — Angular 18

```scss
// styles.scss
@use 'ontimize-web-ngx/theming/ontimize-style.v18' as ontimize-style;
@use '@angular/material' as mat;

$primary: mat.m2-define-palette(...);
$accent: mat.m2-define-palette(...);
$theme: ontimize-style.o-mat-light-theme($primary, $accent);
$dark-theme: ontimize-style.o-mat-dark-theme($primary, $accent);

@include ontimize-style.ontimize-theme-styles($theme);

.dark-theme {
  @include ontimize-style.ontimize-theme-all-component-color($dark-theme);
}
```

Or use a predefined theme:
```scss
@use 'ontimize-web-ngx/theming/themes/ontimize-blue.v18' as theme;
// theme.$theme and theme.$dark-theme are available
```

In `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

## Usage — Angular 15

```scss
@use 'ontimize-web-ngx/theming/ontimize-style.v15' as ontimize-style;
// Same API as v18 — o-mat-light-theme(), ontimize-theme-styles(), etc.
```

## Key differences between v15 and v18

| Aspect | v15 | v18 |
|--------|-----|-----|
| **Sidenav background** | Derived from primary palette | Neutral grey (#F5F5F5 / primary-tinted) |
| **Button styles** | Custom border, colour, hover overrides | Material 2 defaults (no overrides) |
| **Density** | Applied (checkbox, list, radio, menu, tree) | NOT applied (configure via CSS custom properties) |
| **Font** | Poppins | Noto Sans |
| **Icon font** | Material Icons (ligature) | Material Symbols Outlined |
| **Tab style** | Custom inactive background, gradient layer | Simplified (Material defaults) |

## Configuring density in Angular 18

If you need custom density in Angular 18, add the following to your styles.scss:

```scss
@use '@angular/material' as mat;

// Apply density to specific components as needed
@include mat.form-field-density(-2);
@include mat.list-density(-1);
@include mat.tree-density(-2);
```

Note: Material 3 density works differently from Material 2. Negative density values
reduce component size. Not all components support density in M3.

## Base style architecture

`ontimize-base-style.scss` contains:
- Background/foreground palette definitions
- `o-mat-light-theme()` / `o-mat-dark-theme()` factory functions
- `ontimize-base-theme-styles()` mixin with shared styles:
  - `o-material-theme()` — all Ontimize component themes
  - Layout padding/margin, flex-layout utilities, paginator
  - Checkbox / pseudo-checkbox theming
  - Table, form, o-row/o-column, skeleton loaders
  - Background level utility classes (.bg-level-0 through .bg-level-1)
  - Report/Charts on-demand addon styles

Both v15 and v18 call `base.ontimize-base-theme-styles()` and then add their
own version-specific overrides on top.
