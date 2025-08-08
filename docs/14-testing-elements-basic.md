# Elementos de un test 
Un test en Angular con Jasmine + Karma se compone de varios **elementos clave** que permiten probar componentes, servicios, pipes o directivas de manera estructurada.

Aquí tienes un desglose claro de los elementos principales.

# Índice

1. [Elementos de un test](#elementos-de-un-test)
   1. [`describe()` – Agrupa un conjunto de pruebas](#1-describe--agrupa-un-conjunto-de-pruebas)
   2. [`beforeEach()` – Configura el entorno antes de cada prueba](#2-beforeeach--configura-el-entorno-antes-de-cada-prueba)
   3. [`it()` – Define una prueba individual](#3-it--define-una-prueba-individual)
   4. [`expect()` – Aserciones](#4-expect--aserciones)
   5. [TestBed – Simula el entorno de Angular](#5-testbed--simula-el-entorno-de-angular)
   6. [Fixtures – Acceden al DOM y al componente](#6-fixtures--acceden-al-dom-y-al-componente)
   7. [Espías (spies) – Simulan funciones o servicios](#7-espías-spies--simulan-funciones-o-servicios)
   8. [Ejemplo completo: Test de un componente](#ejemplo-completo-test-de-un-componente)
2. [Anexo: Aserciones comunes en Jasmine](#anexo-aserciones-comunes-en-jasmine)
   1. [Aserciones Básicas](#aserciones-básicas)
   2. [Negación](#negación)
   3. [Ejemplo de uso combinado](#ejemplo-de-uso-combinado)
3. [Apuntes Clave](#apuntes-clave)

## ✅ 1. **`describe()` – Agrupa un conjunto de pruebas**

```ts
describe('MiComponente', () => {
  // aquí van los tests individuales con `it()`
});
```

---

## ✅ 2. **`beforeEach()` – Configura el entorno antes de cada prueba**

Se usa comúnmente para configurar el `TestBed`, instanciar el componente, inyectar dependencias, etc.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    declarations: [MiComponente]
  }).compileComponents();
});
```

---

## ✅ 3. **`it()` – Define una prueba individual**

```ts
it('debería crear el componente', () => {
  const fixture = TestBed.createComponent(MiComponente);
  const comp = fixture.componentInstance;
  expect(comp).toBeTruthy();
});
```

---

## ✅ 4. **`expect()` – Aserciones**

Define lo que esperas que ocurra. Algunas expresiones comunes:

```ts
expect(valor).toBe(esperado);
expect(array).toContain(elemento);
expect(obj).toEqual(objEsperado);
expect(fn).toThrowError();
```

---

## ✅ 5. **TestBed – Simula el entorno de Angular**

Permite compilar componentes, inyectar servicios, simular módulos, etc.

```ts
TestBed.configureTestingModule({
  declarations: [MiComponente],
  providers: [ServicioX],
  imports: [HttpClientTestingModule]
});
```

---

## ✅ 6. **Fixtures – Acceden al DOM y al componente**

```ts
const fixture = TestBed.createComponent(MiComponente);
const comp = fixture.componentInstance;
fixture.detectChanges(); // dispara ngOnInit, renderiza plantilla
```

---

## ✅ 7. **Espías (spies) – Simulan funciones o servicios**

```ts
spyOn(servicio, 'getDatos').and.returnValue(of(mockDatos));
```

---

### 📌 Ejemplo completo: Test de un componente

```ts
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('formulario inválido si los campos están vacíos', () => {
    expect(component.form.valid).toBeFalse();
  });
});
```

---

# Anexo

Lista de las **aserciones más comunes disponibles en Jasmine**, que puedes usar con `expect()` para verificar comportamientos en tus tests de Angular:


## ✅ Aserciones Básicas

| Aserción                    | Descripción                                          |
| --------------------------- | ---------------------------------------------------- |
| `toBe(valor)`               | Comparación estricta (`===`)                         |
| `toEqual(obj)`              | Compara objetos o arrays por contenido               |
| `toBeTruthy()`              | Es verdadero (`!!valor === true`)                    |
| `toBeFalsy()`               | Es falso (`!!valor === false`)                       |
| `toBeNull()`                | Verifica que sea `null`                              |
| `toBeUndefined()`           | Verifica que sea `undefined`                         |
| `toBeDefined()`             | Verifica que esté definido                           |
| `toBeNaN()`                 | Verifica que sea `NaN`                               |
| `toMatch(regexstring)`      | Verifica coincidencia con expresión regular o string |
| `toContain(valor)`          | Verifica si un array o string contiene el valor      |
| `toBeGreaterThan(n)`        | Mayor que `n`                                        |
| `toBeLessThan(n)`           | Menor que `n`                                        |
| `toBeCloseTo(num, dígitos)` | Aproximación decimal (útil con flotantes)            |
| `toThrow()`                 | Verifica que una función lance una excepción         |
| `toThrowError(msg?)`        | Verifica error específico opcionalmente con mensaje  |

---

## 🚫 Negación

Para negar una aserción, usa `.not`:

```ts
expect(5).not.toBe(10);
expect(obj).not.toEqual(null);
```

---

## 🔧 Ejemplo de uso combinado

```ts
expect(service.getValue()).toBeDefined();
expect(component.items).toContain('elemento');
expect(component.total).toBeGreaterThan(0);
expect(() => component.errorMethod()).toThrowError('Error esperado');
```

---

## 📌 Apuntes clave

1. TestBed.configureTestingModule con imports:
  Usas el componente como un standalone component, lo cual es moderno y correcto para Angular 15+.
>```ts
>  await TestBed.configureTestingModule({
>    imports: [CalculatorButtonComponent] // Se importa el componente directamente (standalone)
>  }).compileComponents();
>```

2. fixture.detectChanges():
  Necesario para que Angular aplique los cambios y el DOM esté listo para inspección.

3. Warning en expect(component.isDobuleSize).toContain('false'):
> ⚠️ isDobuleSize es un booleano, por lo tanto, no tiene .toContain(...).
>✅ Debe ser:
>
>```ts
>expect(component.isDobuleSize).toBeFalse();
>```

4. setInput vs @Input() directo:
  fixture.componentRef.setInput(...) es útil en Angular 14+ y mejora las pruebas reactivas de @Input().

5. DOM classList.split:
  Revisas las clases del host correctamente para asegurarte que el estilo se aplica según la condición del @Input().

---

## 📌 ¿Qué hace spyOn(...)?
**spyOn(obj, methodName)** crea un **espía** (spy) sobre un método específico de un objeto. Sirve para:

- Verificar si el método fue llamado
- Ver cuántas veces fue llamado
- Con qué argumentos fue llamado

👉 En este caso:
```ts
spyOn(component.onClick, 'emit');
```
Esto reemplaza temporalmente *onClick.emit()* con una función espía. Así puedes usar:

* toHaveBeenCalled()
* toHaveBeenCalledTimes(n)
* toHaveBeenCalledWith(value)

### Ejemplo más completo:

```ts
it('should emit "5" when emitValue is called', () => {
  spyOn(component.onClick, 'emit');

  component.emitValue();

  expect(component.onClick.emit).toHaveBeenCalledWith('5'); // Verifica que emitió el valor correcto
});
```
### ¿Cuándo usar **spyOn**?
Úsalo para observar:

* Métodos públicos o privados
* Llamadas a servicios
* Emitters (@Output)
* Métodos en otras clases inyectadas (como servicios)

--- 

## 📝 Apuntes: Uso de `done` en tests con Jasmine

Uso de `done` en tests asíncronos de Jasmine, especialmente aplicado a tu caso con Angular y `setTimeout`.

### 🔧 ¿Qué es `done`?

`done` es una **función de callback** que Jasmine proporciona para que puedas indicarle **cuándo ha terminado un test asíncrono**.

### 🤔 ¿Por qué se necesita?

Jasmine, por defecto, **no espera** operaciones asincrónicas como:

- `setTimeout`
- `Promise`/`async/await` (si no usas `async`)
- Observables sin `fakeAsync` o `done`

Si no usas `done`, Jasmine **termina el test antes de tiempo**, lo que provoca:
- ❌ Falsos positivos (test pasa sin ejecutar todo)
- ❌ Falsos negativos (test falla porque no esperó)

### ✅ ¿Cómo se usa `done`?

```ts
it('test async', (done) => {
  setTimeout(() => {
    expect(true).toBeTrue();
    done(); // Indica a Jasmine que el test ha terminado correctamente
  }, 100);
});
```

> Sin `done()`, Jasmine no sabe que debe esperar.

## 🧪 Aplicado a tu test:

```ts
it('should set isPressed to true and then false when keyboardPressStyle is called with a matching key', (done) => {
  spyOn(component.onClick, 'emit');

  component.contentValue()!.nativeElement.innerText = '1';
  component.keyBoardPressedStyle('1');

  expect(component.isPressed()).toBeTrue();
  expect(component.onClick.emit).toHaveBeenCalledWith('1');
  expect(component.isPressed()).toBe(true);

  setTimeout(() => {
    expect(component.isPressed()).toBeFalse(); // Se espera que se reinicie
    done(); // ✅ Muy importante: indica que la parte asíncrona terminó
  }, 200);
});
```
### 🧠 ¿Qué pasaría si no pones `done()`?

- Jasmine termina el test **antes de que se ejecute el `setTimeout`**
- Entonces el `expect(component.isPressed()).toBeFalse()` ni siquiera se evalúa
- Resultado: el test pasa **incorrectamente** o falla sin sentido

### ✅ Buenas prácticas

- Usa `done()` solo cuando trabajes con callbacks como `setTimeout`, suscripciones, etc.
- En Angular, cuando uses `fakeAsync` y `tick()`, **no necesitas `done`**.
- No olvides **llamar a `done()` dentro del callback**, no fuera.

---

## Probar contenido proyecto (ng-content)

Para comprobar el contendio proyecto, realizamos los siguientes pasos:

1. Crear un componente en el test.
2. El componente importara el componente que se quiere evaluar
3. El template del nuevo compoente, hara uso del selector del componente a evular, cuyo contenido esta dentro de un `span` que hace uso de una  o más clases css,
que sirvan de revencia para detectar que hay un contendio referenciado, cuyo valor del span coincide con el proyecado.

> Ejemplo:
> ```ts
> // para comprobar el contenido del proyecto, se debe importar el componente que se quiere evaluar
> @Component({
>   imports: [CalculatorButtonComponent], // Importa el componente que se quiere evaluar
>   template: `
>   <calculator-button>
>     <span class="project-content underline">Test content</span>
>   </calculator-button>`, // Se usa el componente que se quiere evaluar
>   standalone: true, // Indica que este componente es standalone
> })
> class TestHostComponent {}  
> ```

4. Montamos el component para el test, se debería verificar que el `span` este en la posición.

```ts
it('should display project content', () => {
    // crea un fixture para el componente de prueba
    const testFixture = TestBed.createComponent(TestHostComponent);
    console.log('TestHostComponent created: ', { testFixture });
    //console.log(testFixture.debugElement);

    // se carga el componente de prueba
    const testComponent = testFixture.componentInstance;
    const testCompiled = testFixture.nativeElement as HTMLElement;

    expect(testComponent).toBeTruthy(); // Verifica que el componente de prueba se haya creado correctamente
    expect(testCompiled.querySelector('.project-content')?.textContent).toContain('Test content'); // Verifica que el contenido del proyecto se muestre correctamente

  });
```

--- 

## Mock para test en angular

El mocking en Angular es una parte fundamental para hacer pruebas unitarias efectivas con Jasmine y TestBed.

Hacer un "**mock**" es crear una *versión falsa* de una clase, servicio, dependencia o componente para poder probar algo sin depender del comportamiento real del objeto original.

Ejemplos comunes de lo que se mockea:

* Servicios (UserService, AuthService, etc.)
* HTTP requests
* Outputs de componentes hijos
* Directivas/pipes personalizados
* Dependencias inyectadas (como Router, ActivatedRoute)


1. Crear un archivo Mock con los métodos que devuelvan el resultado deseado (_se puede crear en el mismo test_).
```ts
// user.service.mock.ts
import { of } from 'rxjs';
import { User } from './user.model';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Luis' },
];

export class MockUserService {
  getUsers() {
    return of(MOCK_USERS); // Simula un Observable como HttpClient
  }
}
```
>  **Nota:** Para usar **jasmine** en la clase del **mock**, el nombre del fichero debe contneter `*.spec.ts`

2. Usar el Mock en las pruebas unitarias
```ts
// user.service.mock.ts
import { of } from 'rxjs';
import { User } from './user.model';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Luis' },
];

export class MockUserService {
  getUsers() {
    return of(MOCK_USERS); // Simula un Observable como HttpClient
  }
}
```

**Esto permite que toda la app funcion**e sin conexión al backend, insertando el modulo en el `app.module.ts`
```ts
// app.module.ts
providers: [
  { provide: UserService, useClass: MockUserService }
]
```

O en el `app.config.ts` para versiones de Angular14+ estandalone:
```ts
// app.config.ts
import { ApplicationConfig, provideHttpClient } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { UserService } from './user/user.service';
import { MockUserService } from './user/user.service.mock';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    // 👇 Aquí usas el mock
    { provide: UserService, useClass: MockUserService }
  ]
};
```