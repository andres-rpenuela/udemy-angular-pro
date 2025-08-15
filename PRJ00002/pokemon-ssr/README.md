# PokemonSsr

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Uso de tailwindcss 3
Link: https://v3.tailwindcss.com/docs/guides/angular


## Despliegue

[netfly](https://app.netlify.com/teams/andres-rpenuela/projects)

Basta con desplegar el contenido de la carpeta `dist/browser` en el deply,

Si no se usa ssr, antes se debe activar el sistema de rutas basado en hash (#/ruta) para que Angular maneje la navegación sin depender del servidor. 

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // uso de Zoneless, e incompatible con provideZoneChangeDetection
    provideZonelessChangeDetection(),
    // para usar Zone.js, de frma avanzada
    //provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideClientHydration(withEventReplay())
  ]
};
```

Después de compilar (ng build), abre tu app y asegúrate de que las rutas se vean así:
```
https://tusitio.com/#/inicio
https://tusitio.com/#/productos
```

En el caso de que se use Angular **CSR, SSR y Prerendering** y esto genere el `index.csr.html`

1️⃣ Crear el archivo _redirects correctamente

Crea el archivo exactamente así (sin extensión, con guion bajo al inicio):

> `src/_redirects`

```bash
# O se renombre a index.html
/* /index.csr.html 200
```

> Nota: Se puede renombrar el fichero que genera el build en dist, a `index.html`

2️⃣ Asegurar que Angular lo copie al build

Esto le dice a Angular que copie el archivo al hacer el build.

> `angular.json`

```json
"assets": [
  {
    "glob": "**/*",
    "input": "public",
    "output": "/"
  },
  "src/_redirects"
],
```

> Nota si se crea rel fichero en "public", no hace falta añadir "src/_redirects"

3️⃣ Hacer el build y verificar

```bahs
ng build --configuration production
```
Ahora abre la carpeta dist/tu-app/ y verifica que el archivo _redirects esté allí, al mismo nivel que index.html.

Ejemplo:
```css

dist/
└── tu-app/
    ├── index.csr.html
    ├── main.js
    ├── styles.css
    └── _redirects  ✅
```

4️⃣ Desplegar a Netlify

Cuando subas esa carpeta a Netlify (ya sea con netlify deploy o arrastrando en la web), Netlify leerá _redirects y hará que cualquier ruta no encontrada redirija a index.csr.html.

<details>
💡 Tip adicional:
Si quieres evitar depender del _redirects, también puedes usar un netlify.toml en la raíz del proyecto con:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
````

Pero igual este archivo debe quedar incluido en la raíz del deploy.
</details>

--- 

Perfecto, vamos a analizar tu `package.json` y ver por qué Angular está usando CSR en tu build actual.

---

### 🔹 Puntos clave de tu proyecto

1. Tienes instalada la dependencia:

```json
"@angular/ssr": "^20.1.5"
```

Esto significa que tu proyecto **soporta SSR**, pero SSR no se activa automáticamente cuando haces un build simple con:

```bash
ng build
```

2. Tu `scripts`:

```json
"build": "ng build",
"serve:ssr:pokemon-ssr": "node dist/pokemon-ssr/server/server.mjs"
```

* `ng build` → **solo genera la versión CSR**, que termina en `index.csr.html`.
* Para usar SSR real, deberías correr algo como:

```bash
ng run pokemon-ssr:server
```

y luego usar `serve:ssr:pokemon-ssr`.

3. Dependencias de SSR como `@angular/platform-server` y `express` están instaladas, pero **no se están usando en tu build de producción actual** porque `ng build` solo construye la app cliente (CSR).

---

### 🔹 Conclusión

Actualmente, Angular está generando **CSR** porque:

* Estás corriendo solo `ng build` (sin `server` ni `prerender`).
* No estás levantando un servidor Node que ejecute SSR (`serve:ssr:pokemon-ssr` nunca se usa).
* Por eso el build genera `index.csr.html` como fallback CSR y no un `index.html` que pueda usar Netlify directamente.

En otras palabras: **SSR está instalado pero no se está ejecutando**, así que el build cae automáticamente en CSR.

---

Si quieres, puedo explicarte **cómo hacer que tu build genere un `index.html` listo para Netlify usando solo CSR o prerender**, sin depender de SSR ni Node. Esto resolvería tu problema del 404.

¿Quieres que haga eso?
