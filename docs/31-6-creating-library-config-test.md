# Configuracion de Test para la librearia

Para configurar el testing en tu workspace con la estructura `mi-workspace/projects/devarp-side-menu`, necesitas ajustar varios archivos. Aquí está la configuración completa:

## **1. Actualizar el archivo test.ts del proyecto**

Crear el `test.ts,` con la siguiente configuración:

````typescript
import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// ✅ Inicializar el entorno de testing
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: true },
  }
);
````

## **2. Configurar angular.json en la raíz del workspace**

````json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "devarp-side-menu": {
      "projectType": "library",
      "root": "projects/devarp-side-menu",
      "sourceRoot": "projects/devarp-side-menu/src",
      "prefix": "devarp",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "projects/devarp-side-menu/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "projects/devarp-side-menu/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "projects/devarp-side-menu/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "tsConfig": "projects/devarp-side-menu/tsconfig.spec.json",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "main": "projects/devarp-side-menu/src/test.ts",
            "karmaConfig": "projects/devarp-side-menu/karma.conf.js"
          }
        }
      }
    }
  }
}
````

## **3. Crear karma.conf.js específico para el proyecto**

````javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-headless'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/devarp-side-menu'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
    autoWatch: true,
    singleRun: false,
    
    // ✅ Configuración específica para Zone.js
    files: [
      // Zone.js se incluye automáticamente via polyfills en angular.json
    ],
    
    // ✅ Configuración de proxies para assets
    proxies: {
      '/assets/': '/base/projects/devarp-side-menu/src/assets/'
    }
  });
};
````

## **4. Configurar tsconfig.spec.json**

````json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/spec",
    "types": [
      "jasmine",
      "node"
    ],
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "files": [
    "src/test.ts"
  ],
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
````

## **5. Actualizar el archivo de test del servicio**

````typescript
// ✅ NO necesitas importar Zone.js aquí si ya está en test.ts
import { TestBed } from '@angular/core/testing';
import { MenuFilterService } from './menu-filter.service';
import { MenuItem } from '../interfaces/menu-item.interface';

describe('MenuFilterService', () => {
  let service: MenuFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuFilterService]
    });
    
    service = TestBed.inject(MenuFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver solo items públicos si el usuario no está autenticado', () => {
    // Arrange
    const mockItems: MenuItem[] = [
      {
        id: 'home',
        label: 'Inicio',
        route: '/home',
        requiresAuth: false,
        icon: 'home'
      },
      {
        id: 'profile',
        label: 'Mi Perfil',
        route: '/profile', 
        requiresAuth: true,
        icon: 'user'
      }
    ];

    service.menuItems.set(mockItems);
    service.isAuthenticated.set(false);

    // Act
    const result = service.filterMenuItemsMyAuth();

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('Inicio');
    expect(result[0].requiresAuth).toBe(false);
  });

  it('debería devolver todos los items cuando el usuario está autenticado', () => {
    // Arrange
    const mockItems: MenuItem[] = [
      {
        id: 'home',
        label: 'Inicio',
        route: '/home',
        requiresAuth: false,
        icon: 'home'
      },
      {
        id: 'profile',
        label: 'Mi Perfil',
        route: '/profile',
        requiresAuth: true,
        icon: 'user'
      }
    ];

    service.menuItems.set(mockItems);
    service.isAuthenticated.set(true);

    // Act
    const result = service.filterMenuItemsMyAuth();

    // Assert
    expect(result.length).toBe(2);
    expect(result.map(item => item.label)).toEqual(['Inicio', 'Mi Perfil']);
  });
});
````

## **6. Script para package.json del workspace**

````json
{
  "scripts": {
    "test": "ng test",
    "test:devarp-side-menu": "ng test devarp-side-menu",
    "test:devarp-side-menu:watch": "ng test devarp-side-menu --watch=true",
    "test:devarp-side-menu:headless": "ng test devarp-side-menu --watch=false --browsers=ChromeHeadless",
    "test:devarp-side-menu:coverage": "ng test devarp-side-menu --code-coverage --watch=false --browsers=ChromeHeadless"
  }
}
````

## **7. Comandos para ejecutar los tests**

````bash
# Desde la raíz del workspace (mi-workspace/)

