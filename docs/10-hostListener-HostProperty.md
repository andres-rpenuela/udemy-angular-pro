# Apuntes sobre @HostListener y @HostBinding en Angular

# Índice

1. [Introducción](#introducción)
2. [`@HostListener`](#hostlistener)

   1. [¿Qué es?](#qué-es)
   2. [Ejemplo básico](#ejemplo-básico)
   3. [Eventos globales](#eventos-globales)
3. [`@HostBinding`](#hostbinding-host-property-binding)

   1. [¿Qué es?](#qué-es-1)
   2. [Ejemplos de uso](#ejemplos-de-uso)
4. [¿Por qué usarlos?](#por-qué-usarlos)
5. [Resumen rápido](#resumen-rápido)
6. [Alternativa: usar la propiedad `host` en el decorador](#alternativa-usar-la-propiedad-host-en-el-decorador)
7. [Eventos DOM comunes](#eventos-dom-comunes)
8. [Más información](#más-información)

---

## Introducción

Angular permite interactuar con el elemento host de un componente usando los decoradores `@HostListener` y `@HostBinding`. Estos decoradores ayudan a encapsular la lógica de eventos y bindings directamente en la clase del componente, facilitando el mantenimiento y la reactividad del código. Son ideales para mantener los componentes limpios y desacoplados del DOM.

---

## `@HostListener`

### ¿Qué es?

`@HostListener` es un decorador que permite escuchar eventos del DOM en el elemento host del componente. Es útil para reaccionar a eventos sin tener que usar `addEventListener` ni modificar la plantilla. Se asocia a un método del componente que será invocado cuando ocurra el evento.

### Ejemplo básico

```ts
@Component({ /* ... */ })
export class MyComponent {
  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {
    console.log('Click en el host:', event.clientX, event.clientY);
  }
}
```

Este ejemplo hace que cualquier clic sobre el componente `<app-my-component>` dispare el método `onHostClick`.

### Eventos globales

Puedes escuchar eventos globales, como los de `window` o `document`:

```ts
@HostListener('window:resize', ['$event'])
onResize(event: Event) {
  console.log('La ventana cambió de tamaño:', event);
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  console.log('Click en cualquier parte del documento:', event);
}
```

Esto es útil para manejar eventos que no ocurren directamente en el host, como detectar clics fuera del componente o cambios de tamaño de la ventana.

---

## `@HostBinding` (Host Property Binding)

### ¿Qué es?

`@HostBinding` es un decorador que enlaza atributos, clases, estilos o propiedades del host element directamente a propiedades de la clase del componente. Permite mantener sincronía entre el estado del componente y el DOM sin usar el template.

### Ejemplos de uso

**1. Clases CSS**

```ts
@HostBinding('class.active')
isActive = false;
```

Cuando `isActive` es `true`, Angular añade la clase `active` al host del componente.

**2. Atributos**

```ts
@HostBinding('attr.aria-disabled')
get ariaDisabled() {
  return this.disabled ? 'true' : null;
}
```

Se añade el atributo `aria-disabled` al host si `this.disabled` es `true`.

**3. Estilos**

```ts
@HostBinding('style.backgroundColor')
bgColor = 'lightblue';
```

Aplica el estilo directamente al host: `background-color: lightblue`.

---

## ¿Por qué usarlos?

* **Encapsulación limpia:** No necesitas manipular el DOM ni usar referencias externas.
* **Centralización de lógica:** Todo queda dentro de la clase del componente.
* **Reactividad automática:** Los cambios en las propiedades del componente actualizan el DOM automáticamente.

---

## Resumen rápido

| Decorador       | Propósito                                           | Sintaxis                                   |
| --------------- | --------------------------------------------------- | ------------------------------------------ |
| `@HostListener` | Escuchar eventos del host (click, mouseover, etc.)  | `@HostListener('evento', ['args']) method` |
| `@HostBinding`  | Vincular propiedades del host (clases, attrs, etc.) | `@HostBinding('class.name') prop: boolean` |

---

## Alternativa: usar la propiedad `host` en el decorador

Además de `@HostListener`, Angular permite definir listeners directamente en el decorador `@Component` mediante la propiedad `host`.

Ejemplo:

```ts
@Component({
  selector: 'app-my-component',
  template: `<p>Hola mundo</p>`,
  host: {
    '(document:keyup)': 'handleKeyboardEvent($event)',
    'class': 'rounded shadow p-4'
  }
})
export class MyComponent {
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('Tecla presionada:', event.key);
  }
}
```

* `(document:keyup)` indica que se escucha el evento `keyup` en el `document` (global).
* Cuando se dispara, ejecuta el método `handleKeyboardEvent` en el componente.
* También puedes añadir clases o atributos al host mediante esta propiedad.

---

### Diferencias entre `host` y `@HostListener`

Ambos evitan tener que usar `addEventListener` o usar eventos en el template.

* El parámetro `host` del decorador **@Component** se usa para agregar atributos, clases o listeners directamente al elemento host del componente en el DOM. Es una forma declarativa útil para listeners simples o añadir atributos. Por ejemplo, en tu código, se agregan clases CSS al host para estilos y animaciones.

* El decorador `@HostListener` se usa para escuchar eventos del host (como mouseenter, click, etc.) y ejecutar métodos de la clase cuando ocurren esos eventos. es más flexible, permitiendo lógica más compleja y mejor organización

En resumen, se recomienda

* `host` en *@Component*: para definri atributos/estilos/eventos en el host.
* `@HostListener`: ejecutar código cuando ocurre un evento en el host.
---

## Eventos DOM comunes

Puedes usar con `@HostListener` cualquier evento estándar del DOM, por ejemplo:

**Eventos de ratón:**

* `click`, `dblclick`, `mouseenter`, `mouseleave`, `mousedown`, `mouseup`, `mousemove`, `contextmenu`

**Eventos de teclado:**

* `keydown`, `keyup`, `keypress`

**Eventos de foco y formulario:**

* `focus`, `blur`, `input`, `change`, `submit`

**Eventos de scroll y táctiles:**

* `scroll`, `touchstart`, `touchmove`, `touchend`

**Eventos globales:**

* `window:resize`, `document:keydown`

---

## Más información

* [Angular Docs – Host Element](https://angular.dev/guide/components/host-elements)
* [HostBinding & HostListener (Angular Guide)](https://angular.dev/guide/components/host-elements#the-hostbinding-and-hostlistener-decorators)
* [Lista de eventos DOM en MDN](https://developer.mozilla.org/en-US/docs/Web/Events)
* [Angular API: HostListener](https://angular.io/api/core/HostListener)
* [Angular Guide: Listening to user input with HostListener](https://angular.io/guide/user-input#listening-to-user-input-with-hostlistener)
