# Zone.js y Zoneless en Angular

## Índice
1. [¿Qué es Zone.js?](#qué-es-zonejs)
2. [¿Qué es Zoneless?](#qué-es-zoneless)
3. [Comparación Zone.js vs Zoneless](#comparación-zonejs-con-zoneless-angular)
4. [Trabajar Zoneless en Angular](#trabjar-zoneless)
5. [Configuración de eventCoalescing](#configuración-de-eventcoalescing)
6. [Ejemplo de eventCoalescing](#ejemplo)

---

## ¿Qué es Zone.js?
- Librería de bajo nivel usada por Angular para interceptar tareas asíncronas (setTimeout, promesas, eventos DOM, etc.).
- Permite a Angular saber cuándo ejecutar la detección de cambios automáticamente.

---

## ¿Qué es Zoneless?
- Una app zoneless en Angular no usa zone.js para el ciclo de detección de cambios.
- El desarrollador controla manualmente cuándo Angular debe actualizar la vista.
- Ofrece más control y potencialmente mejor rendimiento, pero requiere más trabajo.

---

## Comparación Zone.js con Zoneless Angular

|                               | `zone.js` (por defecto) | Zoneless Angular (`disableZone: true`) |
|-------------------------------|-------------------------|----------------------------------------|
| Automatiza ChangeDetection    | ✅ Sí                   | ❌ No (manual)                         |
| Usa `NgZone`                  | ✅                      | ❌ (o `NgZone: 'noop'`)                |
| Más simple de usar            | ✅                      | ❌ (requiere conocimiento avanzado)     |
| Más eficiente en grandes apps | ❌ Puede ser ineficiente| ✅ Si bien optimizado                  |
| Necesita `zone.js`            | ✅                      | ❌                                     |

- **zone.js**: detección de cambios automática, menos eficiente.
- **Zoneless Angular**: más rendimiento y control, pero gestión manual.

---

## Trabjar Zoneless

- En Angular 20+, el archivo de configuración incluye la función `provideZoneChangeDetection`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
```

- Elimina la importación de zone.js de `polyfills.ts`.
- Debes usar `ChangeDetectorRef` y `applicationRef.tick()` para actualizar la vista manualmente.

> En versiones anteriores:
> ```typescript
> import { bootstrapApplication } from '@angular/platform-browser';
> import { AppComponent } from './app/app.component';
> import { provideZoneChangeDetection } from '@angular/core';
>
> bootstrapApplication(AppComponent, {
>   providers: [provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true })],
> });
> ```

---

## Configuración de eventCoalescing

- `eventCoalescing: true` agrupa múltiples eventos DOM en una sola ejecución de Change Detection.
- Útil para mejorar el rendimiento cuando hay muchos eventos seguidos.

---

## Ejemplo

Sin eventCoalescing:

```typescript
element.addEventListener('input', () => console.log('input'));
element.addEventListener('keydown', () => console.log('keydown'));
```
Cada evento dispara una ejecución de Change Detection por separado.

Con `eventCoalescing: true`, si ambos eventos ocurren en el mismo ciclo de evento, Angular solo ejecuta Change Detection