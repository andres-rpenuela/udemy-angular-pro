# 📦 Pasos para Publicar una Librería Angular a NPM

## 1. 🔧 Preparación Inicial

### Verificar configuración del proyecto
```bash
# Verificar que tienes una cuenta en NPM
npm whoami

# Si no tienes cuenta, créala en https://www.npmjs.com/
# Luego loguearte
npm login
```

### Configurar el `package.json` de la librería
```json
{
  "name": "@tu-usuario/nombre-libreria",
  "version": "1.0.0",
  "description": "Descripción de tu librería",
  "keywords": ["angular", "menu", "sidebar"],
  "author": "Tu Nombre <tu@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/tu-repo.git"
  },
  "homepage": "https://github.com/tu-usuario/tu-repo#readme",
  "bugs": {
    "url": "https://github.com/tu-usuario/tu-repo/issues"
  }
}
```

## 2. 🏗️ Build de la Librería

```bash
# Navegar al workspace
cd mi-workspace

# Construir la librería para producción
ng build devarp-side-menu

# O especificar configuración de producción
ng build devarp-side-menu --configuration production
```

## 3. 📋 Verificar archivos generados

```bash
# Los archivos se generan en:
dist/devarp-side-menu/

# Verificar que contenga:
# - package.json
# - README.md
# - public-api.d.ts
# - *.d.ts (archivos de tipos)
# - *.js (archivos compilados)
# - *.metadata.json
```

## 4. 📝 Crear/Actualizar documentación

### README.md
````markdown
# DevARP Side Menu

Una librería Angular para crear menús laterales con soporte para temas y navegación.

## Instalación

```bash
npm install @devarp/side-menu
```

## Uso básico

```typescript
import { DevarpSideMenu } from '@devarp/side-menu';

@Component({
  selector: 'app-root',
  template: `
    <devarp-side-menu 
      [menuItems]="menuItems"
      [userInfo]="userInfo"
      (onThemeChange)="onThemeChange($event)">
    </devarp-side-menu>
  `
})
export class AppComponent {
  // Tu código aquí
}
```

## API

### Inputs
- `menuItems`: MenuItem[] - Array de elementos del menú
- `userInfo`: UserInfo - Información del usuario
- `showThemeToggle`: boolean - Mostrar botón de cambio de tema

### Outputs
- `onThemeChange`: EventEmitter<boolean> - Emite cuando cambia el tema
````

## 5. 🚀 Publicación

### Navegar al directorio de distribución
```bash
cd dist/devarp-side-menu
```

### Verificar el contenido antes de publicar
```bash
# Ver qué archivos se van a publicar
npm pack --dry-run

# Crear un paquete temporal para revisar
npm pack
```

### Publicar a NPM
```bash
# Primera publicación
npm publish --access public

# Para actualizaciones (incrementar version en package.json antes)
npm publish
```

## 6. 📈 Gestión de Versiones

### Incrementar versiones automáticamente
```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### Rebuild y republish después de cambios
```bash
# Desde el root del workspace
ng build devarp-side-menu
cd dist/devarp-side-menu
npm publish
```

## 7. 🏷️ Tags y Releases

### Publicar una versión beta
```bash
npm publish --tag beta
```

### Publicar versión específica
```bash
npm publish --tag next
```

### Instalar versión específica
```bash
npm install @devarp/side-menu@beta
npm install @devarp/side-menu@1.2.0
```

## 8. 📊 Verificación Post-Publicación

### Verificar en NPM
```bash
# Ver información del paquete
npm info @devarp/side-menu

# Ver todas las versiones
npm view @devarp/side-menu versions --json
```

### Probar instalación
```bash
# En un proyecto nuevo
mkdir test-install
cd test-install
npm init -y
npm install @devarp/side-menu
```

## 9. 🔄 Script de Automatización

### Crear script en `package.json` del workspace
```json
{
  "scripts": {
    "build:lib": "ng build devarp-side-menu",
    "publish:lib": "npm run build:lib && cd dist/devarp-side-menu && npm publish",
    "publish:beta": "npm run build:lib && cd dist/devarp-side-menu && npm publish --tag beta"
  }
}
```

### Uso de los scripts
```bash
# Build y publish en un comando
npm run publish:lib

# Publicar versión beta
npm run publish:beta
```

## 10. 📋 Checklist antes de publicar

- [ ] ✅ Tests pasan (`ng test`)
- [ ] ✅ Build exitoso (`ng build devarp-side-menu`)
- [ ] ✅ README.md actualizado
- [ ] ✅ Version incrementada en `package.json`
- [ ] ✅ Changelog actualizado (opcional)
- [ ] ✅ Verificar archivos en `dist/`
- [ ] ✅ Logueado en NPM (`npm whoami`)
- [ ] ✅ Nombre del paquete disponible

## 11. 🚨 Comandos de Emergencia

### Despublicar (solo primeras 72 horas)
```bash
npm unpublish @devarp/side-menu@1.0.0 --force
```

### Deprecar una versión
```bash
npm deprecate @devarp/side-menu@1.0.0 "Esta versión tiene bugs, usa 1.0.1"
```

## 12. 🔗 Enlaces útiles

- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Angular Library Guide](https://angular.io/guide/creating-libraries)

----
