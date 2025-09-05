### 📝 Ideas principales para apuntes de testing en Angular 20

#### 1. **Estructura básica de un test**

* Se usa `describe('...', () => { ... })` para agrupar las pruebas de un componente o servicio.
* Cada caso de prueba se define con `it('...', () => { ... })`.

---

#### 2. **Configuración del entorno de pruebas**

* `beforeEach(async () => { ... })` configura el **TestBed** antes de cada prueba.
* `TestBed.configureTestingModule({...}).compileComponents()`:

  * `imports: [App]` → se importa el componente principal.
  * `providers: [provideRouter([])]` → se inyectan dependencias necesarias, como el router (incluso rutas vacías).

---

#### 3. **Creación de componentes de prueba**

* `fixture = TestBed.createComponent(App);` → crea una instancia del componente en pruebas.
* `app = fixture.componentInstance;` → accede a la clase del componente.
* `compiled = fixture.nativeElement as HTMLElement;` → accede al DOM renderizado.

---

#### 4. **Ejemplos de tests**

* **Crear el componente:**

  ```ts
  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
  ```

* **Verificar elementos renderizados:**

  ```ts
  it('should render the navbar and router-outlet', () => {
    expect(app.title()).toEqual('pokemon-ssr');
    expect(compiled.querySelector('navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
  ```

* *(Ejemplo comentado en tu código: probar el texto de un `<h1>`)*

  ```ts
  expect(compiled.querySelector('h1')?.textContent)
    .toContain('Hello, pokemon-ssr');
  ```

---

#### 5. **Limpieza después de cada test**

* `afterEach(() => TestBed.resetTestingModule());`

  * Restablece el entorno de pruebas.
  * Importante en Angular 15+ para evitar **fugas de estado o conflictos** con nuevas APIs como **signals**.

---

📌 En resumen:

1. Configurar **TestBed** con imports y providers.
2. Crear el **fixture**, obtener `componentInstance` y el `nativeElement`.
3. Escribir pruebas con `expect(...)` verificando creación y renderizado.
4. Usar `resetTestingModule` al final para limpiar.

---

## Componentes Mocks

1. Crear el comentoe a mocker dentro del test o en un direcotrio aparte
2. Importalo:
  1. Opción A: Usando `overrideComponent`

```ts
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

describe('App', () => {

  // varaibles comunes para las pruebas
  let fixture: ComponentFixture<App>;
  let app: App;
  let compiled: HTMLElement;

  // Componente mock para NavbarComponent
  // se puede crear fuera del test
  @Component({
    selector: 'navbar',
    template: '<div>Mock Navbar</div>'
  })
  class MockNavbarComponent {}

  // test setup
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        //provideZonelessChangeDetection(),
        provideRouter([]), // 👈 añade providers del router, unas rutas vacías
      ]
    })
    .overrideComponent(App,{
      add: {
        imports: [MockNavbarComponent]
      }, // 👈 añade el componente mock
      remove: {
        imports: [NavbarComponent] // 👈 elimina el componente real
      }
    })
    .compileComponents();

    // Crear el componente y obtener la instancia y el elemento compilado
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render the navbar and rotuer-outlet', () => {
    // se crea el componente de la aplicación para acceder a sus propiedades y al DOM, de fora unica en este test
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any; // 👈 para acceder a la propiedad title (que es property) "engañar a TypeScript"
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges(); // disparar la detección de cambios para actualizar el DOM, sin esto e1 queda en blanco y no carga

    expect(app.title()).toEqual('pokemon-ssr');

    expect(compiled.querySelector('navbar')).toBeTruthy()
    const navbar = compiled.querySelector('navbar') as HTMLElement;
    expect(navbar.querySelector('div')?.textContent).toContain('Mock Navbar');

    expect(compiled.querySelector('router-outlet')).not.toBeNull();

  });


  afterEach(() => {
     TestBed.resetTestingModule();
  });
});
```

  2. Opcón B: Menos recomendada pero mas liberta o descoplameinto, y sería en usar la siguiente declaracion

```ts
// ... 

beforeEach(async () => {
    // ! NO RECOMENDADO ya que no carga las depednecias que no se especifican
    TestBed.overrideComponent(App, {
      set: {
        imports: [MockNavbarComponent] // 👈 añade el componente mock, EL RESTO DE IMPORTOS DEL COMPONETE APP NO SE CARGAN
        ,schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 Que los elementos que no se carge no hacer nada como router-outlet
      }
     });
    // ! Reomomendado para cargar los mock
    // await TestBed.configureTestingModule({
    //   imports: [App],
    //   providers: [
    //     //provideZonelessChangeDetection(),
    //     provideRouter([]), // 👈 añade providers del router, unas rutas vacías
    //   ]
    // })
    // .overrideComponent(App,{
    //   add: {
    //     imports: [MockNavbarComponent]
    //   }, // 👈 añade el componente mock
    //   remove: {
    //     imports: [NavbarComponent] // 👈 elimina el componente real
    //   }
    // })
    // .compileComponents();

    // Crear el componente y obtener la instancia y el elemento compilado
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });
```

