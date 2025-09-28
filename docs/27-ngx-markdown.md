# Apuntes: Uso de ngx-markdown para mostrar descripción en Angular

## 1. Instalación

Ejecuta en la terminal:

```
npm i ngx-markdown
```

## 2. Configuración recomendada (Angular 16+)

- Añade el provider de Markdown en el `app.config.ts`:

```typescript
import { provideMarkdown } from 'ngx-markdown';

export default defineApplicationConfig({
  providers: [
    provideMarkdown(),
    // ...otros providers
  ],
});
```

- Importa `MarkdownModule` solo en el módulo o componente donde lo necesites (feature o standalone):

```typescript
import { MarkdownModule } from 'ngx-markdown';

@Component({
  // ...
  imports: [MarkdownModule],
})
export class TuFeatureComponent {}
```

## 3. Usar el componente en tu template

### Mostrar Markdown desde una variable:

```html
<markdown>{{ issue.body }}</markdown>
```

- También puedes usar `[data]="issue.body"` si prefieres la sintaxis de input.

### Cargar y mostrar un fichero .md:

```html
<markdown src="assets/docs/ejemplo.md"></markdown>
```

- El archivo debe estar en la carpeta `assets` o ser accesible públicamente.
- Puedes cambiar la ruta según tu estructura.

## 4. Notas
- ngx-markdown soporta sintaxis Markdown estándar y muchas extensiones.
- Puedes aplicar estilos adicionales usando TailwindCSS o CSS propio.
- Si usas Angular standalone components, importa `MarkdownModule` en el array `imports` del decorador `@Component`.
- Para cargar archivos externos, asegúrate de que el servidor permita el acceso a esos archivos (por ejemplo, en `angular.json` incluye la carpeta en `assets`).

---

Con esto puedes mostrar descripciones de issues, comentarios o archivos Markdown externos de forma sencilla y elegante en Angular, usando la configuración moderna recomendada.