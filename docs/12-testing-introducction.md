# Índice

1. [Introducción](#tesgin-en-angular-introduccion)
2. [Tipos de pruebas en Angular](#-tipos-de-pruebas-en-angular)
3. [Pruebas unitarias con Jasmine + Karma](#-pruebas-unitarias-con-jasmine--karma-por-defecto-en-angular)
   1. [Estructura de prueba típica](#-estructura-de-prueba-típica)
4. [Herramientas clave](#-herramientas-clave)
5. [Pruebas de servicios](#-pruebas-de-servicios)
6. [Comando para correr pruebas](#-comando-para-correr-pruebas)
7. [Alternativas modernas](#-alternativas-modernas)
8. [Recomendación de pruebas mínimas](#-recomendación-de-pruebas-mínimas)

---

# Tesgin en Angular: Introduccion

Hacer **testing en Angular** es fundamental para garantizar que tu aplicación funciona correctamente. Angular ofrece soporte completo para pruebas unitarias y pruebas de integración usando herramientas como **Jasmine**, **Karma**, y más recientemente, **Jest** o **Playwright** para pruebas end-to-end.

---

## 🧪 Tipos de pruebas en Angular

| Tipo de prueba       | Qué prueba                          | Herramientas comunes   |
| -------------------- | ----------------------------------- | ---------------------- |
| **Unitarias**        | Lógica de métodos, servicios, pipes | Jasmine + Karma / Jest |
| **Integración**      | Comportamiento entre componentes    | Jasmine + TestBed      |
| **End-to-End (E2E)** | Flujo completo como un usuario real | Playwright / Cypress   |

---

## ✅ Pruebas unitarias con Jasmine + Karma (por defecto en Angular)

Cuando generas un componente con Angular CLI (`ng generate component`), automáticamente se crea un archivo de prueba con `.spec.ts`.

### 📄 Estructura de prueba típica

```ts
describe('MiComponente', () => {
  let component: MiComponente;
  let fixture: ComponentFixture<MiComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiComponente ],
    }).compileComponents();

    fixture = TestBed.createComponent(MiComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe incrementar el contador', () => {
    component.incrementar();
    expect(component.contador).toBe(1);
  });
});
```

---

## 🧰 Herramientas clave

* **TestBed**: Configura un entorno de prueba como si fuese el módulo de Angular.
* **Fixture**: Objeto que conecta el componente con su DOM.
* **DetectChanges()**: Aplica el ciclo de vida y actualiza el DOM simulado.

---

## 🧪 Pruebas de servicios

```ts
describe('MiServicio', () => {
  let service: MiServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiServicio);
  });

  it('debe retornar 4 al sumar 2 + 2', () => {
    expect(service.sumar(2, 2)).toBe(4);
  });
});
```

---

## ▶️ Comando para correr pruebas

```bash
ng test
```

Esto ejecutará todas las pruebas unitarias en un navegador (Karma) y mostrará los resultados.

---

## 🚀 Alternativas modernas

Si quieres pruebas más rápidas y modernas:

* **Jest**: alternativa más rápida a Karma + Jasmine.

  ```bash
  ng add @briebug/jest-schematic
  ```

* **Playwright o Cypress** para E2E más estables que Protractor (ya obsoleto).

---

## 📚 Recomendación de pruebas mínimas

| Qué probar                         | Tipo        |
| ---------------------------------- | ----------- |
| Lógica de servicios                | Unitaria    |
| Métodos importantes de componentes | Unitaria    |
| Interacción usuario-DOM            | Integración |
| Flujos completos (login, carrito)  | E2E         |

