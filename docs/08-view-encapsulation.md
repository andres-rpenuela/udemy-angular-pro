# Índice

1. [¿Qué es View Encapsulation?](#qué-es-view-encapsulation)
2. [Estrategias de encapsulación](#estrategias-de-encapsulación)
   1. [Emulated (por defecto)](#1-emulated-por-defecto)
   2. [None](#2-none)
   3. [ShadowDom](#3-shadowdom)
3. [Uso de ::ng-deep](#uso-de-ng-deep)
4. [Tabla resumen](#tabla-resumen)
5. [Buenas prácticas](#buenas-prácticas)
6. [Alternativas y ejemplos](#alternativas-y-ejemplos)
   1. [Estilo en el componente padre](#estilo-en-el-componente-padre)
   2. [Aplicar la clase en el propio elemento HTML (recomendado)](#aplicar-la-clase-en-el-propio-elemento-html-recomendado)

---

## ¿Qué es View Encapsulation?

Angular proporciona tres estrategias para controlar cómo se aplican los estilos CSS a los componentes. Esto se conoce como **View Encapsulation** (encapsulación de vista):

1. **Emulated** *(por defecto)*
2. **None**
3. **ShadowDom**

> Importante: Si la clase de estilos es global, no se produce **view encapsulation**. Solo cuando el estilo está en el componente hijo y este produce un cambio una vez creado.

---

## Estrategias de encapsulación

### 1. Emulated (por defecto)

- Angular aplica los estilos del componente solo a su template.
- Usa atributos como `_ngcontent-*` para simular el aislamiento del Shadow DOM.
- Estilos encapsulados: **sí**.
- Compatible con todos los navegadores.

```ts
@Component({
  selector: 'app-ejemplo',
  templateUrl: './ejemplo.component.html',
  styleUrls: ['./ejemplo.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
```

---

### 2. None

- **No encapsula estilos**: los estilos definidos en `styleUrls` se aplican globalmente.
- Útil si quieres que los estilos afecten a todo el DOM, como variables CSS globales o resets.
- Precaución: puedes provocar colisiones de estilos.

```ts
@Component({
  selector: 'app-global',
  styleUrls: ['./global.component.css'],
  encapsulation: ViewEncapsulation.None
})
```

---

### 3. ShadowDom

- Usa el **Shadow DOM nativo** del navegador para encapsular los estilos.
- Los estilos definidos en el componente **no afectan al exterior**, ni los estilos globales afectan al interior del componente.
- Necesita soporte del navegador.
- Útil para crear Web Components verdaderamente aislados.

```ts
@Component({
  selector: 'app-shadow',
  styleUrls: ['./shadow.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
```

---

## Uso de ::ng-deep

- Se utiliza para forzar que un estilo definido dentro de un componente afecte a los elementos hijos proyectados mediante content projection.
- **Ejemplo:**

```css
:host ::ng-deep button {
  background-color: red;
}
```

> ⚠️ `::ng-deep` está en desuso, pero sigue funcionando como solución temporal. Se recomienda mover los estilos al componente hijo o usar `encapsulation: None` solo si es inevitable.

---

## Tabla resumen

| Encapsulation      | Encapsula estilos | Usa Shadow DOM | Estilos afectan fuera | Estilos globales afectan dentro |
| ------------------ | ----------------- | -------------- | --------------------- | ------------------------------- |
| Emulated (default) | Sí                | No             | No                    | No                              |
| None               | No                | No             | Sí                    | Sí                              |
| ShadowDom          | Sí                | Sí             | No                    | No                              |

---

## Buenas prácticas

- Prefiere pasar clases CSS como `@Input()` para estilos personalizados.
- Usa `::ng-deep` solo si no hay otra opción.
- Evita `ViewEncapsulation.None` a menos que estés creando un tema global controlado.

---

## Alternativas y ejemplos

### Estilo en el componente padre

Puedes añadir las clases en la hoja de estilos del componente padre. Así, cuando se aplique en el hijo, el estilo aparece de forma no encapsulada.

```ts
// Componente padre
@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styles: [`
    .is-command {
      @apply bg-indigo-700 bg-opacity-20;
    }
  `],
  imports: [CalculatorButtonComponent]
})
export class CalculatorComponent {}
```

En la vista:

```html
<div class="flex w-full">
  <calculator-button> C </calculator-button>
  <calculator-button> +/- </calculator-button>
  <calculator-button> % </calculator-button>
  <calculator-button isCommand> ÷ </calculator-button>
</div>
```

En el hijo:

```ts
@Component({
  selector: 'calculator-button',
  templateUrl: './calculator-button.component.html',
  styleUrls: ['./calculator-button.component.css'],
  host: {
    class: 'w-1/4 border-r border-b border-indigo-400',
  },
  // encapsulation: ViewEncapsulation.None // No recomendado
})
export class CalculatorButtonComponent implements OnInit {
  public isCommand = input(false, {
    transform: (value: boolean | string) => typeof value === 'string' ? value === '' : value
  });

  @HostBinding('class.is-command')
  get commandStyle() {
    return this.isCommand();
  }
}
```

En la vista del hijo:

```html
<button>
  <ng-content></ng-content>
</button>
```

Y la hoja de estilos del hijo:

```css
button {
  @apply w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light;
}

/* Opción no recomendada: desencapsular globalmente */
/*
::ng-deep .is-command {
  @apply bg-indigo-700 bg-opacity-20;
}
*/

/* Opción si usas ViewEncapsulation.None o ShadowDom (no recomendado) */
/*
.is-command {
  @apply bg-indigo-700 bg-opacity-20;
}
*/
```

---

### Aplicar la clase en el propio elemento HTML (recomendado)

Para aplicar una clase desde el componente padre de forma condicional, puedes usar `[class.class-name]="condición"` directamente en el elemento. Ejemplo usando `[class.is-command]="isCommand()"`:

Lógica y vista del componente padre:

```ts
@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styles: '',
  imports: [CalculatorButtonComponent]
})
export class CalculatorComponent {}
```

```html
<div class="flex w-full">
  <calculator-button> C </calculator-button>
  <calculator-button> +/- </calculator-button>
  <calculator-button> % </calculator-button>
  <calculator-button isCommand> ÷ </calculator-button>
</div>
```

Lógica y vista del componente hijo:

```ts
@Component({
  selector: 'calculator-button',
  templateUrl: './calculator-button.component.html',
  styleUrls: ['./calculator-button.component.css'],
  host: {
    class: 'w-1/4 border-r border-b border-indigo-400',
  },
  // encapsulation: ViewEncapsulation.None // No recomendado
})
export class CalculatorButtonComponent implements OnInit {
  public isCommand = input(false, {
    transform: (value: boolean | string) => typeof value === 'string' ? value === '' : value
  });

  get commandStyle() {
    return this.isCommand();
  }
}
```

```html
<button [class.is-command]="isCommand()">
  <ng-content></ng-content>
</button>
```

```css
button {
  @apply w-full h-16 outline-none focus:outline-none hover:bg-indigo-700 hover:bg-opacity-20 text-white text-opacity-50 text-xl font-light;
}

/* Opción no recomendada: desencapsular globalmente */
/*
::ng-deep .is-command {
  @apply bg-indigo-700 bg-opacity-20;
}
*/

/* Opción si usas ViewEncapsulation.None o ShadowDom (no recomendado) */
/* También puedes usar [class.class-name]="condition" sobre el propio elemento para evitar la encapsulación */
.is-command {
  @apply bg-indigo-700 bg-opacity-20;
}
```

---

**Resumen:**  
Angular te permite controlar el alcance de los estilos de tus componentes. Usa la encapsulación por defecto (`Emulated`) y aplica clases condicionales directamente en los elementos para mantener un código limpio y predecible. Usa `::ng-deep` o `ViewEncapsulation.None` solo si es estrictamente necesario.