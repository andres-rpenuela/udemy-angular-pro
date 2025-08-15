# ⚙️ Zone.js y Zoneless en Angular

## 📚 Índice

1. [¿Qué es Zone.js?](#1-qué-es-zonejs)
2. [¿Qué es Zoneless Angular?](#2-qué-es-zoneless-angular)
3. [Comparación: Zone.js vs Zoneless](#3-comparación-zonejs-vs-zoneless)
4. [Trabajar con Zoneless](#4-trabajar-con-zoneless)
5. [Configuración de `eventCoalescing`](#5-configuración-de-eventcoalescing)
6. [Ejemplo práctico](#6-ejemplo-práctico)
7. [Configuración recomendada](#7-configuración-recomendada)
8. [📝 Conclusión](#8-📝-conclusión)

---

## 1️⃣ ¿Qué es Zone.js?

- Es una librería de bajo nivel que Angular usa para interceptar tareas asincrónicas como:
  - `setTimeout`, `Promise`, eventos DOM, etc.
- Permite a Angular saber **cuándo ejecutar la detección de cambios automáticamente**, sin intervención del desarrollador.

---

## 2️⃣ ¿Qué es Zoneless Angular?

- Es un modo de ejecución en Angular donde **Zone.js no está presente**.
- El desarrollador debe **controlar manualmente** cuándo Angular actualiza la vista.
- Requiere el uso de:
  - `ChangeDetectorRef`
  - `ApplicationRef.tick()`
  - Signals (Angular 17+)
- Ofrece **mayor rendimiento y control**, pero exige más conocimiento técnico.

---

## 3️⃣ Comparación: Zone.js vs Zoneless

| Característica                  | Zone.js (por defecto) | Zoneless Angular (`disableZone: true`) |
|--------------------------------|------------------------|----------------------------------------|
| Detección automática de cambios| ✅ Sí                  | ❌ No (manual)                         |
| Uso de `NgZone`                | ✅ Disponible          | ❌ Reemplazado por `NgZone: 'noop'`   |
| Facilidad de uso               | ✅ Simple              | ⚠️ Requiere experiencia                |
| Rendimiento en apps grandes    | ❌ Puede ser costoso   | ✅ Más eficiente                       |
| Dependencia de `zone.js`       | ✅ Obligatoria         | ❌ Eliminada                          |

---

## 4️⃣ Trabajar con Zoneless

En Angular 18+, puedes usar `provideZonelessChangeDetection()` para activar el modo Zoneless:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
```

### 🛠️ Requisitos adicionales

- Elimina `zone.js` de `polyfills.ts` y `angular.json`.
- Usa `ChangeDetectionStrategy.OnPush` en tus componentes.
- Usa signals o `ChangeDetectorRef` para actualizar la vista.

---

## 5️⃣ Configuración de `eventCoalescing`

Si decides mantener Zone.js pero optimizarlo, puedes usar:

```ts
provideZoneChangeDetection({
  eventCoalescing: true,
  runCoalescing: true
})
```

### 🔍 ¿Qué hacen?

- `eventCoalescing`: Agrupa múltiples eventos DOM en un solo ciclo de detección.
- `runCoalescing`: Agrupa múltiples tareas asincrónicas (`setTimeout`, `Promise`, etc.) en una sola ejecución.

Esto mejora el rendimiento sin eliminar Zone.js.

---

## 6️⃣ Ejemplo práctico

### ❌ Sin `eventCoalescing`

```ts
element.addEventListener('input', () => console.log('input'));
element.addEventListener('keydown', () => console.log('keydown'));
```

Cada evento dispara una ejecución de Change Detection.

### ✅ Con `eventCoalescing: true`

Si ambos eventos ocurren en el mismo ciclo de eventos, Angular ejecuta **una sola detección de cambios**, reduciendo el costo computacional.

---

## 7️⃣ Configuración recomendada

### 🔧 Para Zoneless Angular

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(), // Activación del modo Zoneless
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
```

### ⚙️ Para Zone.js optimizado

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideRouter(routes)
  ]
};
```

> ⚠️ No combines `provideZonelessChangeDetection()` con `provideZoneChangeDetection(...)`. Son **mutuamente excluyentes**.

---

## 8️⃣ 📝 Conclusión

- **Zone.js** es ideal para proyectos que buscan simplicidad y compatibilidad con librerías existentes.
- **Zoneless Angular** ofrece mayor rendimiento y control, pero requiere una arquitectura más explícita.
- Si no puedes eliminar Zone.js, usar `eventCoalescing` y `runCoalescing` es una excelente forma de optimizarlo.
- Angular 18 y posteriores están diseñados para facilitar la transición hacia Zoneless, especialmente con signals y `OnPush`.

---
