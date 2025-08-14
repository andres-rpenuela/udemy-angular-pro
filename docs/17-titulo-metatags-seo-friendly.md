
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
