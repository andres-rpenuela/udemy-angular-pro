# Usar tailwindcss como framework css
Alternativa a boostrap

# Índice
1. [Guía de instalación: Tailwind CSS en Angular v3](#guía-de-instalación:-tailwind-css-en-angular-v3)
2. [Guía de instalación: Tailwind CSS en Angular v4](#guía-de-instalación:-tailwind-css-en-angular-v4)

---

# Guía de instalación: Tailwind CSS en Angular v3
Ir a la guía de la web [https://tailwindcss.com/](https://tailwindcss.com/docs/installation/framework-guides)

> **Guia agular**:
> [link](https://tailwindcss.com/docs/installation/framework-guides/angular)

### 1️⃣  Instalación de dependencias
```bash
# ng new my-project --style css
# cd my-project

npm install tailwindcss @tailwindcss/postcss postcss --force
```

### 2️⃣ Configuración de PostCSS
1. Crear un fichero en la raiz del proyecto, **nombre**: `.postcssrc.json`
2. Importar el plugin `@tailwindcss/postcss`
```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 3️⃣ Importar Tailwind en el CSS global
En el CSS del proyecto `styles.css`:
```css
@import "tailwindcss";
```

### 4️⃣ Probar con un ejemplo
En `app.component.html`:
```html
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
```

### 5️⃣ Levantar el servidor
```bash
ng serve
```

---

## 🛠️ Guía de instalación: Tailwind CSS en Angular v3 

Compatible con `@apply`.

Aquí tienes la guía oficial para instalar Tailwind CSS en un proyecto Angular, basada en [Tailwind CSS v3](https://v3.tailwindcss.com/docs/guides/angular):


### 1️⃣ Crear el proyecto Angular

```bash
ng new my-project --style css
cd my-project
```

> Puedes usar `--style scss` si prefieres SCSS, pero para `@apply` se recomienda CSS o PostCSS.

---

### 2️⃣ Instalar Tailwind y sus dependencias

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
```

---

### 3️⃣ Configurar PostCSS

Crea un archivo `tailwind.config.js` en la raíz del proyecto:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4️⃣ Importar Tailwind en tus estilos globales

Edita `src/styles.css` y añade:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5️⃣ Ejecutar el proyecto

```bash
ng serve
```


### 6️⃣ Usar clases de Tailwind

Ejemplo en `app.component.html`:

```html
<h1 class="text-3xl font-bold underline text-center mt-10">
  Hello Tailwind + Angular!
</h1>
```
