# Apuntes: Soporte Dark/Light Mode en Angular + Tailwind

## Índice
1. [Configuración de Tailwind para Dark Mode](#configuracion-tailwind)
2. [Estilos globales y body](#estilos-globales)
3. [Componente ThemeToggle](#componente-them-toggle)
4. [Uso en páginas y componentes](#uso-en-paginas)
5. [Persistencia de preferencia](#persistencia)
6. [Notas y buenas prácticas](#notas)
7. [Ejemplo: Guardar y cargar preferencia de tema con localStorage](#ejemplo-guardar-y-cargar-preferencia-de-tema-con-localstorage)

---

## 1. <a id="configuracion-tailwind"></a>Configuración de Tailwind para Dark Mode
- En `tailwind.config.js`:
  ```js
  module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts,css,scss,sass}"],
    theme: { extend: {} },
    plugins: [],
  }
  ```

## 2. <a id="estilos-globales"></a>Estilos globales y body
- En `src/styles.css` elimina cualquier color forzado en `html, body`.
- En `src/index.html` añade:
  ```html
  <body class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
    <app-root></app-root>
  </body>
  ```

## 3. <a id="componente-them-toggle"></a>Componente ThemeToggle
- Ubicación: `src/app/common/components/theme-toggle/`
- Usa signals y localStorage para alternar y persistir el modo.
- Ejemplo de uso:
  ```html
  <theme-toggle></theme-toggle>
  ```

## 4. <a id="uso-en-paginas"></a>Uso en páginas y componentes
- Usa clases Tailwind como `bg-white dark:bg-gray-900` y `text-gray-900 dark:text-white` en los wrappers principales de cada componente/página.
- No fuerces colores en CSS global.

## 5. <a id="persistencia"></a>Persistencia de preferencia
- El componente guarda la preferencia en `localStorage` y la aplica en cada recarga.
- Respeta la preferencia del sistema si no hay valor guardado.

## 6. <a id="notas"></a>Notas y buenas prácticas
- Reinicia el servidor tras cambiar la config de Tailwind.
- Usa solo utilidades de Tailwind para colores.
- El modo oscuro/claro se aplica a toda la app gracias a la clase `dark` en `<html>` o `<body>`.
- El botón puede colocarse en cualquier página para control global.

---

### Ejemplo: Guardar y cargar preferencia de tema con localStorage

```typescript
// Dentro del componente ThemeToggle

// Inicialización del signal con preferencia guardada o sistema
this.theme = signal<'light' | 'dark'>(
  localStorage.getItem('theme') === 'dark'
    ? 'dark'
    : localStorage.getItem('theme') === 'light'
      ? 'light'
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
);

// Al cambiar el tema
this.theme.set(next);
localStorage.setItem('theme', next);

// Al iniciar, aplicar el tema guardado
if (localStorage.getItem('theme')) {
  this.applyTheme(localStorage.getItem('theme') as 'light' | 'dark');
}
```

- Así, el usuario mantiene su preferencia aunque recargue o cierre el navegador.
- Si no hay preferencia guardada, se usa la del sistema.
- El cambio es inmediato y global gracias a la clase `dark` en `<html>` o `<body>`.
