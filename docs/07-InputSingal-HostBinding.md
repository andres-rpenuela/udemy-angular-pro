# Índice

1. [¿Qué es InputSignal?](#qué-es-inputsignal)
2. [Declaración y uso básico](#declaración-y-uso-básico)
3. [Ventajas de InputSignal](#ventajas-de-inputsignal)
4. [Transformación de valores](#transformación-de-valores)
5. [Opciones avanzadas: required, alias, transform](#opciones-avanzadas-required-alias-transform)
6. [Resumen de API y Cheatsheet](#resumen-de-api-y-cheatsheet)
7. [Uso de @HostBinding con InputSignal](#uso-de-hostbinding-con-inputsignal)
8. [Ejemplos prácticos](#ejemplos-prácticos)
9. [Otros usos útiles de @HostBinding](#otros-usos-útiles-de-hostbinding)

---

## ¿Qué es InputSignal?

**InputSignal<T>** es una API introducida en Angular 17 que permite definir propiedades de entrada (`@Input`) como **signals reactivas**. Esto facilita un flujo de datos más predecible, reactivo y funcional en los componentes.

---

## Declaración y uso básico

En vez de usar el clásico `@Input()`:

```ts
@Input() isActive: boolean = false;
```

Usa la función `input`:

```ts
import { input } from '@angular/core';

export class MyComponent {
  isActive = input(false);
}
```

**Uso en plantilla:**

```html
<my-component [isActive]="true"></my-component>
```

**Lectura en el componente:**

```ts
ngOnInit() {
  if (this.isActive()) {
    // Está activo
  }
}
```

---

## Ventajas de InputSignal

- ✅ Reactivo por naturaleza (compatible con signals, `computed()`, `effect()`, etc.).
- ✅ Evita el uso de setters para reaccionar a cambios.
- ✅ Compatible con `@HostBinding` y `@HostListener`.
- ✅ Permite transformar valores de entrada fácilmente.
- ✅ Facilita la composición y reutilización de lógica reactiva.

---

## Transformación de valores

Puedes transformar el valor recibido antes de que se asigne a la propiedad:

```ts
isCommand = input(false, {
  transform: (value: boolean | string) =>
    typeof value === 'string' ? value === '' : value,
});
```

**Ejemplo de uso:**

```html
<my-button isCommand></my-button> <!-- true -->
<my-button [isCommand]="false"></my-button> <!-- false -->
```

---

## Opciones avanzadas: required, alias, transform

La función `input<T>()` acepta un objeto de configuración:

```ts
input<T>(defaultValue, {
  required?: boolean,
  alias?: string,
  transform?: (value: unknown) => T
})
```

### `required: true`

Obliga a que el input sea proporcionado:

```ts
isEnabled = input<boolean>(undefined, { required: true });
```

```html
<my-component [isEnabled]="true"></my-component> <!-- OK -->
<my-component></my-component> <!-- Error -->
```

### `alias: 'otroNombre'`

Permite usar un nombre externo diferente al interno:

```ts
visible = input<boolean>(true, { alias: 'isVisible' });
```

```html
<my-component [isVisible]="false"></my-component>
```

### `transform`

Normaliza o convierte el valor recibido:

```ts
isCommand = input(false, {
  transform: (v: boolean | string) =>
    typeof v === 'string' ? v === '' : v
});
```

---

## Resumen de API y Cheatsheet

| Opción      | Descripción                                 | Ejemplo                                                   |
| ----------- | ------------------------------------------- | --------------------------------------------------------- |
| `required`  | Obliga al usuario a pasar el input          | `input(undefined, { required: true })`                    |
| `alias`     | Cambia el nombre externo del input          | `input(false, { alias: 'isVisible' })`                    |
| `transform` | Convierte el valor recibido antes de usarlo | `input(false, { transform: v => v === '' ? true : !!v })` |

---

## Uso de @HostBinding con InputSignal

Puedes enlazar el valor reactivo de un input directamente a clases, atributos o estilos del host element usando `@HostBinding`.

**Ejemplo:**

```ts
import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<ng-content />`
})
export class ButtonComponent {
  isDisabled = input(false);

  @HostBinding('class.disabled')
  get hostDisabledClass() {
    return this.isDisabled();
  }
}
```

**Resultado:**

```html
<app-button class="disabled"></app-button> <!-- Si isDisabled = true -->
<app-button></app-button>                  <!-- Si isDisabled = false -->
```

---

## Ejemplos prácticos

### Ejemplo 1: Botón con alias y transformación

```ts
@Component({
  selector: 'app-button',
  template: `<ng-content />`
})
export class ButtonComponent {
  disabled = input(false, { alias: 'isDisabled' });
  size = input<'sm' | 'md' | 'lg'>('md', {
    required: true,
    transform: (val) => ['sm', 'md', 'lg'].includes(val) ? val : 'md'
  });

  @HostBinding('class.disabled') get isDisabled() {
    return this.disabled();
  }

  @HostBinding('class.btn-lg') get isLarge() {
    return this.size() === 'lg';
  }
}
```

**Uso:**

```html
<app-button [isDisabled]="true" size="lg"></app-button>
```

### Ejemplo 2: Proyección de atributos y estilos

```ts
@HostBinding('attr.aria-disabled') get ariaDisabled() {
  return this.isDisabled() ? 'true' : null;
}

@HostBinding('attr.tabindex') get tabIndex() {
  return this.isDisabled() ? -1 : 0;
}

@HostBinding('style.backgroundColor') get bgColor() {
  return this.isDisabled() ? '#eee' : '#fff';
}
```

---

## Otros usos útiles de @HostBinding

- Aplicar roles dinámicos:
  ```ts
  @HostBinding('attr.role') role = 'button';
  ```
- Cambiar estilos según el input:
  ```ts
  @HostBinding('style.opacity') get opacity() {
    return this.isDisabled() ? 0.5 : 1;
  }
  ```
- Añadir varias clases según el estado:
  ```ts
  @HostBinding('class.active') isActive = true;
  @HostBinding('class.primary') isPrimary = false;
  ```

---

**Conclusión:**  
`InputSignal` permite crear componentes más reactivos, limpios y fáciles de mantener, integrándose perfectamente con el sistema de signals y decoradores de Angular.