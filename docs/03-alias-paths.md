# Path Alias en Angular

## Índice
1. [¿Qué son los alias paths?](#qué-son-los-alias-paths)
2. [Ejemplo de uso](#ejemplo-de-uso)
3. [Configuración en tsconfig.json](#configuración-en-tsconfigjson)

---

## ¿Qué son los alias paths?
Los alias paths permiten importar módulos o archivos usando rutas más legibles y cortas, facilitando el mantenimiento del código.

---

## Ejemplo de uso

```typescript
// Sin alias
import { environment } from '../../../../../environments/environment';
// Con alias
import { environment } from '@environments/environment';
```

---

## Configuración en tsconfig.json

Agregar en el archivo `tsconfig.json`, dentro de `compilerOptions`:

```json
{
  "baseUrl": ".",
  "paths": {
    "@environments/*": ["src/environments/*"]
  }
}
```