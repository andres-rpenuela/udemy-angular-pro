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
