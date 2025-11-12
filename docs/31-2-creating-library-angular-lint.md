# Lint

## ¿Qué es Lint?

**Lint** (o **Linting**) es el proceso de analizar código fuente para detectar **errores**, **bugs potenciales**, **problemas de estilo** y **malas prácticas** sin ejecutar el código.

### Definición y concepto

El término "lint" viene de una herramienta de Unix llamada `lint` que analizaba código C para encontrar construcciones problemáticas o no portables.

En el contexto de Angular/JavaScript/TypeScript, un **linter** es una herramienta que:

- ✅ **Analiza código estáticamente** (sin ejecutarlo)
- ✅ **Detecta errores** de sintaxis y lógica
- ✅ **Enforza estándares** de codificación
- ✅ **Sugiere mejoras** de código
- ✅ **Previene bugs** comunes

## Herramientas de Linting en Angular

### ESLint (Principal en Angular moderno)

```bash
# Instalar ESLint para Angular
ng add @angular-eslint/schematics

# Ejecutar lint
ng lint

# Lint de librería específica
ng lint my-lib
# ejemplo
# mi-workspace
# npx ng lint devarp-side-menu

# Lint con auto-fix
ng lint --fix
```
> Nota: Se recomienda ejecutar antes de hacer cada publicacion.

### Configuración de ESLint

#### .eslintrc.json (archivo de configuración)

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@angular-eslint/recommended",
        "@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        "@typescript-eslint/no-unused-vars": "error",
        "prefer-const": "error",
        "no-var": "error"
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "@angular-eslint/template/recommended",
        "@angular-eslint/template/accessibility"
      ],
      "rules": {}
    }
  ]
}
```

#### angular.json (configuración del comando)

```json
{
  "projects": {
    "my-lib": {
      "architect": {
        "lint": {
          "builder": "@angular-eslint/builder:lint",
          "options": {
            "lintFilePatterns": [
              "projects/my-lib/**/*.ts",
              "projects/my-lib/**/*.html"
            ]
          }
        }
      }
    }
  }
}
```

## Tipos de problemas que detecta el Lint

### 1. Errores de sintaxis

```typescript
// ❌ Error detectado por lint
function myFunction() {
  const name = 'John'
  return name  // Missing semicolon
}

// ✅ Corregido
function myFunction() {
  const name = 'John';
  return name;
}
```

### 2. Variables no utilizadas

```typescript
// ❌ Lint error: 'unusedVariable' is declared but never used
function calculate() {
  const result = 10;
  const unusedVariable = 20; // Esta variable nunca se usa
  return result;
}

// ✅ Corregido
function calculate() {
  const result = 10;
  return result;
}
```

### 3. Problemas de Angular

```typescript
// ❌ Lint error: Component selector should use kebab-case
@Component({
  selector: 'MyComponent', // Debería ser kebab-case
  template: '<div></div>'
})

// ✅ Corregido
@Component({
  selector: 'my-component', // kebab-case
  template: '<div></div>'
})
```

### 4. Problemas de accesibilidad en templates

```html
<!-- ❌ Lint error: Missing alt attribute -->
<img src="photo.jpg">

<!-- ✅ Corregido -->
<img src="photo.jpg" alt="User profile photo">
```

### 5. Problemas de TypeScript

```typescript
// ❌ Lint error: Prefer const over let
let config = { api: 'https://api.com' }; // Never reassigned

// ✅ Corregido  
const config = { api: 'https://api.com' };
```

## Comandos de Lint en Angular

### Comandos básicos

```bash
# Lint de todo el proyecto
ng lint

# Lint de una librería específica
ng lint my-lib

# Lint con auto-corrección
ng lint --fix

# Lint de archivos específicos
ng lint --files="src/app/**/*.ts"
```

### Lint en CI/CD

```bash
# En scripts de CI - fallar si hay errores
ng lint --max-warnings=0

# Generar reporte
ng lint --format=json --output-file=lint-results.json
```

## Reglas comunes de ESLint para Angular

### Reglas de TypeScript

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/no-inferrable-types": "error"
  }
}
```

### Reglas de Angular

```json
{
  "rules": {
    "@angular-eslint/no-empty-lifecycle-method": "error",
    "@angular-eslint/use-lifecycle-interface": "error", 
    "@angular-eslint/no-input-rename": "error",
    "@angular-eslint/no-output-on-prefix": "error"
  }
}
```

### Reglas de accesibilidad