# ✅ Ejecutar tests de la librería en modo watch
npm run test:devarp-side-menu

# ✅ Ejecutar tests una sola vez (CI)
npm run test:devarp-side-menu:headless

# ✅ Ejecutar tests con coverage
npm run test:devarp-side-menu:coverage

# ✅ O directamente con Angular CLI
npx ng test devarp-side-menu

# ✅ Para debugging (con Chrome abierto)
npx ng test devarp-side-menu --browsers=Chrome
````

## **8. Si aún tienes problemas, verifica las dependencias**

````bash
# En la raíz del workspace
npm list zone.js
npm list @angular/core
npm list karma

# Si faltan dependencias:
npm install --save-dev zone.js@latest
npm install --save-dev karma@latest
npm install --save-dev karma-jasmine@latest
npm install --save-dev karma-chrome-launcher@latest
````

## **9. Estructura de archivos esperada:**

````
mi-workspace/
├── angular.json                    ← Configuración del workspace
├── package.json                   ← Scripts de testing
├── projects/
│   └── devarp-side-menu/
│       ├── karma.conf.js          ← Configuración de Karma
│       ├── tsconfig.spec.json     ← TypeScript para tests
│       └── src/
│           ├── test.ts            ← Tu archivo (está bien)
│           └── shared/
│               └── services/
│                   └── menu-filter.service.spec.ts
└── coverage/                      ← Reportes de cobertura
    └── devarp-side-menu/
````

**Ejecuta `npx ng test devarp-side-menu` desde la raíz del workspace y debería funcionar correctamente.**


--

## Error `@angular-devkit/build-anuglar/plugins/karma`

El error indica que el plugin de Karma de Angular no se puede encontrar. Esto suele ocurrir por problemas de versiones o instalación. Aquí están las soluciones:

## **Solución 1: Karma.conf.js sin el plugin de Angular** (recomendada)

````javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
      // ✅ REMOVER esta línea que causa el error
      // require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/devarp-side-menu'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
    autoWatch: true,
    singleRun: false,

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-web-security']
      }
    }
  });
};
````

## **Solución 2: Verificar e instalar las dependencias correctas**

````bash
# Desde la raíz del workspace (mi-workspace/)

# ✅ Verificar versión de Angular
npx ng version

# ✅ Reinstalar Angular build tools
npm install --save-dev @angular-devkit/build-angular@latest

# ✅ Verificar que esté instalado
npm list @angular-devkit/build-angular
````

## **Solución 3: Karma.conf.js minimalista (más confiable)**

````javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter'
    ],
    files: [
      // ✅ Los archivos serán manejados por Angular CLI
    ],
    preprocessors: {
      // ✅ Los preprocessors serán manejados por Angular CLI
    },
    client: {
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
    autoWatch: true,
    singleRun: false
  });
};
````

## **Solución 4: Verificar la estructura de angular.json**

````json
{
  "projects": {
    "devarp-side-menu": {
      "architect": {
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "tsConfig": "projects/devarp-side-menu/tsconfig.spec.json",
            "main": "projects/devarp-side-menu/src/test.ts",
            "karmaConfig": "projects/devarp-side-menu/karma.conf.js",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ]
          }
        }
      }
    }
  }
}
````

## **Solución 5: Reinstalar dependencias completo**

````bash
# Limpiar completamente
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install

# Verificar las versiones
npm list karma
npm list @angular-devkit/build-angular
````

## **Solución 6: Verificar package.json**

````json
{
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.0.0", // ✅ Debe estar presente
    "@angular/cli": "^17.0.0",
    "@angular/compiler-cli": "^17.0.0",
    "jasmine": "~4.3.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.0.0",
    "typescript": "~5.2.0",
    "zone.js": "~0.14.0"
  }
}
````

## **Solución 7: Generar nueva configuración de Karma**

````bash
# Generar un nuevo archivo karma.conf.js
npx ng generate config karma --project=devarp-side-menu
````

## **Mi recomendación: Usa la Solución 1 (más simple)**

Empieza con el karma.conf.js sin el plugin de Angular (Solución 1) ya que Angular CLI maneja automáticamente la configuración necesaria.

````bash
# Después de actualizar karma.conf.js, ejecuta:
npm run test:devarp-side-menu

# O directamente:
npx ng test devarp-side-menu
````
