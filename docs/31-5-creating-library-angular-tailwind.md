# Usar talwinds en la librería (dependencias)

Se puede utilizar en nuestras librearias depedncias a otras librerias y/o framework e indicar que para usar nuestra librería es requerida librearias de terceros.

Esto puede generar debate, pues generar una librearía con muchas depdencias o dependecias de terceros puede probrar que errores con versiones, y por tanto, es vital determinar la versión.

## Configuración.

En el caso expuesto, se va utilizar `tailwindcss v3` como depedencia, y se **instalará de manera global en el mono-repo** o **workpace**, para que todas las librerias y aplicaicones que contenga el mono-repo, lo tenga disponible.

Así que realizmaos la siguiente configuración:


1. Ir al directorio donde se encuentra el mono repo
```bash
cd ..\PRJ00004\mi-workspace
```  

2. Instalar la version de tailwindcss siguiendo la [guía oficial](https://v3.tailwindcss.com/docs/installation/framework-guides):

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
```

3. En el fichero de configuración `tailwind.config.js` se indicara ` "./projects/**/*.{html,ts}"` en vez de ` "./src/**/*.{html,ts}"`, como nos indica la guía, puesto, que nuestros archivos fuente cuelgan de `projects/...`, y `projects` esta al mismo nivle que el fichero de configuración

```
mi-workpace/
  -projects/
    - dev-testdev-app/
    - devarp-side-menu/
  -tailwind.confing.js
```

De manera que el fichero tendría la siguiente pinta:
```js
//tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```
4. En el css donde vamos a utilizar tailwidns se importa los estilos, es decir,  en nuestra cama de pruebas, en la **librearía** aunque se utilice tailwindcss, no es cesario.

```css
/* styles.css de dev-testdev-app */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Ejecutamos nuestra cama de pruebas:

```bash
ng serve dev-testdev-app -o
```


## Funcionalidad y estilos de la librería

Una vez configurado **talwindcss** en el mono-repo, lo que se va hacer modificar la libreria para crear el `side-menu`.

Para ello, en la vista de la librería se inserta el código con los elementos que se visualizan:

```html
<!-- devarp-side-menu.html-->
 <aside class="bg-gradient-to-br from-gray-800 to-gray-900 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
    <div class="relative border-b border-white/20">
      <a class="flex items-center gap-4 py-6 px-8" href="#/">
        <h6 class="text-2xl font-bold block antialiased tracking-normal font-sans leading-relaxed text-white">
          <span class="text-blue-500">DevArp</span>
          <span class="font-thin"> Corp</span>
        </h6>
      </a>
      <button
        class="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
        type="button">
        <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
  <!-- ... -->
 ```

 Y en la lógica del mismo:

 ```ts
 //devarp-side-menu.ts
 import { Component, input, output } from '@angular/core';
import {  RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'lib-devarp-side-menu',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: 'devarp-side-menu.html',
  styles: ``
})
export class DevarpSideMenu {
  isAuthenticated = input(false);

  inSignOn = output();
  outSignOn = output();

}
 ```


Empaqutamos la librearía, para apliciar los cambios:

```bash
...\PRJ00004\mi-workspace>npx ng build devarp-side-menu --configuration development

# O empaquetar con version, por medio de script propio fornzado lint
#...\PRJ00004\mi-workspace>npm run devarp-side-menu:release:patch
```

E ininicmaos la cama de pruebas que usa la libreraía

```bash
...\PRJ00004\mi-workspace>npx ng serve -o dev-testdev-app  
```