```json
{
  "rules": {
    "@angular-eslint/template/alt-text": "error",
    "@angular-eslint/template/click-events-have-key-events": "error",
    "@angular-eslint/template/label-has-associated-control": "error"
  }
}
```

## Integración con IDEs

### Visual Studio Code

```json
// .vscode/settings.json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "html"
  ],
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Extensiones recomendadas

- **ESLint** (Microsoft)
- **Angular Language Service**
- **Prettier** (para formateo)

## Scripts útiles en package.json

```json
{
  "scripts": {
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "lint:lib": "ng lint my-lib",
    "lint:ci": "ng lint --max-warnings=0",
    "lint:report": "ng lint --format=json --output-file=reports/lint.json"
  }
}
```

## Beneficios del Linting

### Para el desarrollo

- ✅ **Detecta errores temprano** (antes de runtime)
- ✅ **Mantiene consistencia** de código
- ✅ **Mejora legibilidad** del código
- ✅ **Previene bugs** comunes
- ✅ **Enforza mejores prácticas**

### Para el equipo

- ✅ **Estándar unificado** de código
- ✅ **Code reviews** más eficientes
- ✅ **Onboarding** más fácil para nuevos developers
- ✅ **Menos conflictos** en merges

### Para el producto

- ✅ **Código más mantenible**
- ✅ **Menos bugs** en producción
- ✅ **Performance** mejorado
- ✅ **Accesibilidad** garantizada

## Ejemplo práctico: Lint en librería Angular

```bash
# En tu workspace mi-workspace
cd mi-workspace

# Lint de la librería devarp-side-menu
ng lint devarp-side-menu

# Si hay errores, auto-corregir lo que se pueda
ng lint devarp-side-menu --fix

# Verificar que no queden errores
ng lint devarp-side-menu --max-warnings=0
```

### Salida típica de lint

```
Linting "devarp-side-menu"...

projects/devarp-side-menu/src/lib/devarp-side-menu.service.ts
  5:7   error  'unused' is declared but never used  @typescript-eslint/no-unused-vars
  12:15 warning Use const instead of let           prefer-const

projects/devarp-side-menu/src/lib/devarp-side-menu.component.html  
  3:5   error  Missing alt attribute              @angular-eslint/template/alt-text

✖ 3 problems (2 errors, 1 warning)
  1 error and 1 warning potentially fixable with the --fix option.
```

## Configuración específica para librerías

### Configurar ESLint para una librería

```json
// projects/my-lib/.eslintrc.json
{
  "extends": "../../.eslintrc.json",
  "ignorePatterns": ["!**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "lib",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element", 
            "prefix": "lib",
            "style": "kebab-case"
          }
        ]
      }
    }
  ]
}
```

### Lint como parte del build process

```json
// angular.json
{
  "projects": {
    "my-lib": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "projects/my-lib/ng-package.json"
          }
        },
        "lint": {
          "builder": "@angular-eslint/builder:lint",
          "options": {
            "lintFilePatterns": [
              "projects/my-lib/**/*.ts",
              "projects/my-lib/**/*.html"
            ]
          }
        }
      }
    }
  }
}
```

## Pre-commit hooks con Husky

### Instalar y configurar

```bash
# Instalar husky y lint-staged
npm install --save-dev husky lint-staged

# Configurar husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Configurar lint-staged

```json
// package.json
{
  "lint-staged": {
    "projects/**/*.{ts,html}": [
      "ng lint --fix",
      "git add"
    ],
    "projects/**/*.{ts,html,scss,css}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

## Resumen

**Lint** es una herramienta **esencial** para mantener **calidad de código** en proyectos Angular. Actúa como un "**control de calidad automático**" que:

1. **Previene errores** antes de que lleguen a producción
2. **Enforza estándares** de codificación
3. **Mejora la mantenibilidad** del código
4. **Facilita el trabajo en equipo**

Es parte fundamental del **flujo de desarrollo profesional** y debería ejecutarse regularmente, idealmente integrado en:

- **Pre-commit hooks**
- **CI/CD pipelines** 
- **Editor/IDE** (en tiempo real)
- **Code review process**

En el contexto de librerías Angular, el linting es especialmente importante porque:

- ✅ **Garantiza consistencia** en APIs públicas
- ✅ **Detecta problemas** antes de la distribución
- ✅ **Mantiene estándares** across diferentes librerías
- ✅ **Facilita el mantenimiento** a largo plazo

---

Este enfoque de monorepo con librerías permite crear arquitecturas escalables, reutilizar código eficientemente y mantener consistencia across múltiples aplicaciones.