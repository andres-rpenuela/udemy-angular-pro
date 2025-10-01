# 🌍 Environments en Angular

## 📑 Índice

1. ¿Qué son los environments?
2. Archivos de entorno por defecto
3. Crear entornos adicionales (staging, QA, etc.)
4. Configuración en `angular.json`
5. Cambiar entorno por defecto en `ng serve`
6. Uso en componentes y servicios
7. Ejemplos de comandos
8. Alternativa con `.env` y Webpack
9. Seguridad: ¿Dónde guardar secretos?
10. Automatización con `.env-template` y scripts
11. Ejemplo completo de configuración
12. Conclusión

---

## 1. ¿Qué son los environments?

En Angular, los **environments** permiten definir variables y configuraciones distintas según el entorno de ejecución:

- **Development (dev):** pruebas locales.
- **Staging (stage):** pruebas internas o QA.
- **Production (prod):** aplicación en vivo.

👉 Angular CLI reemplaza los archivos de environment automáticamente en el build según el `--configuration`.

---

## 2. Archivos de entorno por defecto

Angular crea en `src/environments/`:

- `environment.ts` → para **desarrollo**.
- `environment.prod.ts` → para **producción**.

**Ejemplo `environment.ts`:**

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  companyName: 'Mi Empresa (Dev)'
};
```

**Ejemplo `environment.prod.ts`:**

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.miempresa.com',
  companyName: 'Mi Empresa'
};
```

---

## 3. Crear entornos adicionales (staging, QA, etc.)

Puedes crear manualmente más archivos en la carpeta `src/environments/`, por ejemplo:

```
src/environments/environment.stage.ts
```

**Ejemplo `environment.stage.ts`:**

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

## 5. Cambiar entorno por defecto en `ng serve`

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

**Ejemplo en componente:**

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

**Ejemplo en servicio:**

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

- **Desarrollo (default):**

  ```bash
  ng serve
  ```

- **Stage:**

  ```bash
  ng serve --configuration=stage
  ng build --configuration=stage
  ```

- **Producción:**

  ```bash
  ng build --configuration=production
  ```

---

## 8. Alternativa con `.env` y Webpack

Angular no soporta `.env` nativamente, pero puedes hacerlo con **dotenv + custom webpack**.

`webpack.config.js` es el archivo de configuración principal de Webpack, una herramienta de bundling para aplicaciones web modernas.

En este archivo defines cómo Webpack debe procesar, transformar y empaquetar los archivos de tu proyecto (JavaScript, CSS, imágenes, etc.) antes de servirlos o construirlos para producción.

En Angular, normalmente no necesitas editarlo, pero si usas builders personalizados (como @angular-builders/custom-webpack), puedes crear tu propio webpack.config.js para:

- Añadir plugins (_por ejemplo, dotenv-webpack para variables de entorno_).
- Personalizar loaders (_cómo se procesan archivos .ts, .css, .md, etc._).
- Modificar la salida del build.

**Ejemplo:**
```js
const Dotenv = require('dotenv-webpack');
module.exports = {
  plugins: [ new Dotenv() ]
};
```

**Importante:**
⚠️ Nunca guardes secretos sensibles en `.env` del frontend, siempre estarán expuestos.

---

## 9. Seguridad: ¿Dónde guardar secretos?

- Los secretos (tokens, client_secret, etc.) deben estar en el backend.
- El frontend nunca debe tener acceso directo a los secretos.
- El backend gestiona el flujo OAuth2 y expone solo datos públicos al frontend.

---

## 10. Automatización con `.env-template`y  `.env` + scripts

Puedes automatizar la generación de archivos de environment usando un único `.env` y un script Node.js (`set-env.js`).

**Ejemplo de `.env-template` y  `.env`:**
```env
API_URL_DEV=http://localhost:3000/api
COMPANY_NAME_DEV=Mi Empresa (DEV)

API_URL_STAGING=https://staging.miempresa.com/api
COMPANY_NAME_STAGING=Mi Empresa (STAGING)

API_URL_PROD=https://miempresa.com/api
COMPANY_NAME_PROD=Mi Empresa
```

**Ejemplo de script `set-env.js`:**
```js
const { writeFileSync, mkdirSync } = require('fs');
const { resolve, dirname } = require('path');
const dotenv = require('dotenv');

// Cargar variables desde .env-template
const result = dotenv.config({ path: '.env' });
if (result.error) {
  throw result.error;
}

// Lista de entornos soportados
const environments = [
  {
    name: 'dev',
    file: 'environment.development.ts',
    production: false,
    apiUrl: process.env.API_URL_DEV,
    companyName: process.env.COMPANY_NAME_DEV,
  },
  {
    name: 'staging',
    file: 'environment.staging.ts',
    production: false,
    apiUrl: process.env.API_URL_STAGING,
    companyName: process.env.COMPANY_NAME_STAGING,
  },
  {
    name: 'prod',
    file: 'environment.prod.ts',
    production: true,
    apiUrl: process.env.API_URL_PROD,
    companyName: process.env.COMPANY_NAME_PROD,
  },
   {
    name: 'base',
    file: 'environment.ts', // 👈 este es el que Angular importa siempre
    production: false,
    apiUrl: process.env.API_URL_DEV, // por defecto apunta a dev
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
  apiUrl: '${env.apiUrl}',
  companyName: '${env.companyName}'
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

---

## 11. Ejemplo completo de configuración

**angular.json:**

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
}
```

**package.json scripts:**

```json
"scipts": {
  "init": "node set-env.js && ng serve -o --port 4200",
  "start": "ng serve -o --port 4200",
  "prebuild": "node set-env.js",
  "build:dev": "npm run prebuild && ng build --configuration development",
  "build:staging": "npm run prebuild && ng build --configuration staging",
  "build:prod": "npm run prebuild && ng build --configuration production",
  "serve:dev": "npm run prebuild && ng serve --configuration development -o --port 4200",
  "serve:staging": "npm run prebuild && ng serve --configuration staging -o --port 4201",
  "serve:prod": "npm run prebuild && ng serve --configuration production -o --port 4202",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

Ejemplo de arranque:

```bash
npm run init

# o 
npx npm run init
```
---

## 12. Conclusión

- Angular permite gestionar entornos fácilmente.
- Nunca guardes secretos en el frontend.
- Automatiza la generación de environments para mantener tu configuración centralizada y segura.
