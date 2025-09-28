
# 🌍 Environments en Angular

## 📑 Índice

1. [¿Qué son los environments?](#1-qué-son-los-environments)
2. [Archivos de entorno por defecto](#2-archivos-de-entorno-por-defecto)
3. [Creación de entornos adicionales (staging, QA, etc.)](#3-creación-de-entornos-adicionales-staging-qa-etc)
4. [Configuración en `angular.json`](#4-configuración-en-angularjson)
5. [Cambio de entorno por defecto en `ng serve`](#5-cambio-de-entorno-por-defecto-en-ng-serve)
6. [Uso en componentes y servicios](#6-uso-en-componentes-y-servicios)
7. [Ejemplos de comandos](#7-ejemplos-de-comandos)
8. [Alternativa con `.env` y Webpack](#8-alternativa-con-env-y-webpack)
9. [Conclusión](#9-conclusión)

---

## 1. ¿Qué son los environments?

En Angular, los **environments** son una forma de definir variables y configuraciones diferentes según el entorno de ejecución:

* **Development (dev):** pruebas locales.
* **Staging (stage):** pruebas internas o QA.
* **Production (prod):** aplicación en vivo.

👉 Angular CLI reemplaza los archivos de environment automáticamente en el build según el `--configuration`.

---

## 2. Archivos de entorno por defecto

Angular crea en `src/environments/`:

* `environment.ts` → para **desarrollo**.
* `environment.prod.ts` → para **producción**.

### Ejemplo `environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  companyName: 'Mi Empresa (Dev)'
};
```

### Ejemplo `environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.miempresa.com',
  companyName: 'Mi Empresa'
};
```

---

## 3. Creación de entornos adicionales (staging, QA, etc.)

Puedes crear manualmente más archivos en la carpeta `src/environments/`, por ejemplo:

```
src/environments/environment.stage.ts
```

### Ejemplo `environment.stage.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://staging.miempresa.com/api',
  companyName: 'Mi Empresa (Stage)'
};
```

---

## 4. Configuración en `angular.json`

El `angular.json` indica qué archivo usar en cada entorno con la propiedad **fileReplacements**:

```json
"configurations": {
  "development": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.ts"
      }
    ]
  },
  "stage": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.stage.ts"
      }
    ]
  },
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  }
}
```

---

## 5. Cambio de entorno por defecto en `ng serve`

Por defecto:

```bash
ng serve
```

👉 siempre usa **development** (`environment.ts`).

Si quieres que arranque en **stage**, edita en `angular.json` la sección `serve` y agrega `"defaultConfiguration": "stage"`:

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "mi-app:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "mi-app:build:production"
    },
    "stage": {
      "browserTarget": "mi-app:build:stage"
    }
  },
  "defaultConfiguration": "stage"
}
```

Ahora `ng serve` arrancará con **stage** automáticamente.

---

## 6. Uso en componentes y servicios

En cualquier clase puedes importar el environment:

### Ejemplo en componente:

```ts
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  template: `<h1>{{ env.companyName }}</h1>`
})
export class HeaderComponent {
  env = environment;
}
```

### Ejemplo en servicio:

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
```

---

## 7. Ejemplos de comandos

* **Desarrollo (default):**

```bash
ng serve
```

* **Stage:**

```bash
ng serve --configuration=stage
ng build --configuration=stage
```

* **Producción:**

```bash
ng build --configuration=production
```

---

## 8. Alternativa con `.env` y Webpack

Angular no soporta `.env` nativamente, pero puedes hacerlo con **dotenv + custom webpack**:

1. Instalar:

```bash
npm install dotenv @angular-builders/custom-webpack --save-dev
```

2. En `angular.json`:

```json
"builder": "@angular-builders/custom-webpack:browser"
```

3. Crear `webpack.config.js`:

```js
const Dotenv = require('dotenv-webpack');
module.exports = {
  plugins: [ new Dotenv() ]
};
```

4. Uso:

```ts
console.log(process.env['API_URL']);
```

⚠️ Ojo: nunca guardes secretos sensibles en `.env` del frontend, siempre estarán expuestos.

---

## 9. Conclusión

* ✅ Angular ya trae **environments** listos para dev/prod.
* 🔄 Puedes crear entornos adicionales (`stage`, `qa`, etc.) fácilmente.
* ⚙️ En `angular.json` decides qué archivo se usa en cada build.
* 🔧 Puedes cambiar el **default de `ng serve`** para que arranque en otro entorno.
* ⚠️ `.env` con Webpack es opcional, pero nunca debe usarse para secretos.

---

# 📎 Anexo unificado: Generación de archivos de environment basico

Angular CLI, proporciona un comando para generar los archivos de `enviromentsp` para desarrollo y producón automáticmante:
```bash
# Ir al proyecto
cd gitsapp/

