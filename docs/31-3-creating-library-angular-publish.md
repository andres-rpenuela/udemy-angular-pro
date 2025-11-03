# NPM Publish - Publicar Librerías Angular

## ¿Qué es NPM Publish?

**NPM Publish** es el proceso de publicar una librería o paquete en el **registro de NPM** (Node Package Manager) para que otros desarrolladores puedan instalarla y utilizarla en sus proyectos.

### Conceptos clave

- **NPM Registry**: Repositorio público donde se almacenan los paquetes
- **Package**: Tu librería empaquetada y lista para distribución
- **Versioning**: Sistema de versionado semántico (SemVer)
- **Scope**: Namespace para organizar paquetes (@mi-org/mi-libreria)

## Preparación para la publicación

### 1. Verificar estructura del proyecto

```bash
# Verificar que la librería esté correctamente estructurada
mi-workspace/
├── package.json                    # Workspace package.json
├── projects/
│   └── devarp-side-menu/
│       ├── package.json           # ✅ Package.json de la librería
│       ├── ng-package.json        # ✅ Configuración de ng-packagr
│       ├── public-api.ts          # ✅ API pública
│       ├── README.md              # ✅ Documentación
│       └── src/
│           └── lib/
```

### 2. Configurar package.json de la librería

```json
// projects/devarp-side-menu/package.json
{
  "name": "@devarp/side-menu",
  "version": "1.0.0",
  "description": "A customizable side menu component for Angular applications",
  "keywords": [
    "angular",
    "side-menu",
    "navigation",
    "component",
    "ui"
  ],
  "author": {
    "name": "Tu Nombre",
    "email": "tu.email@ejemplo.com",
    "url": "https://tu-website.com"
  },
  "license": "MIT",
  "homepage": "https://github.com/tu-usuario/devarp-side-menu#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tu-usuario/devarp-side-menu.git"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/devarp-side-menu/issues"
  },
  "peerDependencies": {
    "@angular/common": "^20.0.0",
    "@angular/core": "^20.0.0"
  },
  "dependencies": {
    "tslib": "^2.3.0"
  },
  "sideEffects": false,
  "ng-update": {
    "migrations": "./migrations/migration-collection.json"
  }
}
```

### 3. Crear archivo README.md

```markdown
<!-- projects/devarp-side-menu/README.md -->
# @devarp/side-menu

A customizable and responsive side menu component for Angular applications.

## Features

- ✅ Responsive design
- ✅ Customizable styling
- ✅ Angular 20+ compatible
- ✅ Zoneless change detection support
- ✅ TypeScript support
- ✅ Accessibility compliant

## Installation

```bash
npm install @devarp/side-menu
```

## Usage

### Import the component

```typescript
import { DevarpSideMenu } from '@devarp/side-menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DevarpSideMenu],
  template: `
    <devarp-side-menu></devarp-side-menu>
  `
})
export class AppComponent {}
```

### Basic example

```html
<devarp-side-menu>
  <div>Your menu content here</div>
</devarp-side-menu>
```

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls menu visibility |
| `width` | `string` | `'250px'` | Menu width |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `toggleMenu` | `EventEmitter<boolean>` | Emitted when menu is toggled |

## Development

```bash
# Build the library
ng build devarp/side-menu

# Run tests
ng test devarp/side-menu

