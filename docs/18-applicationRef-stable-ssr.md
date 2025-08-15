## 📚 Apuntes — Angular SSR, `ApplicationRef` y `isStable`

### **Índice**

1. Introducción a Angular SSR
2. Qué es `ApplicationRef`
3. Qué es `isStable`
4. Flujo de renderizado SSR
5. Problemas comunes con `isStable` en SSR
6. Streaming SSR como alternativa
7. Ejemplo práctico con `isStable`

---

### 1. Introducción a Angular SSR

* **SSR (Server-Side Rendering)**: Renderiza la aplicación Angular en el servidor y envía HTML ya generado al navegador.
* Ventajas:

  * Mejor SEO
  * Mejor **First Contentful Paint (FCP)**
  * Experiencia inicial más rápida
* Desventaja: requiere coordinar cuándo enviar el HTML para que esté completo.

---

### 2. Qué es `ApplicationRef`

* Servicio central de Angular que maneja:

  * Ciclo de vida de la app
  * Detección de cambios
  * Estado de estabilidad
* Se inyecta en cualquier servicio o componente:

```ts
constructor(private appRef: ApplicationRef) {}
```

---

### 3. Qué es `isStable`

* Es un **Observable** de `ApplicationRef` que:

  * Empieza emitiendo `false` cuando Angular arranca.
  * Emite `true` cuando **no hay tareas pendientes** en la zona (`zone.js`).
* En SSR:

  * Angular espera que `isStable` sea `true` antes de serializar y enviar HTML.
  * Si hay tareas que nunca terminan → SSR queda esperando indefinidamente.

---

### 4. Flujo de renderizado SSR

1. Servidor crea instancia de la app.
2. Angular ejecuta inicializaciones y peticiones.
3. `ApplicationRef.isStable` → espera a que sea `true`.
4. Cuando es estable:

   * Angular serializa el HTML generado.
   * Envía respuesta al cliente.
   * Cierra app en servidor.

---

### 5. Problemas comunes con `isStable` en SSR

* Peticiones HTTP que no se completan.
* Observables sin `complete()`.
* Intervalos o timeouts activos.
* Efecto: El SSR nunca responde (timeout).

---

### 6. Streaming SSR como alternativa

* Permite enviar HTML **parcial** sin esperar todo.
* Mejora TTFB (Time To First Byte).
* Configuración:

```ts
import { provideServerRendering } from '@angular/platform-server';

bootstrapApplication(AppComponent, {
  providers: [provideServerRendering({ bootstrap: 'streaming' })],
});
```

---

### 7. Ejemplo práctico con `isStable`

```ts
import { ApplicationRef, Injectable } from '@angular/core';
import { filter, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SsrReadyService {
  constructor(private appRef: ApplicationRef) {
    this.appRef.isStable
      .pipe(
        filter(stable => stable),
        first()
      )
      .subscribe(() => {
        console.log('SSR: Aplicación estable, lista para renderizar');
      });
  }
}
```

---

Si quieres, puedo hacerte **otro apunte extendido con diagramas** donde se vea claramente el ciclo **CSR vs SSR vs Streaming SSR** y cómo `isStable` encaja en cada uno.

¿Quieres que prepare también ese diagrama visual?
