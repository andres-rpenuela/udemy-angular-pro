# Output como signal reactiva, Signal() y computed(), ViewChild() como signal reactiva


## 🧾 ÍNDICE MODERNO

1. ✅ [`output()` – Emisión de eventos modernos](#1-output-outputevent)
2. ⚡ [`signal()` y `computed()` – Reactividad](#2-signal-y-computed)
3. 🔍 [`viewChild()` como signal reactiva](#3-viewchild-como-signal)
4. 🧪 [Ejemplo práctico completo](#4-ejemplo-práctico)
5. 🧠 [Resumen y buenas prácticas](#5-conclusión)

---

## 1. ✅ `output()` (`OutputEvent`)

Desde Angular 17, puedes usar la **API moderna**:

```ts
import { output, OutputEvent } from '@angular/core';

export class MiComponente {
  send = output<string>();
}
```

Para emitir un valor:

```ts
this.send.emit('¡Hola desde el hijo!');
```

Y en el padre:

```html
<app-hijo (send)="procesar($event)"></app-hijo>
```

✅ **Ventajas**:

* Mejor tipado.
* No necesitas `new EventEmitter()`.
* Más limpio y conciso.

---

## 2. ⚡ `signal()` y `computed()`

```ts
import { signal, computed } from '@angular/core';

export class Componente {
  count = signal(1);
  doble = computed(() => this.count() * 2);
}
```

---

## 3. 🔍 `viewChild()` como signal

Angular 17+ permite usarlo como signal para acceder a refs del DOM:

```ts
public myButton = viewChild<ElementRef<HTMLButtonElement>>('myBtn');
```

En el template:

```html
<button #myBtn>Presiona</button>
```

Y puedes acceder así:

```ts
this.myButton()?.nativeElement.textContent;
```

---

## 4. 🧪 Ejemplo práctico completo

### 🧩 Hijo: Calculator

```ts
// calculator.component.ts
import { Component, ElementRef, output, OutputEvent, viewChild } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  template: `
    <button #btnCal (click)="emitirTexto()">Click aquí</button>
  `,
})
export class CalculatorComponent {
  public sendValue = output<string>();
  public btnRef = viewChild<ElementRef<HTMLButtonElement>>('btnCal');

  emitirTexto() {
    const texto = this.btnRef()?.nativeElement.textContent ?? 'Sin texto';
    this.sendValue.emit(texto);
  }
}
```

---

### 🏠 Padre: AppComponent

```ts
// app.component.ts
import { Component, signal } from '@angular/core';
import { CalculatorComponent } from './calculator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalculatorComponent],
  template: `
    <h2>Mensaje: {{ mensaje() }}</h2>
    <app-calculator (sendValue)="mensaje.set($event)"></app-calculator>
  `,
})
export class AppComponent {
  mensaje = signal('');
}
```

---

## 5. 🧠 Conclusión

| Herramienta   | Uso principal               | Forma moderna   |
| ------------- | --------------------------- | --------------- |
| `signal()`    | Estado reactivo             | ✅ `signal()`    |
| `computed()`  | Valor derivado              | ✅ `computed()`  |
| `output()`    | Emitir eventos al padre     | ✅ `output<T>()` |
| `viewChild()` | Acceder a elementos del DOM | ✅ `viewChild()` |

---