# Run linting
ng lint devarp/side-menu
```
> Nota: Aunque se visto en el punto `31-2-creating-library-angular-lint.md`, recordamos:
> El `lint o linting` es un proceso por el cual Angular analiza el código fuenta en busca de errores, bugs, problemas de estilo y malas practicas sin ejecutar código.
> Esta herramienta, esta incluida en Angular meidnate **ESLint**
> Aunque se puede instalar si nesta incluida:
>
> ```shell
> # Lint de todo el proyecto
> ng lint
> 
> # Lint de una librería específica (como en el caso)
> ng lint devarp-side-menu
> 
> # Lint con auto-corrección
> ng lint --fix
> 
> # Lint con máximo 0 warnings (calidad estricta)
> ng lint devarp-side-menu --max-warnings=0
> ```
>
> El **lint** en angular se puede configura mediante el archivo `.eslintrc.json`
> Y además, se puede incluiar como `script` para ejecutar como comando previo a publicación:
> 
> ```json
> //package.json
> {
>   "scripts": {
>     // Script individual de lint
>     "devarp-side-menu:lint": "ng lint devarp-side-menu --max-warnings=0",
>     
>     // Script que incluye lint antes del build
>     "devarp-side-menu:verify": "npm run devarp-side-menu:lint && npm run devarp-side-menu:test && npm run devarp-side-menu:build",
>     
>     // Script de publicación que ejecuta verificación completa
>     "devarp-side-menu:publish": "npm run devarp-side-menu:verify && cd dist/devarp-side-menu && npm publish --access public"
>   }
> }
> ```

## License

MIT © [Tu Nombre]

``` ```

### 4. Configurar ng-package.json

El archivo **ng-package.json** es la configuración de **ng-packagr**, la herramienta que Angular utiliza para empaquetar librerías y prepararlas para distribución en NPM. Te explico cada parte:

* **ng-packagr** toma tu código fuente TypeScript de la librería y lo convierte en múltiples formatos optimizados para diferentes entornos y bundlers.
* `$schema`: IntelliSense y valición del editor, así como, autocompletado, documentación ...
* `dest`: Ruta de salida dodne se generá la librería empaquetda
* `lib.entryFile`: Punto de entrada principal de la librearia (_archivo que exporta toda la API publicla, es como el `main` en el `package.json`_)
* `lib.cssUrl`: Manejo de estilos CSS. Donde `inline` indica que los esitlos se incluyen en el JavaScript o `external`si los CSS estan separados.
* `allowedNonPeerDependencies`: Dependencias permitidas que no son peerDependencies
```json
// projects/devarp-side-menu/ng-package.json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/devarp-side-menu",
  "lib": {
    "entryFile": "src/public-api.ts",
    "cssUrl": "inline"
  },
  "allowedNonPeerDependencies": [
    "tslib"
  ]
}
```

## Proceso de publicación

### 1. Verificar cuenta de NPM

```bash
# Verificar si estás logueado
npm whoami

# Si no estás logueado
npm login

# Crear cuenta nueva (si es necesario)
npm adduser
```

### 2. Build de la librería

```bash
# Desde el workspace root (mi-workspace/)
cd mi-workspace

# Build de la librería
ng build devarp-side-menu

# Verificar que el build fue exitoso
ls -la dist/devarp-side-menu/
```

### 3. Ejecutar pruebas y lint

```bash
# Ejecutar tests
ng test devarp-side-menu --watch=false

# Ejecutar linting
ng lint devarp-side-menu

# Verificar que no hay errores
ng lint devarp-side-menu --max-warnings=0
```

### 4. Verificar el contenido del paquete

```bash
# Navegar al directorio de distribución
cd dist/devarp-side-menu

# Ver contenido que se publicará
npm pack --dry-run

# Crear tarball para inspección (opcional)
npm pack
```

### 5. Publicar en NPM

```bash
# Desde dist/devarp-side-menu/
cd dist/devarp-side-menu

# Publicar versión inicial
npm publish

# Para organizaciones/scoped packages
npm publish --access public
```

## Versionado Semántico (SemVer)

### Formato: MAJOR.MINOR.PATCH

```bash
# Incrementar versión patch (1.0.0 → 1.0.1)
npm version patch

# Incrementar versión minor (1.0.1 → 1.1.0)
npm version minor

# Incrementar versión major (1.1.0 → 2.0.0)
npm version major
```

### Tipos de cambios

| Tipo | Cuándo usar | Ejemplo |
|------|-------------|---------|
| **PATCH** | Bug fixes, mejoras menores | `1.0.0 → 1.0.1` |
| **MINOR** | Nueva funcionalidad compatible | `1.0.1 → 1.1.0` |
| **MAJOR** | Breaking changes | `1.1.0 → 2.0.0` |

## Actualizar versiones

### 1. Actualizar versión en package.json

```bash
# En projects/devarp-side-menu/
cd projects/devarp-side-menu

# Incrementar versión
npm version patch
```

### 2. Build y publicar nueva versión

```bash
# Volver al workspace root
cd ../../

# Build de la nueva versión
ng build devarp-side-menu

# Publicar
cd dist/devarp-side-menu
npm publish
```

## Scripts automatizados

### Agregar scripts al package.json del workspace

```json
// mi-workspace/package.json
{
  "scripts": {
    "build:lib": "ng build devarp-side-menu",
    "test:lib": "ng test devarp-side-menu --watch=false",
    "lint:lib": "ng lint devarp-side-menu",
    "verify:lib": "npm run lint:lib && npm run test:lib && npm run build:lib",
    "publish:lib": "npm run verify:lib && cd dist/devarp-side-menu && npm publish",
    "publish:lib:patch": "cd projects/devarp-side-menu && npm version patch && cd ../../ && npm run publish:lib",
    "publish:lib:minor": "cd projects/devarp-side-menu && npm version minor && cd ../../ && npm run publish:lib",
    "publish:lib:major": "cd projects/devarp-side-menu && npm version major && cd ../../ && npm run publish:lib"
  }
}
```

### Uso de los scripts

```bash
# Verificar que todo está correcto
npm run verify:lib

