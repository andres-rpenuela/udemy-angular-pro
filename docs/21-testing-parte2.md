# Testing parte 2.

Errores comunes en la aplicación de Angular 20+ SSR 

##  Error NG0201 No provider found for ActivatedRoute 

El error:
```
ɵNotFound: NG0201: No provider found for ActivatedRoute
```

➡️ Angular no encontró un proveedor del servicio ActivatedRoute en el árbol de inyección de dependencias.

Esto ocurre cuando intentas inyectar ActivatedRoute en un componente fuera del contexto de un RouterModule o cuando no configuraste correctamente el enrutador.

Causas comunes:

* Falta de provideRouter() en el arranque (main.ts en apps standalone).
* El componente standalone no tiene acceso al contexto del router.
* Intentas usar ActivatedRoute en un componente que no fue cargado como parte de una ruta.
* En apps SSR, puede faltar provideServerRendering() junto al router.

### Para el caso:
El test unitario falla por: el App (standalone) usa router (RouterOutlet, routerLink, o ActivatedRoute) pero en el test no has registrado el provider de rutas.

En Angular standalone ya no se usa RouterTestingModule, sino que se recomienda usar provideRouter() en el TestBed.

✅ Test corregido con provideRouter([])
```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],  // tu componente standalone principal
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]), // 👈 añade providers del router
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, pokemon-ssr');
  });
});
```

>  🔎 Explicación
>  
>  `provideRouter([])` → registra el contexto de router (incluyendo ActivatedRoute) aún si no defines rutas.
>  
>  Si tu componente depende de rutas concretas, puedes pasar un array de rutas mockeadas en lugar de [].
>  
>  Ejemplo con rutas de prueba:
>  ```ts
>  provideRouter([
>    { path: 'pokemon/:id', component: DummyPokemonPage }
>  ])
>  ```
>  

--- 

## Error: NG0908: In this configuration Angular requires Zone.js

Angular necesita Zone.js para ejecutar su mecanismo de detección de cambios a menos que explícitamente habilites el modo zoneless.

Este error indica que:

> No tienes Zone.js cargado (probablemente lo quitaste de polyfills.ts o del package.json).

➡️ No configuraste bien provideZonelessChangeDetection() en bootstrapApplication o en TestBed.

Causas más comunes

* Eliminaste import 'zone.js' de polyfills.ts.
* Estás usando Angular 17+ con Zoneless mode, pero en tests no configuraste providers correctamente.
* Configuraste provideZonelessChangeDetection() en TestBed, pero tu test o el componente importado depende de cosas que internamente requieren Zone.js.

### Para el caso

✅ Opción 1: Mantener zoneless también en los tests (no usar Zone.js)

* Abre tu test.ts (_el que arranca Angular tests_).
* Quita esta línea si existe:
```ts
import 'zone.js/testing';
```

* Deja tu test como lo tienes ahora (con provideZonelessChangeDetection() y provideRouter([])).
* Con eso todos los tests correrán sin Zone.js.

✅ Opción 2: Mantener Zone.js solo en tests (más estable ahora mismo)

* En test.ts, asegúrate que existe:
    ```ts
    import 'zone.js/testing';
    ```

    En Angular 20, ya no se necesita el fichero `test.ts`, y carga directamente los `*.spec.ts` según lo definido en `angular.json`. asegura que tu fichero, debería haber algo como esto:

    ```json
    "test": {
    "builder": "@angular/build:karma",
    "options": {
        "tsConfig": "tsconfig.spec.json",
        "polyfills": [
        "zone.js",          // 👈 zona principal
        "zone.js/testing"   // 👈 utilidades de testing
        ],
        "assets": [
        {
            "glob": "**/*",
            "input": "public",
            "output": "/"
        },
        "src/_redirects"
        ],
        "styles": [
        "src/styles.css"
        ]
    }
    }
    ```
    Puede que se se neceiste instalar solo para los test la dependencia de `npm install zone.js --save-dev`
    
> 🔎 Nota: Qué hace tu tsconfig.spec.json
> * Extiende de tsconfig.json → hereda paths, strict mode, etc.
> * Define salida en ./out-tsc/spec.
> * Declara que los tipos de Jasmine ("types": ["jasmine"]) están disponibles → así puedes usar describe, it, expect, etc.
> * Incluye todos los archivos src/**/*.ts → así entran también los *.spec.ts.


* Quita provideZonelessChangeDetection() de tus tests (_lo dejas solo en main.ts de la app_).
Ejemplo:
```ts
await TestBed.configureTestingModule({
  imports: [App],
  providers: [
    provideRouter([]), // solo router
  ]
}).compileComponents();
```
* De esta manera tu app corre zoneless, pero los tests usan Zone.js (menos fricción con librerías como Karma, TestBed y dependencias antiguas).

> 🚀 Recomendación
> 
> * Hoy en Angular 17/18, lo más estable es usar Opción 2:
> * App → Zoneless (provideZonelessChangeDetection() en main.ts).
> * Tests → con Zone.js (import 'zone.js/testing' en test.ts) y sin provideZonelessChangeDetection() en TestBed.