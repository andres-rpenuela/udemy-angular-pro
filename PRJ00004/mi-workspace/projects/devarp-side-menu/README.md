# DevarpSideMenu

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0.

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

To build the library, run:

```bash
ng build devarp-side-menu
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/devarp-side-menu
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

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



# Importate

En cada cambio del lib ejecutar siempre antes, **como mínimo**:

```bash
# Desde el workspace root (mi-workspace/)
ng build devarp-side-menu

# Verificar que se generaron los archivos
ls -la dist/devarp-side-menu/

# Verificar el contenido del index.d.ts generado
cat dist/devarp-side-menu/index.d.ts
```

Y luego lanzar la cama de pruebas:

```bash
# Desde el workspace root (mi-workspace/)
npx npm run start dev-testdev-app -o
```


Organización por secciones:

```
🔵 Main: Summary, Projects, Notifications, Reports
👤 Profile: Profile
⚙️ Settings: App Settings, Project Settings
❓ Help: Help Center
🔐 Auth: Login, Logout
Resultado esperado:
```


## Modar Dark/Light

Características del toggle:

- Toggle animado con iconos de sol y luna
- Transiciones suaves entre temas
- Clases dinámicas para todos los elementos
- Accesibilidad completa con ARIA labels
- Posicionamiento flexible en el header
- Opcional - se puede ocultar con showThemeToggle

```html
<!-- En el template del componente padre -->
<lib-devarp-side-menu
  [isDarkMode]="isDarkMode()"
  [showThemeToggle]="true"
  (onThemeChange)="onThemeChange($event)"
  [navItems]="menuItems"
  [isAuthenticated]="isAuthenticated">
</lib-devarp-side-menu>
```