# Publicar versión patch
npm run publish:lib:patch

# Publicar versión minor
npm run publish:lib:minor

# Publicar versión major
npm run publish:lib:major
```

## Mejores prácticas

### 1. Pre-publicación checklist

- ✅ **Tests pasando**: `ng test devarp-side-menu`
- ✅ **Lint sin errores**: `ng lint devarp-side-menu`
- ✅ **Build exitoso**: `ng build devarp-side-menu`
- ✅ **README actualizado**: Documentación completa
- ✅ **Versionado correcto**: SemVer apropiado
- ✅ **Changelog actualizado**: Registro de cambios

### 2. Estructura de archivos importante

```
dist/devarp-side-menu/
├── package.json           # ✅ Metadata del paquete
├── README.md             # ✅ Documentación
├── public-api.d.ts       # ✅ TypeScript definitions
├── lib/                  # ✅ Código compilado
├── esm2022/             # ✅ ES modules
├── fesm2022/            # ✅ Flat ES modules
└── bundles/             # ✅ UMD bundles
```

### 3. Configuración de .npmignore

```
# projects/devarp-side-menu/.npmignore
src/
*.spec.ts
*.spec.js
tsconfig.spec.json
karma.conf.js
.angular/
node_modules/
```

## Tags y releases

### Crear tags en Git

```bash
# Crear tag para la versión
git tag v1.0.0

# Push tags a repositorio
git push origin --tags

# Crear release en GitHub
# (Usar GitHub interface o GitHub CLI)
gh release create v1.0.0 --title "Version 1.0.0" --notes "Initial release"
```

## Publicación en registro privado

### Configurar registro privado

```bash
# Configurar registry privado
npm config set registry https://mi-registry-privado.com

# Publicar en registry privado
npm publish --registry https://mi-registry-privado.com

# Volver a registry público
npm config set registry https://registry.npmjs.org
```

## Monitoreo post-publicación

### Verificar publicación

```bash
# Verificar que se publicó correctamente
npm view @devarp/side-menu

# Ver todas las versiones
npm view @devarp/side-menu versions --json

# Ver downloads
npm view @devarp/side-menu --json
```

### Instalar en proyecto de prueba

```bash
# Crear proyecto de prueba
ng new test-app
cd test-app

# Instalar tu librería
npm install @devarp/side-menu

# Probar importación
echo "import { DevarpSideMenu } from '@devarp/side-menu';" >> src/app/app.component.ts
```

## Despublicación (solo si es necesario)

```bash
# ⚠️ Solo para versiones menores de 72 horas
npm unpublish @devarp/side-menu@1.0.0

# ⚠️ Despublicar todo el paquete (peligroso)
npm unpublish @devarp/side-menu --force
```

## CI/CD para publicación automática

### GitHub Actions ejemplo

```yaml
# .github/workflows/publish.yml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: ng test devarp-side-menu --watch=false
      
      - name: Run lint
        run: ng lint devarp-side-menu
      
      - name: Build library
        run: ng build devarp-side-menu
      
      - name: Publish to NPM
        run: cd dist/devarp-side-menu && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Resumen

La **publicación en NPM** es el proceso final para compartir tu librería con la comunidad:

1. **Preparación**: Package.json, README, documentación
2. **Verificación**: Tests, lint, build
3. **Versionado**: SemVer apropiado
4. **Publicación**: `npm publish`
5. **Monitoreo**: Verificar instalación y uso

### Comandos esenciales

```bash
# Workflow completo
npm run verify:lib        # Verificar calidad
npm version patch         # Incrementar versión
ng build devarp-side-menu # Build
cd dist/devarp-side-menu  # Navegar a dist
npm publish              # Publicar
```

Una vez publicada, tu librería estará disponible para toda la comunidad Angular y podrá instalarse con:

```bash
npm install @devarp/side-menu
```

¡Felicidades! Tu librería Angular ya está disponible públicamente en NPM.


---

# Anexo: Creando Scripts para publicar

Para automatizar el proceso de publicación de tu librería, puedes crear **scripts personalizados** en el `package.json` del workspace que ejecuten todas las tareas necesarias de forma secuencial.

## Scripts básicos por librería