# Generar archivo de environment
ng generate environments
```
Si necesitas más entornos (ej: `staging` o `qa`), despues de ejcutar el anterior, los puedes puedes crear manualmente:

* `environment.staging.ts`
* `environment.qa.ts`

Modificnado la configuración en `angular.json`, para incluirlos en la opción **fileReplacements**, y determinar qué archivo cargar en cada build.

Ejemplo en `angular.json`:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
  //....
}
```
En el componente, servicio, o cualquier otra clase que carge una varaible del entorno, se siguirá usando el `enviroment` de producción ya que el compilador de Angular se encargára de hacer la tranducción correspondiente.

```ts
// ejemplo en un componente
import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'gifs-side-menu-header',
  templateUrl: './gifs-side-menu-header.component.html',
  styleUrl: './gifs-side-menu-header.component.css',
  standalone: true
})
export class GifsSideMenuHeaderComponent {
  protected envs = environment;
}

// ejemplo, en un servicio (ejemplo con `HttpClient`):
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
```

Lo mismo cuando se hace referencias en las plantilals,  las variables del entorno:

```html
<!-- En el HTML del componente puedes usar directamente las variables-->
<a>{{ envs.companyName }}</a>
```

---

# 📎 Anexo unificado: Generar `environments` en Angular desde `.env-template`

## 🎯 Objetivo

Automatizar la creación de los archivos `src/environments/` (`environment.ts`, `environment.prod.ts`, `environment.staging.ts`, etc.) a partir de un único archivo **`.env-template`**, cada vez que ejecutes `ng build`.

---

## 🔹 Paso 1: Crear archivo `.env-template`

En la raíz del proyecto define todas tus variables, separadas por entorno:

```env
# Desarrollo
API_URL_DEV=http://localhost:3000/api
COMPANY_NAME_DEV=Mi Empresa (DEV)

# Staging
API_URL_STAGING=https://staging.miempresa.com/api
COMPANY_NAME_STAGING=Mi Empresa (STAGING)

# Producción
API_URL_PROD=https://miempresa.com/api
COMPANY_NAME_PROD=Mi Empresa
```

👉 Si solo quieres **dev** y **prod**, basta con definir `*_DEV` y `*_PROD`.

---

## 🔹 Paso 2: Script `set-env.js`

En la raíz del proyecto crea `set-env.js`:

```js
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { resolve, dirname } = require('path');
const dotenv = require('dotenv');

// Cargar variables desde .env-template
const result = dotenv.config({ path: '.env-template' });
if (result.error) {
  throw result.error;
}

// Lista de entornos soportados
const environments = [
  {
    name: 'dev',
    file: 'environment.development.ts',
    production: false,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_DEV,
    companyName: process.env.COMPANY_NAME_DEV,
  },
  {
    name: 'staging',
    file: 'environment.staging.ts',
    production: false,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_STAGING,
    companyName: process.env.COMPANY_NAME_STAGING,
  },
  {
    name: 'prod',
    file: 'environment.prod.ts',
    production: true,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_PROD,
    companyName: process.env.COMPANY_NAME_PROD,
  },
   {
    name: 'base',
    file: 'environment.ts', // 👈 este es el que Angular importa siempre
    production: false,
    apiUrl: process.env.GITHUB_ANGULAR_PATH_BASE_DEV, // por defecto apunta a dev
    companyName: process.env.COMPANY_NAME_DEV,
  }
];

environments.forEach(env => {
  const targetPath = resolve(__dirname, `./src/environments/${env.file}`);

  // 📌 Crea la carpeta environments si no existe
  mkdirSync(dirname(targetPath), { recursive: true });

  // 📌 Crea o sobrescribe el archivo environment
  const content = `
export const environment = {
  production: ${env.production},
  GITHUB_ANGULAR_PATH_BASE: '${env.apiUrl}',
  COMPANY_NAME: '${env.companyName}'
};
`;

  // si no eixte los crea, y si no los actualiza
  writeFileSync(targetPath, content.trim(), { encoding: 'utf-8' });
  console.log(`✅ Archivo generado/actualizado: ${targetPath}`);

  // Solo escribe si no existe, o si quieres forzar, usa siempre writeFileSync
  //if (!existsSync(targetPath)) {
  //  writeFileSync(targetPath, content.trim(), { encoding: 'utf-8' });
  //  console.log(`✅ Archivo creado: ${targetPath}`);
  //} else {
  //  console.log(`ℹ️ Ya existe: ${targetPath}`);
  //}
});
```

👉 Este script:

* Lee el `.env-template`.
* Genera los archivos `environment.development.ts`, `environment.staging.ts` y `environment.prod.ts`.
* Define `production: true` automáticamente en el entorno prod.

---

## 🔹 Paso 3: Configuración en `angular.json`

Configura los `fileReplacements` + `server`para que Angular use el archivo correcto según el entorno:

```json
  "build": {
    //...
    "configurations": {
      "development": {
        "optimization": false,
        "extractLicenses": false,
        "sourceMap": true,
        "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ]
      },
      "staging": {
        "optimization": false,
        "extractLicenses": false,
        "sourceMap": true,
        "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.staging.ts"
          }
        ]
      },
      "production": {
        "budgets": [
          {
            "type": "initial",
            "maximumWarning": "500kB",
            "maximumError": "1MB"
          },
          {
            "type": "anyComponentStyle",
            "maximumWarning": "4kB",
            "maximumError": "8kB"
          }
        ],
        "outputHashing": "all",
        "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.prod.ts"
          }
        ]
      }
    },
    "defaultConfiguration": "production" // configuración que Angular usará por defecto cuando corras un comando de `build` sin especificar --configuration, 
  }
  "serve": {
    //"builder": "@angular-devkit/build-angular:dev-server", // si se quiere usar la build oficila
    "builder": "@angular/build:dev-server",
    "configurations": {
      "production": {
        "buildTarget": "github-issues:build:production"
      },
      "development": {
        "buildTarget": "github-issues:build:development"
      },
      "staging": {
        "buildTarget": "github-issues:build:staging"
      }
    },
    "defaultConfiguration": "development" // configuración que Angular usará por defecto cuando corras un comando de `serve` sin especificar --configuration, 
  },
  // ..
```

---

## 🔹 Paso 4: Scripts en `package.json`

Agrega en tu `package.json`:

```json
"scripts": {
  "ng": "ng",

  // Genera los enviroments e iniciar el Servidor local - perfil development por defecto
  "init": "node set-env.js && ng serve -o --port 4200",

  // Servidor local  - perfil development por defecto
  "start": "ng serve -o --port 4200",

  // Genera los environments antes de compilar
  "prebuild": "node set-env.js",

  // Builds con entornos
  "build:dev": "npm run prebuild && ng build --configuration development",
  "build:staging": "npm run prebuild && ng build --configuration staging",
  "build:prod": "npm run prebuild && ng build --configuration production",

  // Serve con entornos
  "serve:dev": "npm run prebuild && ng serve --configuration development -o --port 4200",
  "serve:staging": "npm run prebuild && ng serve --configuration staging -o --port 4201",
  "serve:prod": "npm run prebuild && ng serve --configuration production -o --port 4202",

  // Otros comandos Angular
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

---

## 🔹 Paso 5: Uso en Angular

En cualquier componente o servicio:

```ts
import { environment } from '../environments/environment';

console.log(environment.apiUrl);
```

👉 Angular tomará el archivo correcto dependiendo del build que ejecutes.

---

## 🔹 Flujo de trabajo
* `npm run prebuild` → genera los `environment.ts` + `.env` a aprtir del `.env-template`
* `npm run init`  → genera los enviroments y lanzar el servidor local


* `npm run build:dev` → genera `environment.ts` con variables `*_DEV`.
* `npm run build:staging` → genera `environment.staging.ts` con variables `*_STAGING`.
* `npm run build:prod` → genera `environment.prod.ts` con variables `*_PROD`.

> Nota: Importante tener instlado `npm install dotenv @angular-builders/custom-webpack --save-dev`

---

## ✅ Conclusión

* Puedes mantener **un solo `.env-template`** centralizado.
* El script genera automáticamente todos los environments necesarios.
* Escalable: si mañana necesitas `qa` o `testing`, solo agregas variables `*_QA` en el `.env-template` y una entrada más en el array del script.


---

# 📎 Anexo unificado: Inicar `ng start` con el entonro `stage`

Cuando haces simplemente:

```bash
ng serve
```

Angular usa por **default el entorno `development`**, es decir, el archivo:

```bash
src/environments/environment.ts
```

🔹 Eso significa que **NO** usa ni `stage` ni `prod`, salvo que tú se lo indiques con la opción `--configuration`.

Ejemplos:

* Servir en **stage**:

  ```bash
  ng serve --configuration=stage
  ```
* Servir en **producción**:

  ```bash
  ng serve --configuration=production
  ```

👉 Entonces, el comando `ng serve` **sin parámetros arranca siempre en `development`**.

Si quieres que **`ng serve`** arranque directamente con otro entorno (por ejemplo `stage`), tienes que cambiar la configuración en tu `angular.json`.

### 1. Ubicar la sección de serve

En `angular.json`, busca algo así dentro de tu proyecto:

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "tu-proyecto:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "tu-proyecto:build:production"
    },
    "stage": {
      "browserTarget": "tu-proyecto:build:stage"
    }
  }
}
```

### 2. Definir el defaultTarget

Agrega (o edita) la propiedad `"defaultConfiguration"` para que apunte a `stage`:

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "tu-proyecto:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "tu-proyecto:build:production"
    },
    "stage": {
      "browserTarget": "tu-proyecto:build:stage"
    }
  },
  "defaultConfiguration": "stage"
}
```

### 3. Resultado

Ahora cuando ejecutes:

```bash
ng serve
```

👉 arrancará automáticamente con el entorno **stage**, sin necesidad de pasar `--configuration=stage`.

---

¿Quieres que te arme un ejemplo de `angular.json` completo con **dev, stage y prod listos** para copiar y pegar?


TODO: REACER BIEN ESTOS APUTNES