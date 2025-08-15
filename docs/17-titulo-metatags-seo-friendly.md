
## 📘 Apuntes: Título y Metatags en Angular SSR-Friendly

## 🧠 ¿Por qué es importante?

Cuando usas Angular con SSR, el contenido del `<head>` (como `<title>` y `<meta>`) **sí se renderiza en el servidor**, lo que permite que los motores de búsqueda (_Google, Bing, etc._) lo indexen correctamente. Esto mejora el **SEO** y la visibilidad de tu app.


### 1. 📦 Importar servicios del navegador

```ts
import { Meta, Title } from '@angular/platform-browser';
```

Estos servicios permiten modificar el `<head>` del documento.

---

### 2. 🧪 Inyectar servicios con `inject()` (Angular 14+)

```ts
private title = inject(Title);
private meta = inject(Meta);
```

Usamos `inject()` en lugar de constructor para mantener limpio el template y evitar exponerlos.

---

### 3. 📝 Establecer título y metatags en `ngOnInit`

```ts
ngOnInit() {
  this.title.setTitle('About Page');

  this.meta.updateTag({ name: 'description', content: 'Este es mi About Page' });
  this.meta.updateTag({ name: 'og:title', content: 'Este es mi About Page' });
  this.meta.updateTag({ name: 'keywords', content: 'Hola,Andres,Mundo,Fernando,Angular,PRO' });
}
```

- `setTitle()` cambia el `<title>` del documento.
- `updateTag()` añade o actualiza metatags.
- Puedes usar `og:title`, `twitter:card`, etc. para redes sociales.

---

### 4. ✅ SSR Compatibility

Esto **funciona perfectamente con Angular Universal**, ya que el servidor renderiza el HTML con estos metatags incluidos.

---

### 5. 🧩 Bonus: Dinámico por ruta

Si quieres que el título y metatags cambien según la ruta, puedes usar el `Router` y `ActivatedRoute` para obtener datos dinámicos y actualizar el `<head>` en consecuencia.

## Elementos incompatibles en servidro
Cuando usas Server-side rendering (SSR) con Angular Universal, tu aplicación se ejecuta en Node.js, no en un navegador. Eso significa que:

- No existe `window`, `document`, `navigator` ni `location`
- No hay eventos del DOM como `click`, `keydown` o `scroll`
- No puedes acceder a `localStorage` ni `sessionStorage`
- No se renderizan elementos HTML ni estilos como en el navegador

Si intentas usar estas APIs directamente en el servidor, obtendrás errores o comportamientos inesperados.

Sin embargo, Angular ofrece **tokens inyectables** que abstraen algunas APIs del navegador.

### 🛠️ Soluciones de Angular: Abstracciones y Shims

| API del navegador | Abstracción en Angular | Comentarios |
|-------------------|------------------------|-------------|
| `document`        | `DOCUMENT` de `@angular/common` | Se puede inyectar de forma segura |
| `location`        | `Location` de `@angular/common` | Funciona con el enrutamiento de Angular |
| `window`          | No hay abstracción nativa | Puedes crear un servicio personalizado |
| `navigator`       | Tampoco tiene abstracción | Se puede hacer un shim manual |

#### 🧩 Ejemplo: Servicio personalizado para `window`

```ts
@Injectable({ providedIn: 'root' })
export class WindowRef {
  get nativeWindow(): Window | undefined {
    return typeof window !== 'undefined' ? window : undefined;
  }
}
```

Así puedes usar `window` sin romper el SSR.

---

### 🚦 SSR y Enrutamiento

Como en el servidor **no hay interacción del usuario**, Angular Universal debe decidir **qué renderizar solo con la URL**. Por eso:

- Tu app debe ser **enrutable**
- Los componentes deben mostrarse según la ruta
- El lazy loading y los guards funcionan, pero deben estar adaptados al SSR

---

### 🧠 Tip útil: Detectar si estás en el navegador `PLATFORM_ID`

Angular te permite saber si estás en el navegador o en el servidor:

```ts
import { isPlatformBrowser, PLATFORM_ID } from '@angular/common';
import { Inject } from '@angular/core';

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    // ✅ Código seguro para el navegador
    document.title = 'Pricing Page';
  } else {
    // 🖥️ Código que solo se ejecuta en el servidor
    console.log('Renderizando en el servidor');
  }
}

```

### ⚠️ ¿Por qué se ejecuta dos veces?
Porque Angular Universal hace:

1. SSR: ejecuta el componente en el servidor → genera HTML
2. Hydration: ejecuta el componente en el navegador → activa la app

Por eso ves dos ejecuciones en consola, pero el navegador solo muestra el resultado final.

---

## 💧 ¿Qué es la *hydration* en Angular Universal?

La **hidratación** es el proceso por el cual Angular **reutiliza el HTML renderizado en el servidor** y lo convierte en una aplicación interactiva en el navegador, **sin volver a renderizar todo desde cero**.

### 🔄 En otras palabras:

1. 🖥️ **SSR (Server-Side Rendering)**: El servidor genera el HTML completo y lo envía al navegador.
2. 🌐 **El navegador lo muestra inmediatamente**, lo que mejora el rendimiento inicial.
3. ⚡ **Hydration**: Angular detecta ese HTML ya renderizado y lo "activa", conectando los componentes, eventos, bindings, etc., **sin destruir el DOM**.

---

#### 🧠 ¿Por qué es importante?

- Mejora el **Time to Interactive (TTI)**.
- Evita el **parpadeo** o re-render innecesario.
- Es clave para SEO y rendimiento en apps públicas.

---

#### 🧪 ¿Y lo que hablamos antes, de usar los eventos, window,...?

Lo que mencionamos antes (usar `isPlatformBrowser`, abstraer `window`, etc.) es parte de **hacer que tu app sea compatible con SSR**, pero **la hidratación es un paso posterior**, cuando Angular **ya está en el navegador** y necesita **activar** esa app renderizada por el servidor.

---

#### 🧰 ¿Angular ya soporta hidratación?

Sí, desde Angular 16 en adelante, Angular Universal incluye soporte para **hydration automática**, aunque todavía está evolucionando. Puedes activarla así:

```ts
provideClientHydration()
```

En tu `main.ts` o en el módulo principal.


---

## Bibliografía
[Server-side rendering (SSR) with Angular Universal](https://docs.angular.lat/guide/universal#server-side-rendering-ssr-with-angular-universal)