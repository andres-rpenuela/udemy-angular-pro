### Generar Build compilando test en seungdo plano.

[Link](https://angular.dev/guide/testing)

1. Modificar en el package.json de la aplicaion, para que se vea tal que así:

```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve -o --port 4200",
    "build": "npm run test && npm run prerender && ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test --no-watch --no-progress --browsers=ChromeHeadless",
    "serve:ssr:pokemon-ssr": "node dist/pokemon-ssr/server/server.mjs",
    "prerender": "ng run pokemon:prerender --routes='/'"
  },
```
> Se cambia `ng test` por `ng test --no-watch --no-progress --browsers=ChromeHeadless`, para que no habra el terminal de jasmine.
> Se concante la ejecuión de los test + la construcción `ng build` -> `npm run test && npm run prerender:routes && ng build`
2. Generar la build

```bash
...\udemy-angular-pro\PRJ00002\pokemon-ssr>npx npm run build
```

--- 
Perfecto, vamos a ponerlo claro. 😄

Si quieres que **tu `package.json` funcione con Angular 20** usando prerender **sin necesidad de un script `prerender-routes.js`**, puedes hacerlo así:

---

### 1️⃣ Explicación del argumento `prerender`

* `"prerender"` → ahora usa directamente el comando oficial de Angular 20.
* `--routes='/'` → prerenderiza la ruta `/`.
* Para rutas dinámicas (`/pokemon/1`, `/pokemon/25`), agregas todas las rutas separadas por comas:

```json
"prerender": "ng run pokemon:prerender --routes='/,/pokemon/1,/pokemon/25,/pokemon/100'"
```

* Así ya no necesitas el archivo `prerender-routes.js`.

---

### 2️⃣ Ejecución

```bash
npm run prerender
```

* Angular generará HTML estático para cada ruta listada en `--routes`.
* Los archivos se crean en `dist/pokemon/browser/` (según tu configuración Universal).

---

### 3️⃣ Bonus: Si quieres prerender dinámico automáticamente

* Puedes usar un **script Node** opcional que genere la lista de rutas dinámicas desde un JSON o API:

```js
// scripts/prerender-dynamic.js
const { execSync } = require('child_process');

const pokemonIds = [1, 25, 100]; // lista dinámica de Pokémon
const routes = ['/', ...pokemonIds.map(id => `/pokemon/${id}`)].join(',');

execSync(`ng run pokemon:prerender --routes="${routes}"`, { stdio: 'inherit' });
```

* Luego en `package.json`:

```json
"prerender:dynamic": "node scripts/prerender-dynamic.js"
```

* Esto reemplaza la necesidad de escribir manualmente todas las rutas en `--routes`.
