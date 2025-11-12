# Ejecutar librearía dentro de monorepo

Para probar la librearia sin tener que estar compilando la aplicación e importarla en una aplicación, lo que se puede hacer es **crear** una **aplicación angular** dentro del **monorepo**

1. Ir al direcotrio del workspace o monorepo (**importate generar aquí el proyecto**)
2. Crear una aplicaicón Angular
```bash
cd mi-workspace
ng generate application dev-testdev-app
```

> Nota: Con esto tenemos una **cama de pruebas**, para ir probando los diferntes librerias que se crean en el workspace. Puede usar SSR o no, lo ideal es que fuera lo más parecido a las aplicaciones a las que va destiando.

3. Ejecutar el proyecto y abrir en el navegador lo antes posible
```bash
ng serve dev-testdev-app -o
```

Ahora para importar nuestro `sid-menu`, basta con hacer una importación directa, en el componente donde se va utilizar (_para el ejemplo, se hace en el compnente principal del app_).

> Nota: Dado que se encuentra en el mismo workspace, basta con hacer un import directamente, si no habría que hacer un `npm install`

```ts
//aps.ts del dev-testdev-app

// Importar el side-menu de la libreria, como es un mone repo, se puede importar directamente
import {  } from 'devarp-side-menu';

```

Y del modulo o librería se podrá importar todo lo que esté expueto en `public-api.ts` de la librerái `devarp-side-menu`

```ts
//public-api.ts de devarp-side-menu

/*
 * Public API Surface of devarp-side-menu
 */

export * from './lib/devarp-side-menu';
export * from './lib/devarp-side-menu.service';
```

Por tanto, para usar el componente de la librearía en nuestra cama de pruebas

```ts
//aps.ts del dev-testdev-app

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevarpSideMenu } from 'devarp-side-menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DevarpSideMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dev-testdev-app');
}
```

```html
<!-- app.html de dev-testdev-app -->
 <h1>Hola mundo!</h1>
<p>Bienvenido a nuestra aplicación de prueba de desarrollo.</p>
<lib-devarp-side-menu></lib-devarp-side-menu>
```

**Imporate**: Si se hace un cambio en la libería, se debe compilbar o hacer build de esta para reflejarlo.
