# 🧾 Apuntes sobre `viewChildren` en Angular

## 📑 Índice

1. [¿Qué es `viewChildren`?](#qué-es-viewchildren)
2. [Diferencias con `viewChild`](#diferencias-con-viewchild)
3. [Ejemplo práctico](#ejemplo-práctico)
4. [¿Para qué se usa?](#para-qué-se-usa)
5. [Revisión rápida](#revisión-rápida)
6. [Más información](#más-información)

---

## 🔍 ¿Qué es `viewChildren`?

`viewChildren` (la forma moderna de `@ViewChildren`) es una función de Angular que permite **obtener una referencia a todas las instancias de un componente o elemento del DOM** que están presentes dentro de la vista de un componente.

> 🧠 Es una forma reactiva de trabajar con múltiples hijos al mismo tiempo.

---

## 🧠 Diferencias con `viewChild`

| Decorador      | Tipo de referencia   | Qué devuelve           |
| -------------- | -------------------- | ---------------------- |
| `viewChild`    | Una sola instancia   | `Signal<Componente>`   | 
| `viewChildren` | Múltiples instancias | `Signal<Componente[]>` | 

* `viewChild` se usa para **una única instancia** (por ejemplo, un `div` o un `input` específico).
* `viewChildren` se usa cuando hay **muchas instancias iguales** (como muchos botones).

---

## 🧪 Ejemplo práctico

```ts
import { viewChildren } from '@angular/core';
import { CalculatorButtonComponent } from './calculator-button.component';

export class CalculatorComponent {
  public calculatorButtons = viewChildren(CalculatorButtonComponent);
}
```

Esto guarda un `Signal` con **todas las instancias del componente hijo** `CalculatorButtonComponent` renderizadas dentro del `CalculatorComponent`.

---

## 🧩 ¿Para qué se usa?

Mira este ejemplo del método `handleKeyboardEvent`:

```ts
public handleKeyboardEvent(event: KeyboardEvent) {
  this.handleClick(event.key);

  this.calculatorButtons().forEach(button => {
    button.keyBoardPressedStyle(event.key);
  });
}
```

### ¿Qué hace?

1. Captura una tecla presionada por el usuario (`keyup`).
2. Llama a `handleClick` con esa tecla.
3. Recorre **todos los botones hijos** con `viewChildren`.
4. Pide a cada botón que **se compare con esa tecla**.
5. Si hay coincidencia, ese botón se **"resalta" visualmente**.

---

## 📘 Revisión rápida

**¿Qué devuelve `viewChildren(...)`?**

* A) Una sola instancia del componente.
* B) Un `Signal` con múltiples instancias del componente.**
* C) Una lista de elementos del DOM.

> ✅ **Respuesta correcta: B**
> Porque `viewChildren` devuelve un `Signal` que contiene un array de instancias del componente o elemento.

---

## 🔗 Más información

* [Angular - ViewChildren (API)](https://angular.io/api/core/ViewChildren)
* [Angular - Signals y Reactividad](https://angular.dev/guide/signals)
* [Guía de Componentes en Angular](https://angular.dev/guide/components)
