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
| `fxLayout="row"` | `class="o-flex-row"` o CSS inline |
| `fxLayout="column"` | `class="o-flex-column"` |
| `fxLayoutAlign="start center"` | `class="o-layout-align-start-center"` |
| `fxFlex` | `class="o-flex"` |
| `fxLayoutGap="8px"` | `style="gap: 8px"` |

Ontimize Web NGX 18 incluye clases CSS utilitarias equivalentes en `flex-layout.scss` (importado automáticamente por el tema).

---

## 3. Theming — migrar a `ontimize-style.v18`

### 3.1 Actualizar el import de estilos en `styles.scss`

**Antes (Angular 15):**
```scss
@use 'ontimize-web-ngx/theming/ontimize-style' as ontimize-style;
// o bien:
@use 'ontimize-web-ngx/theming/ontimize-style-v8' as ontimize-style;
```

**Después (Angular 18):**
```scss
@use 'ontimize-web-ngx/theming/ontimize-style.v18' as ontimize-style;
@use 'ontimize-web-ngx/theming/fonts/noto';  // fuente Noto Sans

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
@use 'ontimize-web-ngx/theming/themes/ontimize-blue.v18' as theme;

// theme.$theme y theme.$dark-theme están disponibles
@include theme.ontimize-theme-styles(theme.$theme);

.dark-theme {
  @include theme.ontimize-theme-all-component-color(theme.$dark-theme);
}
```

### 3.4 Diferencias visuales v15 vs v18

| Aspecto | v15 | v18 |
|---|---|---|
| **Fuente** | Poppins | Noto Sans |
| **Iconos** | Material Icons (ligatura) | Material Symbols Outlined |
| **Sidenav** | Fondo derivado del color primary | Gris neutro (`#F5F5F5`) |
| **Botones** | Estilos custom (borde, color, hover) | Defaults de Angular Material |
| **Density** | Aplicada (checkbox, list, radio, menu, tree) | NO aplicada — usar CSS custom properties |
| **Tabs** | Fondo inactivo personalizado | Defaults de Angular Material |

### 3.5 Configurar density en Angular 18 (opcional)

Si necesitas ajustar la densidad de componentes Material en Angular 18, tienes dos opciones:

**Opción A — Pasar density al tema (recomendado)**

El mixin `ontimize-theme-styles` lee la clave `density` del mapa del tema y aplica `mat.all-component-densities()` automáticamente si no es `null`.

```scss
// app.scss / styles.scss
@use "sass:map";
@use "ontimize-web-ngx/theming/themes/oxygen.scss" as theme;
@use "ontimize-web-ngx/theming/ontimize-style.v18.scss" as ontimize-style;

$theme-with-density: map.merge(theme.$theme, (density: -1));

@include ontimize-style.ontimize-theme-styles($theme-with-density);
```

Los valores válidos son `0` (default), `-1`, `-2`, `-3`, `-4`, `-5`.

**Opción B — Aplicar density por componente**

```scss
// styles.scss (después del @include ontimize-theme-styles)
@use '@angular/material' as mat;

@include mat.form-field-density(-2);
@include mat.list-density(-1);
@include mat.tree-density(-2);
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

## 9. Material SCSS — APIs con prefijo m2-

Si tu código SCSS personalizado usa APIs de Angular Material, añade el prefijo `m2-` donde sea necesario:

| Antes | Después |
|---|---|
| `mat.define-palette(...)` | `mat.m2-define-palette(...)` |
| `mat.get-color-from-palette(...)` | `mat.m2-get-color-from-palette(...)` |
| `mat.define-light-theme(...)` | `mat.m2-define-light-theme(...)` |
| `mat.define-typography-level(...)` | `mat.m2-define-typography-level(...)` |
| `mat.$red-palette` | `mat.$m2-red-palette` |

Ontimize Web NGX 18 sigue usando Material M2 internamente (con prefijo `m2-`). La migración completa a Material M3 está planificada para una versión posterior.

---

## 10. Checklist de migración

```
[ ] Node.js >= 20 instalado
[ ] ng update @angular/core@18 @angular/cli@18 @angular/material@18
[ ] npm install ontimize-web-ngx@18
[ ] npm uninstall @angular/flex-layout (si aplica)
[ ] styles.scss: cambiar import a ontimize-style.v18
[ ] styles.scss: añadir @use fonts/noto
[ ] index.html: cambiar a Material Symbols Outlined
[ ] index.html: eliminar Material Icons font link
[ ] main.ts: migrar a bootstrapApplication() + provideOntimizeWeb() (opcional)
[ ] app.routes.ts: crear fichero de rutas standalone (opcional)
[ ] Guards: usar authGuard/permissionsGuard funcionales
[ ] SCSS propio: añadir prefijo m2- a APIs de Angular Material
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
@use 'ontimize-web-ngx/theming/ontimize-style.v18' as ontimize-style;

// ❌ Incorrecto (ruta relativa al fuente del framework)
@use '../node_modules/ontimize-web-ngx/theming/ontimize-style.v18';
```
