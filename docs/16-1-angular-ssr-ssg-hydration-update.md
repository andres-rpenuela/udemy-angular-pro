# Creación de Proyecto Angular 20 con SSR y Hidratación

## Índice

1. [Crear proyecto nuevo con SSR](#1-crear-proyecto-nuevo-con-ssr)
2. [Estructura de archivos generada](#2-estructura-de-archivos-generada)
3. [Configuración de archivos clave](#3-configuración-de-archivos-clave)
4. [Modos de renderizado disponibles](#4-modos-de-renderizado-disponibles)
5. [Comandos de desarrollo y producción](#5-comandos-de-desarrollo-y-producción)
6. [Configuración de hidratación](#6-configuración-de-hidratación)
7. [Detección de ambiente (servidor vs cliente)](#7-detección-de-ambiente-servidor-vs-cliente)
8. [Mejores prácticas para SSR](#8-mejores-prácticas-para-ssr)
9. [Solución de errores comunes](#9-solución-de-errores-comunes)
10. [ANEXO: Prerender en Angular SSR](#anexo-prerender-en-angular-ssr)

---

## 1. Crear proyecto nuevo con SSR

### Opción A: Crear con SSR desde el inicio (Recomendado)

```bash
ng new company-app --routing --style=css --ssr
cd company-app
```

### Opción B: Agregar SSR a proyecto existente

```bash
ng new company-app --routing --style=css
cd company-app
ng add @angular/ssr --skip-confirmation
```

## 2. Estructura de archivos generada

Después de crear el proyecto con SSR:

```
src/
├── main.ts                    # Bootstrap cliente
├── main.server.ts            # Bootstrap servidor
├── app/
│   ├── app.component.ts      # Componente principal (App)
│   ├── app.config.ts         # Configuración cliente
│   ├── app.config.server.ts  # Configuración servidor
│   ├── app.routes.ts         # Rutas principales
│   └── app.routes.server.ts  # Rutas SSR
└── server.ts                 # Servidor Express
```

## 3. Configuración de archivos clave

### main.ts (Cliente)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

### main.server.ts (Servidor con BootstrapContext)

```typescript
// main.server.ts - Versión completa generada por Angular CLI
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
```

**Nota**: Angular 20 genera automáticamente la versión con `BootstrapContext` que permite:
- Transfer State automático
- Hidratación optimizada
- Configuración dinámica del servidor

### app.config.ts (Cliente con Hidratación)

```typescript
// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(), // ✅ Habilita hidratación
  ]
};
```

### app.config.server.ts (Servidor)

```typescript
// app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

### app.routes.server.ts (Rutas SSR)

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender // Prerender todas las rutas por defecto
  }
];
```

### Componente App principal

```typescript
// app/app.ts (generado como standalone component)
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <router-outlet />
  `,
  styleUrl: './app.css'
})
export class App {
  title = 'company-app';
}
```

## 4. Modos de renderizado disponibles

### RenderMode.Prerender
- **Genera HTML estático** en build time
- **Mejor para**: páginas que no cambian frecuentemente
- **SEO**: Excelente

### RenderMode.Server
- **Genera HTML dinámicamente** en el servidor
- **Mejor para**: páginas con datos que cambian
- **SEO**: Bueno

### RenderMode.Client
- **Solo renderizado** del lado del cliente (SPA tradicional)
- **Mejor para**: páginas privadas o dashboards
- **SEO**: Limitado

```typescript
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender // Homepage estática
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Server // Productos dinámicos
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client // Área privada
  }
];
```

## 5. Comandos de desarrollo y producción

### Scripts en package.json

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve -o --port 4200",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "serve:ssr:company-app": "node dist/company-app/server/server.mjs",
    "prerender": "ng run company-app:prerender"
  }
}
```

### Comandos útiles

```bash
# Desarrollo SIN SSR (más rápido para desarrollo)
npm start

# Desarrollo CON SSR
ng serve

# Build para producción con SSR
ng build

# Solo prerender (sin servidor)
npm run prerender

# Servir aplicación SSR en producción
npm run serve:ssr:company-app
```

## 6. Configuración de hidratación

### Hidratación básica (incluida por defecto)

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(), // Hidratación automática con BootstrapContext
  ]
};
```

### Hidratación avanzada (opcional)

```typescript
import { 
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay(), // Replay eventos durante hidratación
      withHttpTransferCacheOptions({
        includePostRequests: true // Cache peticiones POST
      })
    ),
  ]
};
```

## 7. Detección de ambiente (servidor vs cliente)

```typescript
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="isBrowser">
      Solo visible en el cliente
    </div>
    <div *ngIf="isServer">
      Solo visible durante SSR
    </div>
  `
})
export class ExampleComponent {
  isBrowser: boolean;
  isServer: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Código solo para el navegador
      localStorage.setItem('data', 'value');
      console.log('Ejecutando en el cliente');
    }
  }
}
```

## 8. Mejores prácticas para SSR

### ❌ Evitar APIs del navegador en SSR

```typescript
// INCORRECTO - causará error en SSR
ngOnInit() {
  localStorage.setItem('data', 'value');
  document.querySelector('.element');
  window.location.href = '/page';
}
```

### ✅ Verificar plataforma antes de usar APIs

```typescript
// CORRECTO - verificar plataforma
ngOnInit() {
  if (this.isBrowser) {
    localStorage.setItem('data', 'value');
    document.querySelector('.element');
    window.location.href = '/page';
  }
}
```

### Usar afterNextRender para código post-hidratación

```typescript
import { afterNextRender } from '@angular/core';

constructor() {
  afterNextRender(() => {
    // Código que se ejecuta después de la hidratación
    console.log('Componente hidratado');
    // Aquí puedes usar APIs del navegador sin verificación
    localStorage.setItem('hydrated', 'true');
  });
}
```

## 9. Solución de errores comunes

### NG0401 - Missing Platform

**Causa**: Configuración incorrecta en `main.server.ts`

**Solución**: Verificar que coincida con la estructura generada por Angular CLI:

```typescript
// ✅ CORRECTO - como lo genera Angular CLI
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
```

### Error: document is not defined

```typescript
// Usar detección de plataforma
if (isPlatformBrowser(this.platformId)) {
  document.getElementById('myElement');
}
```

### Error: localStorage is not defined

```typescript
// Verificar antes de usar
if (this.isBrowser) {
  const data = localStorage.getItem('key');
}
```

### Desarrollo sin SSR para debugging

```bash
# Si tienes problemas con SSR en desarrollo
ng serve --no-ssr
```

### Verificar que el componente se llame correctamente

```typescript
// Asegúrate de que el import coincida con el nombre del componente
import { App } from './app/app'; // No AppComponent, sino App
```

---

# ANEXO: Prerender en Angular SSR

## ¿Qué hace el Prerender?

El **prerender** genera páginas HTML estáticas en **tiempo de compilación** (build time) en lugar de generarlas dinámicamente en cada petición.

## Cómo funciona

### Durante el build

```bash
# Build completo (incluye prerender automáticamente)
ng build

# Solo prerender (sin build del servidor)
ng run company-app:prerender
# o
npm run prerender
```

Angular ejecuta la aplicación y genera archivos HTML estáticos para cada ruta especificada.

### Resultado del prerender

```
dist/company-app/browser/
├── index.html           # Página de inicio prerenderizada
├── about/
│   └── index.html      # Página "about" prerenderizada
├── contact/
│   └── index.html      # Página "contact" prerenderizada
└── assets/
```

## Configuración en app.routes.server.ts

```typescript
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender // ✅ Prerender homepage
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender // ✅ Prerender about
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender // ✅ Prerender contact
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Server    // ❌ No prerender (dinámico)
  }
];
```

## Diferencias entre modos

| Característica | Prerender | Server SSR | Client CSR |
|---------------|-----------|------------|------------|
| **Cuándo se genera** | Build time | Request time | Browser |
| **HTML generado** | Estático | Dinámico | Dinámico |
| **Velocidad** | ⚡ Muy rápida | 🚀 Rápida | 🐌 Lenta |
| **SEO** | ✅ Excelente | ✅ Bueno | ❌ Limitado |
| **Contenido dinámico** | ❌ No | ✅ Sí | ✅ Sí |
| **Servidor requerido** | ❌ No | ✅ Sí | ❌ No |

## Ventajas del Prerender

### 1. **Velocidad máxima**
El navegador recibe HTML completo inmediatamente

### 2. **SEO perfecto**
- Los bots ven contenido HTML completo
- Meta tags prerenderizados

### 3. **No requiere servidor**
- Se puede servir desde CDN
- Hosting estático (Netlify, Vercel, etc.)

## Cuándo usar cada modo

### ✅ Prerender ideal para:

```typescript
// Páginas estáticas
{
  path: '',           // Landing page
  renderMode: RenderMode.Prerender
},
{
  path: 'about',      // Página de empresa
  renderMode: RenderMode.Prerender
},
{
  path: 'pricing',    // Precios
  renderMode: RenderMode.Prerender
}
```

### ✅ Server SSR ideal para:

```typescript
// Páginas dinámicas
{
  path: 'products/:id',     // Productos
  renderMode: RenderMode.Server
},
{
  path: 'blog/:slug',       // Blog posts
  renderMode: RenderMode.Server
}
```

### ✅ Client CSR ideal para:

```typescript
// Áreas privadas
{
  path: 'dashboard',        // Panel de usuario
  renderMode: RenderMode.Client
},
{
  path: 'profile',          // Perfil
  renderMode: RenderMode.Client
}
```

## Comandos útiles

```bash
# Build completo con prerender automático
ng build

# Solo prerender (comando específico)
npm run prerender

# Verificar archivos generados
ls dist/company-app/browser/

# Servir archivos prerenderizados localmente (solo estáticos)
cd dist/company-app/browser
npx serve .

# Servir con servidor SSR completo (dinámico + estático)
npm run serve:ssr:company-app
```

## Debugging prerender

### Ver qué páginas se prerenderizaron

```bash
# Verificar estructura después del build
find dist/company-app/browser -name "index.html" -type f
```

### Logs durante prerender

```typescript
// En tu componente
export class HomeComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      console.log('🔄 Prerenderizando página home...');
    }
  }
}
```

El prerender es perfecto para sitios corporativos, landing pages y blogs donde el contenido es estático pero necesitas excelente SEO y velocidad de carga.

## Notas importantes

- **BootstrapContext** se maneja automáticamente en Angular 20
- El componente principal se llama **App**, no **AppComponent** 
- Angular CLI genera la configuración completa con todas las optimizaciones
- El prerender funciona automáticamente con la configuración por defecto
- **`npm run prerender`** ejecuta solo la prerenderización sin el servidor