# Environments en Angular

## Índice
1. [¿Qué son los environments?](#qué-son-los-environments)
2. [Generar archivos de environment](#generar-archivos-de-environment)
3. [Configuración en angular.json](#configuración-en-angularjson)
4. [Uso en componentes](#uso-en-componentes)
5. [Referencia en la plantilla](#referencia-en-la-plantilla)

---

## ¿Qué son los environments?
Angular CLI permite crear scripts de environment para separar configuraciones de desarrollo y producción. Esto facilita el reemplazo automático de archivos según el entorno al compilar.

---

## Generar archivos de environment

```bash
# Ir al proyecto
cd gitsapp/

# Generar scripts de environments
ng g environments
# o
ng generate environments
```

---

## Configuración en angular.json

Esto añade automáticamente en `angular.json`:

```json
// ...
    "sourceMap": true,
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.development.ts"
      }
    ]
  }
// ...
```

---

## Uso en componentes

Importar el environment en el componente:

```typescript
import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './gifs-side-menu-header.component.html',
  styleUrl: './gifs-side-menu-header.component.css',
  standalone: true
})
export class GifsSideMenuHeaderComponent {
  protected envs = environment;
}
```

---

## Referencia en la plantilla


En el HTML del componente:

```html
<a>{{envs.companyName}}</a>
```