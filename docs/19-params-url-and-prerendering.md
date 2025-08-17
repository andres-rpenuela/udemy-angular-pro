# 📖 Apuntes: Prerendering con Parámetros en Angular (v18–20)

> Nota: Estos apuntes explican cómo manejar **rutas con parámetros dinámicos o query params** en Angular cuando se usa **prerendering** o SSR (Angular Universal / AppShell).

---

## 📑 Índice

1. 🚨 Problema
2. 🔑 Conceptos Clave
3. 🔧 Soluciones

   * 3.1 Definir `getPrerenderParams`
   * 3.2 Cambiar `renderMode` en rutas
   * 3.3 Desactivar prerendering
4. 📝 Apuntes Rápidos
5. 💡 Consejo Práctico

---

## 1. 🚨 Problema

Cuando una ruta tiene **parámetros dinámicos** (`/pokemon/:id`) o **query params** (`/pokemon?id=1`) y tienes **prerendering activo**, Angular **no sabe qué combinaciones generar en build**. Esto produce el error:

```
The 'pokemon/:id' route uses prerendering and includes parameters, 
but 'getPrerenderParams' is missing.
```

---

## 2. 🔑 Conceptos Clave

* **SSR (Server-Side Rendering):** Renderiza contenido dinámico en el servidor bajo demanda.
* **Prerendering:** Genera HTML estático durante el build para un conjunto fijo de rutas.
* **Parámetros dinámicos o query:** Angular necesita que tú definas explícitamente **qué valores** deben prerenderizarse.

---

## 3. 🔧 Soluciones

### 3.1 ✅ Definir `getPrerenderParams`

Si quieres prerenderizar rutas con parámetros dinámicos, crea un archivo `app.routes.server.ts` con:

```ts
import type { GetPrerenderParams } from '@angular/ssr';
import { RenderMode, ServerRoute } from '@angular/ssr';

// Definición de rutas server
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Prerender } // prerender todas las rutas conocidas
];

// Definir rutas dinámicas concretas
export const getPrerenderParams: GetPrerenderParams = async () => [
  { route: '/pokemon/1' },
  { route: '/pokemon/2' },
  { route: '/pokemon/3' },

  // Ejemplo con query params
  { route: '/pokemon', params: { id: '4' } },
  { route: '/pokemon', params: { id: '5' } },
];
```

#### 📌 Comentarios

* Solo se prerenderizan las rutas que pongas en `getPrerenderParams`.
* Si visitas `/pokemon/50` que **no está definido**, en prerendering:

  * Con SSR (`renderMode: 'server'`): se genera en tiempo real.
  * Solo CSR (`renderMode: 'client'`): se renderiza en el navegador.
  * Prerender sin definir la ruta → 404 estático.

---

### 3.2 ✅ Cambiar `renderMode` en rutas

Si no quieres prerender dinámicos, usa SSR o CSR en lugar de prerender:

```ts
// app.router.ts
import { Route } from '@angular/router';
import PokemonPageComponent from './pages/pokemon-page/pokemon-page.component';

export const routes: Route[] = [
  {
    path: 'pokemon/:id',
    component: PokemonPageComponent
  }
];
```

Y en `app.routes.server.ts`:

```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'pokemon/:id',
    renderMode: RenderMode.Server // SSR dinámico
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender // prerendering para rutas fijas
  }
];
```

#### 🔹 Comentarios

* `renderMode: 'prerender'` → requiere `getPrerenderParams`.
* `renderMode: 'server'` → se genera dinámicamente en el servidor (SSR).
* `renderMode: 'client'` → solo se renderiza en navegador (SPA clásico).

---

### 3.3 ✅ Desactivar prerendering

En `angular.json`, dentro de la sección `prerender`:

```json
"prerender": {
  "builder": "@angular-devkit/build-angular:prerender",
  "options": {
    "routes": [
      "/",
      "/about",
      "/contact"
      // ❌ No incluyas rutas con parámetros dinámicos
    ]
  }
}
```

#### 🔹 Comentarios

* Las rutas no listadas no se prerenderizan.
* Se renderizarán dinámicamente vía SSR o CSR.
* Útil si tienes rutas infinitas o muchos parámetros (como Pokémon 1–1000).

---

## 4. 📝 Apuntes Rápidos

* `:id` en rutas → necesita `getPrerenderParams` o `renderMode` adecuado.
* `?id=` en query → también requiere combinaciones definidas en `getPrerenderParams`.
* Prerender para páginas **limitadas y conocidas** (`/about`, `/contact`).
* Rutas con muchos parámetros → mejor SSR o CSR.

---

## 5. 💡 Consejo Práctico

* SEO para los primeros **50 Pokémon** → usa `getPrerenderParams`.
* Todos los Pokémon (1–1000) → usar `renderMode: 'server'`.
* Evitar prerendering en rutas infinitas, sino se complican los builds.

---