----

## Pruebas de App Router

¡Genial! 🚀
En Angular, para testear **rutas** se suele usar el módulo `RouterTestingModule`, que permite simular navegación y verificar qué componente se carga en un `<router-outlet>`.

---

## 🔹 1. Configuración de ejemplo de rutas

Supongamos que tienes algo así en `app-routing.module.ts`:

```ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
];
```

---

## 🔹 2. Testear que `router-outlet` existe

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent routing', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]), // 👈 inicializar en blanco o con rutas mock
      ],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
```

---

## 🔹 3. Testear navegación a una ruta en un compontente

Aquí ya definimos rutas reales en `RouterTestingModule`.

```ts
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

// componentes fake para probar
@Component({ template: '<p>Home works!</p>' })
class HomeComponent {}

@Component({ template: '<p>About works!</p>' })
class AboutComponent {}

describe('Router: App', () => {
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: HomeComponent },
          { path: 'about', component: AboutComponent },
        ]),
      ],
      declarations: [AppComponent, HomeComponent, AboutComponent],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation(); // 👈 arranca el router
  });

  it('should navigate to "" redirects to HomeComponent', fakeAsync(() => {
    router.navigate(['']);
    tick(); // simula paso de tiempo asincrónico
    fixture.detectChanges();

    expect(location.path()).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Home works!');
  }));

  it('should navigate to "about"', fakeAsync(() => {
    router.navigate(['/about']);
    tick();
    fixture.detectChanges();

    expect(location.path()).toBe('/about');
    expect(fixture.nativeElement.textContent).toContain('About works!');
  }));
});
```

## 🔹 4. Testear navegación a una ruta (providerRoute)

```ts
import { Location } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { routes } from "./app.routes";
import { Router } from "@angular/router";

describe('Route: App', () => {

  let router: Router;
  let location: Location;

  beforeEach(async() => {
    // Configurar el entorno de pruebas con las rutas
    await TestBed.configureTestingModule({
      providers: [ provideRouter(routes) ] // 👈 Proveer las rutas reales
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });


  it('should have a route for "about" to AboutComponent', () => {
    // Aquí iría la lógica para comprobar la ruta "about"
    router.navigate(['about']);
    expect(location.path()).toBe('/about');
  })

});
```
---

## 📌 Resumen

* Usa `RouterTestingModule.withRoutes()` para definir rutas de prueba.
* `router.navigate([...])` + `tick()` para simular navegación asincrónica.
* Comprueba con `location.path()` la URL.
* Comprueba con el DOM (`fixture.nativeElement`) que el componente correcto se renderiza.

---

Perfecto 🚀 Te resumo las **ideas principales** para que puedas tener tus **apuntes de testing de rutas en Angular 20** a partir de tu snippet:

---
Genial 👍 Te integro todo en un **único documento de apuntes / cheatsheet** que combina **tests de componentes** y **tests de rutas en Angular 20**:

---

# 📝 Apuntes de Testing en Angular 20

## 🔹 1. Configuración básica de pruebas con TestBed

* Se define un entorno de pruebas para cada suite (`describe`).
* `beforeEach` se usa para configurar el **TestBed** antes de cada test.
* `afterEach` permite limpiar el entorno con `TestBed.resetTestingModule()`.

Ejemplo:

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [App],               // Componente principal
    providers: [ provideRouter([]) ] // Router vacío o rutas reales
  }).compileComponents();

  fixture = TestBed.createComponent(App);
  app = fixture.componentInstance;
  compiled = fixture.nativeElement as HTMLElement;
});

afterEach(() => {
  TestBed.resetTestingModule();
});
```

---

## 🔹 2. Testing de Componentes

### ✅ Crear el componente

```ts
it('should create the app', () => {
  expect(app).toBeTruthy();
});
```

### ✅ Verificar renderizado de elementos

```ts
it('should render navbar and router-outlet', () => {
  expect(app.title()).toEqual('pokemon-ssr');
  expect(compiled.querySelector('navbar')).toBeTruthy();
  expect(compiled.querySelector('router-outlet')).not.toBeNull();
});
```

### ✅ Verificar contenido en el DOM

```ts
it('should render title in <h1>', () => {
  fixture.detectChanges();
  expect(compiled.querySelector('h1')?.textContent)
    .toContain('Hello, pokemon-ssr');
});
```

---

## 🔹 3. Testing de Rutas

### 3.1 Configurar TestBed con Router

* Se inyectan las rutas reales (`routes`) para simular navegación:

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    providers: [ provideRouter(routes) ]
  });

  router = TestBed.inject(Router);
  location = TestBed.inject(Location);
});
```

👉 Esto asegura que los tests usen la misma configuración de rutas que la app.

---

### 3.2 Verificar navegación entre rutas

* `router.navigate(['ruta'])` → simula navegación.
* `location.path()` → obtiene la URL actual.

Ejemplos:

```ts
it('should navigate to /about', async () => {
  await router.navigate(['about']);
  expect(location.path()).toBe('/about');
});