Basta con ir al `package.json` del workspace y añadir los scripts específicos para cada librería:

```json
{
  "name": "mi-workspace",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",

    // Scripts específicos para devarp-side-menu
    "devarp-side-menu:build": "ng build devarp-side-menu",
    "devarp-side-menu:test": "ng test devarp-side-menu --no-watch --no-progress --browsers ChromeHeadlessNoSandbox",
    "devarp-side-menu:lint": "ng lint devarp-side-menu --max-warnings=0",
    "devarp-side-menu:verify": "npm run devarp-side-menu:lint && npm run devarp-side-menu:test && npm run devarp-side-menu:build",
    "devarp-side-menu:publish": "npm run devarp-side-menu:verify && cd dist/devarp-side-menu && npm publish --access public"
  }
}
```

## Explicación de cada script

### Scripts individuales

| Script | Función | Descripción |
|--------|---------|-------------|
| `devarp-side-menu:build` | **Compilar** | Construye la librería para distribución |
| `devarp-side-menu:test` | **Testing** | Ejecuta tests en modo CI (sin watch) |
| `devarp-side-menu:lint` | **Linting** | Verifica calidad de código (máximo 0 warnings) |
| `devarp-side-menu:verify` | **Verificación completa** | Ejecuta lint, test y build secuencialmente |
| `devarp-side-menu:publish` | **Publicación** | Verifica y publica en NPM |

### Parámetros importantes

#### Para testing
```bash
--no-watch          # No ejecutar en modo watch
--no-progress       # Sin barra de progreso (mejor para CI)
--browsers ChromeHeadlessNoSandbox  # Browser para CI/CD
```

#### Para linting
```bash
--max-warnings=0    # Fallar si hay warnings (calidad estricta)
```

#### Para publish
```bash
--access public     # Necesario para paquetes con scope (@devarp/*)
```

## Scripts de versionado automático

Para automatizar también el versionado, puedes añadir estos scripts adicionales:

```json
{
  "scripts": {
    // Scripts de versionado
    "devarp-side-menu:version:patch": "cd projects/devarp-side-menu && npm version patch",
    "devarp-side-menu:version:minor": "cd projects/devarp-side-menu && npm version minor", 
    "devarp-side-menu:version:major": "cd projects/devarp-side-menu && npm version major",
    
    // Scripts de publicación con versionado automático
    "devarp-side-menu:release:patch": "npm run devarp-side-menu:version:patch && npm run devarp-side-menu:publish",
    "devarp-side-menu:release:minor": "npm run devarp-side-menu:version:minor && npm run devarp-side-menu:publish",
    "devarp-side-menu:release:major": "npm run devarp-side-menu:version:major && npm run devarp-side-menu:publish"
  }
}
```

## Scripts genéricos para múltiples librerías

Si tienes varias librerías, puedes crear scripts genéricos:

```json
{
  "scripts": {
    // Scripts genéricos para todas las librerías
    "libs:build": "ng build",
    "libs:test": "ng test --no-watch --no-progress --browsers ChromeHeadlessNoSandbox",
    "libs:lint": "ng lint --max-warnings=0",
    "libs:verify": "npm run libs:lint && npm run libs:test && npm run libs:build",
    
    // Scripts específicos por librería
    "devarp-side-menu:publish": "npm run devarp-side-menu:verify && cd dist/devarp-side-menu && npm publish --access public",
    "otra-libreria:publish": "npm run otra-libreria:verify && cd dist/otra-libreria && npm publish --access public"
  }
}
```

## Uso de los scripts

### Desarrollo diario
```bash
# Verificar una librería antes de commit
npm run devarp-side-menu:verify

# Solo build
npm run devarp-side-menu:build

# Solo tests
npm run devarp-side-menu:test
```

### Publicación manual
```bash
# Publicar versión actual
npm run devarp-side-menu:publish

# Publicar nueva versión patch (1.0.0 → 1.0.1)
npm run devarp-side-menu:release:patch

# Publicar nueva versión minor (1.0.0 → 1.1.0) 
npm run devarp-side-menu:release:minor

# Publicar nueva versión major (1.0.0 → 2.0.0)
npm run devarp-side-menu:release:major
```

## Scripts avanzados con validaciones

Para mayor robustez, puedes crear scripts con validaciones adicionales:

```json
{
  "scripts": {
    // Script con validación de login NPM
    "devarp-side-menu:check-npm": "npm whoami || (echo 'No estás logueado en NPM' && exit 1)",
    
    // Script con validación Git
    "devarp-side-menu:check-git": "git diff-index --quiet HEAD -- || (echo 'Tienes cambios sin commitear' && exit 1)",
    
    // Script completo con todas las validaciones
    "devarp-side-menu:publish-safe": "npm run devarp-side-menu:check-npm && npm run devarp-side-menu:check-git && npm run devarp-side-menu:publish"
  }
}
```

## Scripts de utilidad adicionales

```json
{
  "scripts": {
    // Ver información del paquete publicado
    "devarp-side-menu:info": "npm view @devarp/side-menu",
    
    // Ver todas las versiones publicadas
    "devarp-side-menu:versions": "npm view @devarp/side-menu versions --json",
    
    // Crear tarball local para inspección
    "devarp-side-menu:pack": "npm run devarp-side-menu:build && cd dist/devarp-side-menu && npm pack",
    
    // Limpiar directorio dist
    "devarp-side-menu:clean": "rm -rf dist/devarp-side-menu",
    
    // Test local de la librería empaquetada
    "devarp-side-menu:test-pack": "npm run devarp-side-menu:pack && npm install ./dist/devarp-side-menu/*.tgz"
  }
}
```

## Configuración para CI/CD

Si usas estos scripts en CI/CD, puedes crear versiones específicas:

```json
{
  "scripts": {
    // Scripts optimizados para CI
    "ci:devarp-side-menu:test": "ng test devarp-side-menu --no-watch --no-progress --browsers ChromeHeadlessNoSandbox --code-coverage",
    "ci:devarp-side-menu:lint": "ng lint devarp-side-menu --format json --output-file reports/lint-results.json",
    "ci:devarp-side-menu:build": "ng build devarp-side-menu --configuration production",
    "ci:devarp-side-menu:publish": "npm run ci:devarp-side-menu:test && npm run ci:devarp-side-menu:lint && npm run ci:devarp-side-menu:build && cd dist/devarp-side-menu && npm publish --access public"
  }
}
```

## Ejemplo de package.json completo

```json
{
  "name": "mi-workspace",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",

    // Scripts de desarrollo para devarp-side-menu
    "devarp-side-menu:build": "ng build devarp-side-menu",
    "devarp-side-menu:test": "ng test devarp-side-menu --no-watch --no-progress --browsers ChromeHeadlessNoSandbox",
    "devarp-side-menu:lint": "ng lint devarp-side-menu --max-warnings=0",
    "devarp-side-menu:verify": "npm run devarp-side-menu:lint && npm run devarp-side-menu:test && npm run devarp-side-menu:build",
    
    // Scripts de versionado
    "devarp-side-menu:version:patch": "cd projects/devarp-side-menu && npm version patch",
    "devarp-side-menu:version:minor": "cd projects/devarp-side-menu && npm version minor",
    "devarp-side-menu:version:major": "cd projects/devarp-side-menu && npm version major",
    
    // Scripts de publicación
    "devarp-side-menu:publish": "npm run devarp-side-menu:verify && cd dist/devarp-side-menu && npm publish --access public",
    "devarp-side-menu:release:patch": "npm run devarp-side-menu:version:patch && npm run devarp-side-menu:publish",
    "devarp-side-menu:release:minor": "npm run devarp-side-menu:version:minor && npm run devarp-side-menu:publish",
    "devarp-side-menu:release:major": "npm run devarp-side-menu:version:major && npm run devarp-side-menu:publish",
    
    // Scripts de utilidad
    "devarp-side-menu:info": "npm view @devarp/side-menu",
    "devarp-side-menu:clean": "rm -rf dist/devarp-side-menu",
    "devarp-side-menu:pack": "npm run devarp-side-menu:build && cd dist/devarp-side-menu && npm pack"
  },
  "private": true,
  "dependencies": {
    // ... dependencias
  }
}
```

## Beneficios de usar scripts personalizados

### ✅ Automatización completa
- Un solo comando ejecuta todo el flujo
- Reduce errores manuales
- Estandariza el proceso

### ✅ Facilidad de uso
- Comandos memorables y descriptivos
- No necesitas recordar parámetros complejos
- Workflow consistente

### ✅ Integración con CI/CD
- Scripts pueden reutilizarse en pipelines
- Mismo comportamiento local y en CI
- Fácil debugging

### ✅ Escalabilidad
- Fácil añadir nuevas librerías
- Patrones reutilizables
- Mantenimiento centralizado

Con estos scripts, publicar tu librería se convierte en un proceso simple y confiable de un solo comando.
Bastará con hacer el comando `mi-workspace>npx npm run devarp-side-menu:publish`, para publicar nuestra librearia