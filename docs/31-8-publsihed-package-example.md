# 📜 Anexo: Explicación de Scripts NPM para la Librería

Ejemplo del la estructura del package json

```json
{
  "name": "mi-workspace",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",
    "devarp-side-menu:clean": "rm -rf dist/devarp-side-menu",
    "devarp-side-menu:build": "ng build devarp-side-menu",
    "devarp-side-menu:test": "ng test devarp-side-menu --no-watch --no-progress --browsers ChromeHeadlessNoSandbox",
    "devarp-side-menu:lint": "ng lint devarp-side-menu --max-warnings=5",
    "devarp-side-menu:verify": "npm run devarp-side-menu:lint && npm run devarp-side-menu:test && npm run devarp-side-menu:build",
    "devarp-side-menu:publish": "npm run devarp-side-menu:verify && cd dist/devarp-side-menu && npm publish --access public",
    "devarp-side-menu:version:patch": "cd projects/devarp-side-menu && npm version patch",
    "devarp-side-menu:version:minor": "cd projects/devarp-side-menu && npm version minor",
    "devarp-side-menu:version:major": "cd projects/devarp-side-menu && npm version major",
    "devarp-side-menu:release:patch": "npm run devarp-side-menu:version:patch && npm run devarp-side-menu:publish",
    "devarp-side-menu:release:minor": "npm run devarp-side-menu:version:minor && npm run devarp-side-menu:publish",
    "devarp-side-menu:release:major": "npm run devarp-side-menu:version:major && npm run devarp-side-menu:publish",
    "test:devarp-side-menu": "ng test devarp-side-menu",
    "test:devarp-side-menu:watch": "ng test devarp-side-menu --watch=true",
    "test:devarp-side-menu:headless": "ng test devarp-side-menu --watch=false --browsers=ChromeHeadless",
    "test:devarp-side-menu:coverage": "ng test devarp-side-menu --code-coverage --watch=false --browsers=ChromeHeadless"
  },
  ...
}
```


## 🎯 Scripts Básicos de Angular

```json
"ng": "ng",                    // Ejecutar CLI de Angular
"start": "ng serve",           // Iniciar servidor de desarrollo
"build": "ng build",           // Construir aplicación principal
"test": "ng test",             // Ejecutar tests de la aplicación
"lint": "ng lint"              // Revisar código con ESLint
```

## 🔧 Scripts Específicos de la Librería

### **Limpieza y Build**
```json
"devarp-side-menu:clean": "rm -rf dist/devarp-side-menu"
// 🗑️ Elimina carpeta de distribución para empezar limpio

"devarp-side-menu:build": "ng build devarp-side-menu"
// 🏗️ Construye la librería (genera archivos en dist/)
```

### **Testing**
```json
"devarp-side-menu:test": "ng test devarp-side-menu --no-watch --no-progress --browsers ChromeHeadlessNoSandbox"
// ✅ Ejecuta tests una sola vez sin interfaz gráfica

"test:devarp-side-menu": "ng test devarp-side-menu"
// 🧪 Tests básicos con interfaz

"test:devarp-side-menu:watch": "ng test devarp-side-menu --watch=true"
// 👀 Tests en modo watch (se re-ejecutan al cambiar código)

"test:devarp-side-menu:headless": "ng test devarp-side-menu --watch=false --browsers=ChromeHeadless"
// 🤖 Tests sin interfaz gráfica, una sola ejecución

"test:devarp-side-menu:coverage": "ng test devarp-side-menu --code-coverage --watch=false --browsers=ChromeHeadless"
// 📊 Tests + reporte de cobertura de código
```

### **Linting**
```json
"devarp-side-menu:lint": "ng lint devarp-side-menu --max-warnings=5"
// 🔍 Revisa calidad de código (máximo 5 warnings permitidos)
```

## 🚀 Scripts de Publicación

### **Verificación Completa**
```json
"devarp-side-menu:verify": "npm run devarp-side-menu:lint && npm run devarp-side-menu:test && npm run devarp-side-menu:build"
// ✅ Ejecuta: Lint → Tests → Build (todo debe pasar)
```

### **Publicación**
```json
"devarp-side-menu:publish": "npm run devarp-side-menu:verify && cd dist/devarp-side-menu && npm publish --access public"
// 📦 Verifica todo → se mueve a dist/ → publica en NPM
```

## 📈 Scripts de Versionado

### **Incrementar Versiones**
```json
"devarp-side-menu:version:patch": "cd projects/devarp-side-menu && npm version patch"
// 🔢 1.0.0 → 1.0.1 (corrección de bugs)

"devarp-side-menu:version:minor": "cd projects/devarp-side-menu && npm version minor"  
// 🔢 1.0.0 → 1.1.0 (nueva funcionalidad)

"devarp-side-menu:version:major": "cd projects/devarp-side-menu && npm version major"
// 🔢 1.0.0 → 2.0.0 (cambios que rompen compatibilidad)
```

## 🎉 Scripts de Release (Todo en Uno)

### **Release Completo**
```json
"devarp-side-menu:release:patch": "npm run devarp-side-menu:version:patch && npm run devarp-side-menu:publish"
// 🚀 Incrementa patch + verifica + publica

"devarp-side-menu:release:minor": "npm run devarp-side-menu:version:minor && npm run devarp-side-menu:publish"
// 🚀 Incrementa minor + verifica + publica

"devarp-side-menu:release:major": "npm run devarp-side-menu:version:major && npm run devarp-side-menu:publish"
// 🚀 Incrementa major + verifica + publica
```

## 💡 Cómo Usar los Scripts

### **Desarrollo Diario**
```bash
# Ejecutar tests mientras desarrollas
npm run test:devarp-side-menu:watch

# Verificar calidad antes de commit
npm run devarp-side-menu:lint
```

### **Antes de Publicar**
```bash
# Verificar que todo esté bien
npm run devarp-side-menu:verify

# Ver cobertura de tests
npm run test:devarp-side-menu:coverage
```

### **Publicar Nueva Versión**
```bash
# Para corrección de bug (1.0.0 → 1.0.1)
npm run devarp-side-menu:release:patch

# Para nueva funcionalidad (1.0.0 → 1.1.0)  
npm run devarp-side-menu:release:minor

# Para cambio mayor (1.0.0 → 2.0.0)
npm run devarp-side-menu:release:major
```

### **Solo Build sin Publicar**
```bash
# Construir librería
npm run devarp-side-menu:build

# Limpiar y construir
npm run devarp-side-menu:clean && npm run devarp-side-menu:build
```

## 🔄 Flujo Típico de Release

1. **Desarrollo** → `npm run test:devarp-side-menu:watch`
2. **Verificación** → `npm run devarp-side-menu:verify`  
3. **Release** → `npm run devarp-side-menu:release:patch`

**¡Con estos scripts tienes todo automatizado para publicar tu librería! 🎯**