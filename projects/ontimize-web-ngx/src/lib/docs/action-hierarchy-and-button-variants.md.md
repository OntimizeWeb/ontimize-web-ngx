# Implementar sistema unificado de jerarquía visual para acciones y botones

## Objetivo

Implementar un sistema homogéneo para definir la apariencia y relevancia visual de las acciones en Ontimize, basado en conceptos semánticos y desacoplado de los tipos de botón específicos de Angular Material.

La funcionalidad debe estar disponible en:

* o-form
* o-table
* o-grid
* o-list
* o-tree
* o-button

---

## 1. Configuración de acciones por `attr`

Añadir un nuevo Input en:

* o-form
* o-table
* o-grid
* o-list
* o-tree

```ts
@Input() actionStyles?: Record<string, OActionStyle>;
```

donde la clave del objeto corresponde al valor del `attr` de la acción.

Ejemplo:

```ts
{
  save: {
    importance: 'primary'
  },
  cancel: {
    importance: 'default'
  },
  delete: {
    variant: 'flat',
    importance: 'warn'
  }
}
```

---

## 2. Nuevo modelo de estilos

```ts
export interface OActionStyle {
  variant?: 'outline' | 'flat' | 'basic' | 'raised';
  importance?: 'primary' | 'warn' | 'default';
}
```

### Variants

| Variant | Angular Material   |
| ------- | ------------------ |
| outline | mat-stroked-button |
| flat    | mat-flat-button    |
| basic   | mat-button         |
| raised  | mat-raised-button  |

### Importance

| Importance | Significado        |
| ---------- | ------------------ |
| primary    | Acción principal   |
| warn       | Acción destructiva |
| default    | Acción estándar    |

### Correspondencia visual

#### primary

* Color del texto e iconos es el  primario del tema.

#### warn

* Color del texto e iconos es el warn del tema.

#### default

* Color del texto e iconos es foreground del tema.
* Debe utilizar el color de texto definido por el sistema de tematización de Ontimize.

---

## 3. Reglas por defecto

### Regla general

Todas las acciones deberán renderizarse inicialmente como:

```ts
{
  variant: 'outline',
  importance: 'default'
}
```

---

### o-form

#### Modo INSERT

La acción:

```text
attr="insert"
```

deberá recibir automáticamente:

```ts
{
  importance: 'primary'
}
```

#### Modo UPDATE

La acción:

```text
attr="save"
```

deberá recibir automáticamente:

```ts
{
  importance: 'primary'
}
```

---

### o-table, o-grid, o-list y o-tree

La acción:

```text
attr="new"
```

deberá recibir automáticamente:

```ts
{
  importance: 'primary'
}
```

---

## 4. Resolución de estilos

La apariencia final de una acción deberá resolverse en el siguiente orden:

```text
1. Configuración explícita mediante actionStyles
2. Reglas automáticas del componente
3. Valores por defecto
```

---

## 5. Aplicación sobre acciones internas

La funcionalidad no debe depender de que la acción esté implementada mediante un `o-button`.

Debe poder aplicarse a cualquier acción identificada mediante `attr`, independientemente de la implementación interna de:

* o-form
* o-table
* o-grid
* o-list
* o-tree

---

## 6. Evolución de o-button

### Deprecar API actual

Marcar como deprecated:

```ts
@Input() type;
@Input() color;
```

---

### Nueva API

```ts
@Input() variant?: 'outline' | 'flat' | 'basic' | 'raised';

@Input() importance?: 'primary' | 'warn' | 'default';
```

Ejemplos:

```html
<o-button
  attr="save"
  importance="primary">
</o-button>
```

```html
<o-button
  attr="delete"
  variant="flat"
  importance="warn">
</o-button>
```

---

## 7. Compatibilidad hacia atrás

Mantener compatibilidad con la API actual realizando una transformación interna:

```text
type="flat"      -> variant="flat"
type="stroked"   -> variant="outline"
type="basic"     -> variant="basic"
type="raised"    -> variant="raised"

color="primary"  -> importance="primary"
color="warn"     -> importance="warn"
```

Los atributos `type` y `color` deberán marcarse como deprecated en la documentación y mantenerse por compatibilidad durante el periodo de transición.

---

## 8. Objetivo UX

Garantizar una jerarquía visual consistente en toda la plataforma:

* Todas las acciones son `outline + default` por defecto.
* Existe una única acción principal destacada automáticamente en cada contexto.
* Las acciones destructivas utilizan `warn`.
* La configuración se realiza mediante conceptos semánticos (`variant` e `importance`).
* La misma API se utiliza tanto para acciones internas de los componentes como para `o-button`.
* La solución debe ser extensible para futuras variantes visuales sin romper la API pública.
