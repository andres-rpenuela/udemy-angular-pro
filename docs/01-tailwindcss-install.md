## Usar tailwindcss como framework css
Alternativa a boostrap

### Índice
1. [Guía oficial](#guía-oficial)
2. [Instalación de dependencias](#instalación-de-dependencias)
3. [Configuración de PostCSS](#configuración-de-postcss)
4. [Importar Tailwind en el CSS global](#importar-tailwind-en-el-css-global)
5. [Probar con un ejemplo](#probar-con-un-ejemplo)
6. [Levantar el servidor](#levantar-el-servidor)

---

### Guía oficial
Ir a la guía de la web [https://tailwindcss.com/](https://tailwindcss.com/docs/installation/framework-guides)

> **Guia agular**:
> [link](https://tailwindcss.com/docs/installation/framework-guides/angular)

### Instalación de dependencias
```bash
# ng new my-project --style css
# cd my-project

npm install tailwindcss @tailwindcss/postcss postcss --force
```

### Configuración de PostCSS
1. Crear un fichero en la raiz del proyecto, **nombre**: `.postcssrc.json`
2. Importar el plugin `@tailwindcss/postcss`
```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Importar Tailwind en el CSS global
En el CSS del proyecto `styles.css`:
```css
@import "tailwindcss";
```

### Probar con un ejemplo
En `app.component.html`:
```html
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
```

### Levantar el servidor
```bash
ng serve
```