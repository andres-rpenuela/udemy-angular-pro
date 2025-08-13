# 🚀 Apuntes: SSR, SSG y Hydration en Angular

Creando un nuevo proyecto Angular llamado pokemon-ssr con renderizado del lado del servidor (SSR) habilitado desde el inicio
```bash
ng new pokemon-ssr --ssr
```
Configura automáticamente Angular Universal con Express.js..

Crea archivos como:
- main.server.ts → bootstrap para el servidor
- server.ts → servidor Express que renderiza la app
- app.server.module.ts → módulo específico para SSR
- tsconfig.server.json → configuración TypeScript para el servidor

Ejecutar la app con SSR: `npm run dev:ssr`, e inicia el servidor en `http://localhost:4200/`

Nota: 
- Agregar rutas o APIs en Express: Puedes extender server.ts para servir datos desde /api/pokemon, por ejemplo.
- Habilitar Hydration (Angular 16+): Para mejorar el rendimiento y evitar parpadeos, puedes añadir:
```ts
import { provideClientHydration } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
``` 

## ⚙️ SSR – Server-Side Rendering

### ✅ ¿Qué es?
Renderizado en el servidor: Angular genera el HTML completo en el servidor y lo envía al navegador.

### 🎯 Ventajas
- Mejora el rendimiento inicial (First Paint más rápido)
- Optimiza el SEO (contenido indexable por buscadores)
- Reduce la carga en el cliente

### 🛠️ Cómo habilitarlo
```bash
ng add @angular/ssr
```

Esto genera:
- `main.server.ts`
- Configuración de Angular Universal
- Soporte para renderizado en Node.js

---

## 📦 SSG – Static Site Generation

### ✅ ¿Qué es?
Generación de HTML estático en tiempo de build. No se renderiza en cada solicitud.

### 🎯 Ventajas
- Carga ultra rápida (contenido servido como archivo estático)
- Ideal para contenido que no cambia frecuentemente (blogs, portfolios, landing pages)

### 🔍 Diferencias con SSR

| Característica | SSR                              | SSG                              |
|----------------|----------------------------------|----------------------------------|
| Renderizado    | En cada solicitud                | En tiempo de build               |
| Rendimiento    | Alto, pero depende del servidor  | Máximo, al servir archivos estáticos |
| Ideal para     | Apps dinámicas                   | Sitios estáticos o semi-estáticos |

---

## 💧 Hydration – Reutilización del DOM

### ✅ ¿Qué es?
Proceso por el cual Angular reutiliza el HTML generado por SSR en el cliente, evitando re-renderizar todo.

### 🎯 Beneficios
- Evita parpadeos de UI (flickering)
- Mejora métricas como LCP, FID, CLS
- Preserva el estado del DOM

### 🛠️ Cómo habilitarlo (Angular 16+)
```ts
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```

---

## 🧠 Partial Hydration (Angular 18+)

### ✅ ¿Qué es?
Hidratación parcial: solo se hidratan partes de la app que lo necesitan.

### 🎯 Ventajas
- Carga más eficiente
- Menor uso de recursos
- Mejora la escalabilidad

---

## 📌 Resumen

| Concepto         | ¿Qué hace?                                      | ¿Cuándo usarlo?                          |
|------------------|--------------------------------------------------|------------------------------------------|
| SSR              | Renderiza HTML en el servidor                    | Apps dinámicas con SEO                   |
| SSG              | Genera HTML estático en el build                 | Sitios estáticos o con contenido fijo    |
| Hydration        | Reutiliza el HTML del servidor en el cliente     | Siempre que uses SSR                     |
| Partial Hydration| Hidrata solo partes necesarias de la app         | Apps grandes con componentes diferidos   |

---