# Índice

1. [Instalación de Angular CLI con Yarn](#instalación-de-angular-cli-con-yarn)
2. [Desinstalación de Angular CLI y Yarn](#desinstalación-de-angular-cli-y-yarn)
3. [Verificación](#verificación)
4. [Limpia cachés](#limpia-cachés)

---

## ✅ Instalación de Angular CLI con Yarn

### 1. Asegúrate de tener:

* **Node.js** y **npm** instalados con **nvm** 
* **Yarn** instalado globalmente:

  ```bash
  npm install -g yarn
  ```

### 2. Instalar Angular CLI globalmente con npm:

```bash
npm install -g @angular/cli
```

### 3. Verificar que Angular está instalado:

```bash
ng version
```

### 4. Crear un nuevo proyecto Angular usando Yarn:

```bash
ng new zoneless-calculator --package-manager=yarn
√ Do you want to create a 'zoneless' application without zone.js (Developer Preview)? No
√ Which stylesheet format would you like to use? CSS             [ https://developer.mozilla.org/docs/Web/CSS ]
√ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? No
CREATE zoneless-calculator/angular.json (2575 bytes)
....
```

```bash
cd zoneless-calculator
yarn ng serve -o

# o 
yarn start
```

> Nota:
> Si ng no funciona después de instalarlo, el usuario debe agregar el path de npm global o yarn global bin al PATH de su sistema.
> 
> Ejemplo:
>```bash
> export PATH="$PATH:$(yarn global bin)"
>```
>
---

## ❌ Desinstalación de Angular CLI y Yarn

### 1. Desinstalar Angular CLI:

```bash
npm uninstall -g @angular/cli
```

Nota: Asegúrate de que el directorio global de npm o yarn esté en tu PATH

```bash
# Puedes obtener la ruta con:
yarn global bin
```

### 2. (Opcional) Borrar proyectos Angular creados:

```bash
rm -rf nombre-proyecto  # Linux/macOS
rd /s /q nombre-proyecto  # Windows CMD
```

### 3. Desinstalar Yarn (según cómo lo instalaste):

#### Si fue con npm:

```bash
npm uninstall -g yarn
```

#### Si usaste el instalador de Yarn (en Windows):

* Ve a **Panel de control > Desinstalar un programa**
* Busca **Yarn** y elimínalo

---

## 🔁 Verificación

```bash
ng version        # No debe existir
yarn --version    # No debe existir
```

---

## ✅ Limpia cachés

```bash
npm cache clean --force
yarn cache clean
```