it('should navigate to /pricing', async () => {
  await router.navigate(['pricing']);
  expect(location.path()).toBe('/pricing');
});

it('should redirect unknown routes to /about', async () => {
  await router.navigate(['unkown']);
  expect(location.path()).toBe('/about');
});
```

---

### 3.3 Comprobar rutas dinámicas

```ts
it('should navigate to /pokemons/page/1', async () => {
  await router.navigate(['pokemons/page/1']);
  expect(location.path()).toBe('/pokemons/page/1');
});
```

---

### 3.4 Verificar carga de componentes (`loadComponent`)

* Buscar la ruta en el array `routes`.
* Usar `await route.loadComponent!()` para cargar dinámicamente el componente.
* Verificar que se define y corresponde al esperado.

Ejemplo para **AboutPageComponent**:

```ts
it('should load AboutPageComponent from "about" route', async () => {
  const route = routes.find(r => r.path === 'about')!;
  expect(route).toBeDefined();

  const component = (await route.loadComponent!()) as any;
  expect(component).toBeDefined();
  expect(component.default.name).toBe('AboutPageComponent2');
});
```

Ejemplo para **PokemonsPageComponent**:

```ts
it('should load PokemonsPageComponent from "pokemons/page/:page"', async () => {
  const route = routes.find(r => r.path === 'pokemons/page/:page')!;
  expect(route).toBeDefined();

  const component = (await route.loadComponent!()) as any;
  expect(component).toBeDefined();
  expect(component.default.name).toBe('PokemonsPageComponent2');
});
```

---

## ✅ Buenas prácticas

* Siempre usar `provideRouter(routes)` con las rutas reales para tests de navegación.
* Usar `TestBed.resetTestingModule()` en `afterEach` para limpiar.
* Probar:

  * Creación de componentes.
  * Renderizado de elementos clave.
  * Rutas estáticas, dinámicas y redirecciones.
  * Carga de componentes con `loadComponent`.

---

Perfecto 👌 Aquí tienes los **apuntes en forma de snippets** para testing de un **componente con inputs** en Angular 20, basados en tu ejemplo con `PokemonCardComponent`:

---

# 📝 Apuntes: Testing de Componentes con Inputs en Angular 20

## 1. **Configurar el entorno de pruebas**

* Se importa el componente a testear.
* Se provee `Router` si el template usa directivas como `routerLink`.

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [PokemonCardComponent],
    providers: [ provideRouter([]) ] // necesario para RouterLink
  }).compileComponents();

  fixture = TestBed.createComponent(PokemonCardComponent);
  component = fixture.componentInstance;
  compiled = fixture.nativeElement as HTMLElement;
});
```

---

## 2. **Asignar Inputs al componente**

* Se usa `fixture.componentRef.setInput('inputName', value)`
* Se debe ejecutar `fixture.detectChanges()` después para renderizar.

```ts
fixture.componentRef.setInput('pokemon', { id: 1, name: 'pikachu' });
fixture.detectChanges();
```

---

## 3. **Verificar creación del componente**

```ts
it('should create the component', () => {
  expect(component).toBeTruthy();
});
```

---

## 4. **Verificar renderizado de inputs**

* Se asigna un valor al `@Input` antes de `detectChanges()`.
* Se valida el contenido renderizado en el DOM.

```ts
it('should render pokemon name', () => {
  fixture.componentRef.setInput('pokemon', { id: 1, name: 'bulbasaur' });
  fixture.detectChanges();
  expect(compiled.textContent).toContain('bulbasaur');
});
```

---

## 5. **Notas importantes**

* `fixture.detectChanges()` es obligatorio después de cambiar inputs.
* `compiled = fixture.nativeElement` permite acceder al DOM renderizado.
* Usar `provideRouter([])` si el template contiene `routerLink`.
* Los **mocks de inputs** deben seguir la interfaz (`SimplePokemon` en este caso).

---

👉 En resumen:

