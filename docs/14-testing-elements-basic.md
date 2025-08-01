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