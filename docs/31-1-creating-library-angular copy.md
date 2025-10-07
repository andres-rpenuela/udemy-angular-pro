# Creación de Librerías en Angular Monorepo

## Índice

1. [¿Qué es un Monorepo en Angular?](#1-qué-es-un-monorepo-en-angular)
2. [Configuración inicial del workspace](#2-configuración-inicial-del-workspace)
3. [Crear una librería](#3-crear-una-librería)
4. [Estructura de la librería generada](#4-estructura-de-la-librería-generada)
5. [Configurar y desarrollar la librería](#5-configurar-y-desarrollar-la-librería)
6. [Exportar componentes y servicios](#6-exportar-componentes-y-servicios)
7. [Usar la librería en aplicaciones](#7-usar-la-librería-en-aplicaciones)
8. [Build y distribución](#8-build-y-distribución)
9. [Testing de librerías](#9-testing-de-librerías)
10. [Versionado y publicación](#10-versionado-y-publicación)
11. [Mejores prácticas](#11-mejores-prácticas)
12. [ANEXO: Configuraciones de Build - Development vs Production](#anexo-configuraciones-de-build---development-vs-production)

---

## 1. ¿Qué es un Monorepo en Angular?

Un **monorepo** (monolithic repository) es un repositorio que contiene múltiples proyectos relacionados:

- **Múltiples aplicaciones**
- **Librerías compartidas**
- **Herramientas comunes**
- **Configuración centralizada**

### Ventajas del Monorepo

- ✅ **Código compartido** entre proyectos
- ✅ **Versionado sincronizado**
- ✅ **Refactoring cross-project**
- ✅ **Configuración centralizada**
- ✅ **CI/CD simplificado**

## 2. Configuración inicial del workspace

### Crear un nuevo workspace

```bash
# Crear workspace vacío (sin aplicación inicial)
ng new my-workspace --create-application=false
cd my-workspace

# O crear con aplicación principal
ng new my-workspace --routing --style=scss
cd my-workspace
```

### Estructura inicial del workspace

```
my-workspace/
├── angular.json          # Configuración del workspace
├── package.json         # Dependencias del workspace
├── tsconfig.json        # TypeScript config base
├── projects/            # Carpeta para proyectos
│   ├── apps/           # Aplicaciones
│   └── libs/           # Librerías
└── tools/              # Herramientas personalizadas
```

## 3. Crear una librería

### Comando básico para crear librería

```bash
# Crear librería básica
ng generate library my-lib

# Crear librería con prefijo personalizado
ng generate library ui-components --prefix=ui

# Crear librería en subcarpeta
ng generate library shared/utils --prefix=shared
```

### Opciones avanzadas

```bash
# Librería con configuración específica
ng generate library my-lib \
  --prefix=mylib \
  --style=scss \
  --skip-package-json=false \
  --skip-install=false
```

## 4. Estructura de la librería generada

Después de ejecutar `ng generate library my-lib`:

```
projects/
└── my-lib/
    ├── karma.conf.js           # Configuración de testing
    ├── ng-package.json         # Configuración de build
    ├── package.json           # Metadatos de la librería
    ├── README.md              # Documentación
    ├── tsconfig.lib.json      # TypeScript config
    ├── tsconfig.spec.json     # Config para tests
    └── src/
        ├── lib/
        │   ├── my-lib.component.ts     # Componente ejemplo
        │   ├── my-lib.service.ts       # Servicio ejemplo
        │   └── my-lib.module.ts        # Módulo principal
        ├── public-api.ts              # API pública
        └── test.ts                    # Setup de testing
```

## 5. Configurar y desarrollar la librería

### public-api.ts - Punto de entrada

```typescript
// projects/my-lib/src/public-api.ts
/*
 * Public API Surface of my-lib
 */

// Exportar módulos
export * from './lib/my-lib.module';

// Exportar servicios
export * from './lib/services/my-lib.service';
export * from './lib/services/data.service';

// Exportar componentes
export * from './lib/components/button/button.component';
export * from './lib/components/modal/modal.component';

// Exportar interfaces/tipos
export * from './lib/interfaces/user.interface';
export * from './lib/types/common.types';

// Exportar constantes
export * from './lib/constants/api.constants';
```

### Ejemplo de estructura organizda

```
projects/my-lib/src/lib/
├── components/
│   ├── button/
│   │   ├── button.component.ts
│   │   ├── button.component.html
│   │   ├── button.component.scss
│   │   └── button.component.spec.ts
│   └── modal/
│       ├── modal.component.ts
│       ├── modal.component.html
│       ├── modal.component.scss
│       └── modal.component.spec.ts
├── services/
│   ├── data.service.ts
│   ├── data.service.spec.ts
│   ├── http.service.ts
│   └── http.service.spec.ts
├── interfaces/
│   ├── user.interface.ts
│   └── api.interface.ts
├── constants/
│   └── api.constants.ts
├── pipes/
│   ├── currency.pipe.ts
│   └── date-format.pipe.ts
└── my-lib.module.ts
```

## 6. Exportar componentes y servicios

### Componente de ejemplo

```typescript
// projects/my-lib/src/lib/components/button/button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-button',
  template: `
    <button 
      [class]="buttonClass" 
      [disabled]="disabled"
      (click)="handleClick()">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  get buttonClass(): string {
    return `btn btn-${this.variant} btn-${this.size}`;
  }

  handleClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
```

### Servicio de ejemplo

```typescript
// projects/my-lib/src/lib/services/data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user);
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser = { ...user, id: Date.now() };
    this.users.push(newUser);
    return of(newUser);
  }
}
```

### Módulo principal

```typescript
// projects/my-lib/src/lib/my-lib.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './components/button/button.component';
import { ModalComponent } from './components/modal/modal.component';
import { CurrencyPipe } from './pipes/currency.pipe';

@NgModule({
  declarations: [
    ButtonComponent,
    ModalComponent,
    CurrencyPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    ModalComponent,
    CurrencyPipe
  ]
})
export class MyLibModule { }
```

## 7. Usar la librería en aplicaciones

### Crear aplicación para testing

```bash
# Crear aplicación de ejemplo
ng generate application demo-app --routing --style=scss
```

### Importar en la aplicación

```typescript
// projects/demo-app/src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importar la librería
import { MyLibModule } from 'my-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MyLibModule  // ✅ Agregar el módulo de la librería
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Usar componentes en templates

```typescript
// projects/demo-app/src/app/app.component.ts
import { Component } from '@angular/core';
import { DataService, User } from 'my-lib';

@Component({
  selector: 'app-root',
  template: `
    <h1>Demo App</h1>
    
    <!-- Usar componente de la librería -->
    <lib-button 
      variant="primary" 
      size="lg"
      (clicked)="onButtonClick()">
      Click me!
    </lib-button>

    <!-- Mostrar datos del servicio -->
    <div *ngFor="let user of users">
      {{ user.name }} - {{ user.email }}
    </div>
  `
})
export class AppComponent {
  users: User[] = [];

  constructor(private dataService: DataService) {
    this.loadUsers();
  }

  onButtonClick(): void {
    console.log('Button clicked!');
  }

  private loadUsers(): void {
    this.dataService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
```

## 8. Build y distribución

### Comandos de build

```bash
# Build de la librería
ng build my-lib

# Build en modo watch (desarrollo)
ng build my-lib --watch

# Build para producción
ng build my-lib --configuration production

# Build para desarrollo (con optimizaciones mínimas)
ng build my-lib --configuration development
```

### Resultado del build

```
dist/
└── my-lib/
    ├── bundles/                # Bundles UMD
    ├── esm2022/               # ES modules
    ├── fesm2022/              # Flat ES modules
    ├── lib/                   # Archivos compilados
    ├── package.json           # Package info
    ├── public-api.d.ts        # Type definitions
    └── README.md              # Documentación
```

### Configuración en ng-package.json

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/my-lib",
  "lib": {
    "entryFile": "src/public-api.ts"
  },
  "whitelistedNonPeerDependencies": [
    "lodash",
    "moment"
  ]
}
```

## 9. Testing de librerías

### Configurar tests

```typescript
// projects/my-lib/src/lib/components/button/button.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when button is clicked', () => {
    spyOn(component.clicked, 'emit');
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should apply correct CSS classes', () => {
    component.variant = 'primary';
    component.size = 'lg';
    
    expect(component.buttonClass).toBe('btn btn-primary btn-lg');
  });
});
```

### Ejecutar tests

```bash
# Test de la librería
ng test my-lib

# Test en modo watch
ng test my-lib --watch

# Test con coverage
ng test my-lib --code-coverage
```

> Ejemplo: `px ng test devarp-side-menu` (_eso esto no varía, a la forma tradicional_)

> Nota: En Angular 20, es importatne indicar que se trabaja en la zone `provideZonelessChangeDetection`, o si no se debe realizar una configuración  extra.

## 10. Versionado y publicación

### package.json de la librería

```json
{
  "name": "my-lib",
  "version": "1.0.0",
  "description": "My awesome Angular library",
  "keywords": ["angular", "library", "components"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-workspace.git"
  },
  "peerDependencies": {
    "@angular/common": "^17.0.0",
    "@angular/core": "^17.0.0"
  },
  "dependencies": {
    "tslib": "^2.3.0"
  }
}
```

### Publicar en npm

```bash
# Build para producción
ng build my-lib --configuration production

# Navegar al directorio de distribución
cd dist/my-lib

# Publicar
npm publish

# O publicar con scope
npm publish --access public
```

### Versionado automático

```bash
# Aumentar versión patch
npm version patch

# Aumentar versión minor
npm version minor

# Aumentar versión major
npm version major
```

## 11. Mejores prácticas

### Estructura de carpetas

```
projects/
├── libs/
│   ├── ui-components/     # Componentes de UI
│   ├── shared-utils/      # Utilidades compartidas
│   ├── data-access/       # Servicios de datos
│   └── feature-auth/      # Feature modules
└── apps/
    ├── web-app/           # Aplicación web
    ├── admin-app/         # Panel admin
    └── mobile-app/        # App móvil
```

### Convenciones de naming

```bash
# Librerías por categoría
ng g lib ui-button --prefix=ui
ng g lib shared-utils --prefix=shared
ng g lib feature-auth --prefix=auth

# Aplicaciones por plataforma
ng g app web-dashboard
ng g app mobile-app
ng g app admin-panel
```

### Configuración de paths en tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "my-lib": ["dist/my-lib"],
      "ui-components": ["dist/ui-components"],
      "shared-utils": ["dist/shared-utils"],
      "@mycompany/ui": ["projects/libs/ui-components/src/public-api"],
      "@mycompany/utils": ["projects/libs/shared-utils/src/public-api"]
    }
  }
}
```

### Scripts útiles en package.json

```json
{
  "scripts": {
    "build:libs": "ng build my-lib && ng build ui-components",
    "test:libs": "ng test my-lib && ng test ui-components",
    "lint:libs": "ng lint my-lib && ng lint ui-components",
    "publish:libs": "npm run build:libs && npm publish dist/my-lib && npm publish dist/ui-components"
  }
}
```

### Documentación con Storybook

```bash
# Instalar Storybook
npx storybook@latest init

# Crear stories para componentes
ng generate @storybook/angular:component my-lib/button
```

### Ejemplo de story

```typescript
// projects/my-lib/src/lib/components/button/button.stories.ts
import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: '<lib-button [variant]="variant" [size]="size" [disabled]="disabled">Click me!</lib-button>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: '<lib-button [variant]="variant" [size]="size">Secondary</lib-button>',
  }),
};
```

## Comandos de referencia rápida

```bash
# Crear workspace
ng new my-workspace --create-application=false

# Crear librería
ng generate library my-lib --prefix=lib

# Crear aplicación
ng generate application demo-app

# Build librería
ng build my-lib

# Test librería
ng test my-lib

# Servir aplicación
ng serve demo-app

# Build todo
ng build

# Lint
ng lint my-lib
```

---

# ANEXO: Configuraciones de Build - Development vs Production

## ¿Qué hace `ng build my-lib --configuration development`?

El comando `ng build my-lib --configuration development` construye la librería con optimizaciones **mínimas**, diseñado para **desarrollo y debugging**.

## Diferencias entre configuraciones

| Característica | Development | Production | Sin configuración |
|---------------|-------------|------------|-------------------|
| **Minificación** | ❌ No | ✅ Sí | 🔶 Parcial |
| **Tree-shaking** | ❌ Básico | ✅ Agresivo | 🔶 Parcial |
| **Source Maps** | ✅ Completos | ❌ No | 🔶 Básicos |
| **Optimización** | ❌ Mínima | ✅ Máxima | 🔶 Media |
| **Tamaño Bundle** | 🔴 Grande | 🟢 Pequeño | 🟡 Medio |
| **Tiempo Build** | 🟢 Rápido | 🔴 Lento | 🟡 Medio |
| **Debugging** | ✅ Fácil | ❌ Difícil | 🔶 Limitado |

## Comandos y sus usos

### Para desarrollo y debugging

```bash
# Build rápido con source maps completos
ng build my-lib --configuration development

# Con watch para desarrollo continuo
ng build my-lib --configuration development --watch
```

**¿Cuándo usar?**
- ✅ **Desarrollo activo** de la librería
- ✅ **Debugging** de problemas
- ✅ **Testing local** con source maps
- ✅ **Iteración rápida** (builds más rápidos)

### Para producción

```bash
# Build optimizado para distribución
ng build my-lib --configuration production
```

**¿Cuándo usar?**
- ✅ **Publicación en npm**
- ✅ **Distribución final**
- ✅ **CI/CD pipelines**
- ✅ **Releases oficiales**

### Build estándar (por defecto)

```bash
# Build con configuración balanceada
ng build my-lib
```

**¿Cuándo usar?**
- ✅ **Testing general**
- ✅ **Builds de integración**
- ✅ **Validación antes de producción**

## Configuración en angular.json

```json
{
  "projects": {
    "my-lib": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "projects/my-lib/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "projects/my-lib/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "projects/my-lib/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        }
      }
    }
  }
}
```

## Ejemplo práctico de flujo de trabajo

### 1. Desarrollo activo

```bash
# Terminal 1: Build continuo para desarrollo
ng build my-lib --configuration development --watch

# Terminal 2: Servir aplicación que usa la librería
ng serve demo-app
```

### 2. Testing de integración

```bash
# Build estándar para testing
ng build my-lib

# Ejecutar tests
ng test demo-app
```

### 3. Preparar para producción

```bash
# Build optimizado
ng build my-lib --configuration production

# Verificar tamaño y estructura
ls -la dist/my-lib/
```

## Análisis de bundle

### Ver contenido del build development

```bash
ng build my-lib --configuration development

# Verificar archivos generados
find dist/my-lib -name "*.js" -exec ls -lh {} \;
```

### Comparar tamaños

```bash
# Development build
ng build my-lib --configuration development
du -sh dist/my-lib/

# Production build  
ng build my-lib --configuration production
du -sh dist/my-lib/

# Diferencia de tamaño típica: 30-50% menor en production
```

## Debugging con development build

### Source maps disponibles

```bash
# Build development incluye source maps
ng build my-lib --configuration development

# Verificar source maps
find dist/my-lib -name "*.map" -type f
```

### Usar en aplicación para debugging

```typescript
// Importar desde dist para debugging
import { MyLibModule } from '../../../dist/my-lib';

// En development, los source maps permiten:
// - Breakpoints en código original
// - Stack traces legibles
// - Debugging paso a paso
```

## Scripts recomendados en package.json

```json
{
  "scripts": {
    "build:lib": "ng build my-lib",
    "build:lib:dev": "ng build my-lib --configuration development",
    "build:lib:prod": "ng build my-lib --configuration production",
    "build:lib:watch": "ng build my-lib --configuration development --watch",
    "debug:lib": "ng build my-lib --configuration development && ng serve demo-app",
    "release:lib": "ng build my-lib --configuration production && npm publish dist/my-lib"
  }
}
```

> Nota: 
> - Sin usar `npx npm run build:lib_dev`, si no direcamnte `ng` -> `>npx ng build devarp-side-menu --configuration development`. El comando debe lanzarse en el direcotrio del workpace.
> - Si se lanza sin el flags de `--configuration development`, compiliza para el modo de producción.

## Mejores prácticas

### Durante desarrollo

```bash
# Usar development para iteración rápida
npm run build:lib:dev

# O con watch automático
npm run build:lib:watch
```

### Antes de commits

```bash
# Verificar que funciona en producción
npm run build:lib:prod
```

### Para releases

```bash
# Siempre usar production para publicación
npm run release:lib
```

El build con `--configuration development` es **esencial para desarrollo eficiente** ya que prioriza velocidad de build y facilidad de debugging sobre optimización de tamaño.

Este enfoque de monorepo con librerías permite crear arquitecturas escalables, reutilizar código eficientemente y mantener consistencia across múltiples aplicaciones.