1. Configurar `TestBed` con el componente.
2. Crear el fixture y el componente.
3. Pasar valores a los `@Input` con `setInput`.
4. Ejecutar `detectChanges` para actualizar el DOM.
5. Validar que el renderizado coincida con el valor del input.

---

# NG-REFLECT de ROUTER-LINK
Cuando Angular renderiza un componente con @Input() o directivas (como routerLink), en el DOM de pruebas (cuando usas fixture.nativeElement) se ve un atributo auxiliar llamado ng-reflect-....

👉 Ejemplo:

Si tu template tiene algo así:
```html
<a [routerLink]="['/pokemons', pokemon().id]">
  {{ pokemon().name }}
</a>
```

En el test, Angular generará algo como:

```html
<a ng-reflect-router-link="/pokemons/1">bulbasaur</a>
```

El atributo ng-reflect-router-link es solo para depuración y pruebas. En producción no existe.

El test se vería:

```ts
it('should have the proper ng-reflect-router-link', () => {
  // busca el enlace
  const anchor: HTMLAnchorElement | null = compiled.querySelector('a');

  expect(anchor).not.toBeNull();
  expect(anchor?.getAttribute('ng-reflect-router-link'))
    .toBe(`/pokemons/${mockPokemon.id}`);
});
```

## 🔹 Alternativa más robusta (sin ng-reflect-*) (Opcion recomenda)

Como ng-reflect-router-link no existe en producción, la mejor práctica es testear el valor real del RouterLink directive.
Para eso, Angular ofrece By.directive(RouterLink) con DebugElement.

Ejemplo:
```ts
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

it('should navigate to the correct route when clicking the link', () => {
  const debugEl = fixture.debugElement.query(By.directive(RouterLink));
  const routerLinkInstance = debugEl.injector.get(RouterLink);
  const routerLinkInstance2 = debugEl.injector.get(RouterLinkWithHref) as any;
  console.log(routerLinkInstance)
  console.log(routerLinkInstance2)

  //expect(routerLinkInstance['routerLinkInput']).toEqual(['/pokemon', mockPokemon.name]); // nulo en Angular 20
  expect(routerLinkInstance['commands']).toEqual(['/pokemons', mockPokemon.id]); // funciona en Angular 20
});
```

🔑 Resumen:

* ng-reflect-router-link es solo un atributo auxiliar que Angular pinta en el DOM en modo test/debug.
* Puedes testearlo directamente con getAttribute('ng-reflect-router-link').
* Pero lo más recomendable en proyectos grandes es usar By.directive(RouterLink) para testear el valor real del RouterLink.

----

# Acceso al elemento `img`

Quieres obtener la referencia a la imagen del Pokémon (<img>) en tu test.

En tu template tienes esto:

<img
  class="w-24 h-24"
  width="96px"
  height="96px"
  [src]="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + pokemon().id + '.png'"
  [alt]="pokemon().name"
  #pokemonImg>

### Opción 1: Usando querySelector

En tu test puedes acceder al <img> directamente por la etiqueta:

```html
it('should render the pokemon image with correct src and alt', () => {
  const img: HTMLImageElement | null = compiled.querySelector('img');

  expect(img).not.toBeNull();
  expect(img?.src).toContain(mockPokemon.id); // que el src incluya el ID
  expect(img?.alt).toBe(mockPokemon.name);   // que el alt sea el nombre
});
```

### Opción 2: Usando data-testid (más robusto)

Modifica tu HTML para agregar un identificador de test:
```html
<img
  data-testid="pokemon-img"
  class="w-24 h-24"
  width="96px"
  height="96px"
  [src]="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + pokemon().id + '.png'"
  [alt]="pokemon().name">
```

Y en el test:
```ts
const img: HTMLImageElement | null = compiled.querySelector('[data-testid="pokemon-img"]');

expect(img).not.toBeNull();
expect(img?.src).toBe(
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${mockPokemon.id}.png`
);
expect(img?.alt).toBe(mockPokemon.name);
```

> 👉 Yo recomiendo usar data-testid para que tus tests no dependan de clases de Tailwind ni del orden de elementos.


--- 

# Acceso por nombre de clases

Si En tu querySelector estás usando directamente las clases de Tailwind como si fueran un selector de CSS:

```ts
compiled.querySelector('font-bold text-xl mb-2 text-center capitalize')
```

👉 Esto no es válido en CSS, porque querySelector espera selectores como .miClase o div.miClase.

En tu caso deberías poner `.` antes de cada clase si quieres encadenar clases. Ejemplo:

```ts
compiled.querySelector('.font-bold.text-xl.mb-2.text-center.capitalize');
```

---

## Test de Servicios con peticiones HTTP
