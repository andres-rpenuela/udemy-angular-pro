# Apuntes: Uso de ActivatedRoute en Angular

## ¿Qué es ActivatedRoute?

`ActivatedRoute` es un servicio de Angular que proporciona información sobre la ruta asociada al componente cargado actualmente. Permite acceder a:

- Parámetros de ruta (`paramMap`)
- Parámetros de query (`queryParamMap`)
- Datos estáticos y dinámicos
- Fragmentos de la URL
- Información sobre rutas hijas

---

## Importación y uso básico

```typescript
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {}
```

---

## Acceso a Parámetros

### 1. Parámetros de Ruta (`paramMap`)

#### Definición de ruta
```typescript
// app-routing.module.ts
{ path: 'detalle/:id', component: DetalleComponent }
```

#### Acceso en el componente:

```typescript
// snapshot (solo una vez)
const id = this.route.snapshot.paramMap.get('id');

// observable (reactivo)
this.route.paramMap.subscribe(params => {
  const id = params.get('id');
});
```

### 2. Parámetros de Query (`queryParamMap`)

#### ¿Qué son los query parámetros?

Son valores enviados en la URL después del signo de interrogación (`?`).  
Por ejemplo:  
```
/detalle?id=123&activo=true
```
En este caso, `id` y `activo` son **query parámetros**. Se usan comúnmente para filtros, paginación, búsqueda, etc.

#### Acceso:

```typescript
// snapshot
const id = this.route.snapshot.queryParamMap.get('id');
const activo = this.route.snapshot.queryParamMap.get('activo');

// observable
this.route.queryParamMap.subscribe(params => {
  const id = params.get('id');
  const activo = params.get('activo');
});
```

#### Cómo definir y navegar con query parámetros

Para navegar programáticamente y enviar query parámetros, se usa el router de Angular:

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

// Navegar a /detalle?id=123
this.router.navigate(['/detalle'], { queryParams: { id: 123 } });
```

Puedes agregar múltiples parámetros:

```typescript
this.router.navigate(['/detalle'], { queryParams: { id: 123, activo: true } });
```

#### Enlace con query parámetros en el template

```html
<!-- Enlace a /detalle?id=123 -->
<a [routerLink]="['/detalle']" [queryParams]="{id: 123}">Ver detalle</a>
```

---

### 3. Diferencia clave

- `paramMap`: **/ruta/:id** (parámetros definidos en la ruta)
- `queryParamMap`: **?param=valor** (parámetros después del signo de interrogación)

---

## Acceso a Datos y Fragmentos

### Datos estáticos y resolvers

```typescript
// en rutas
{ path: 'user', component: UserComponent, data: { titulo: 'Usuarios' } }

// acceso en componente
const titulo = this.route.snapshot.data['titulo'];
```

### Fragmentos de la URL

```typescript
// URL: /ruta#mi-fragmento
this.route.fragment.subscribe(fragment => {
  // fragment = 'mi-fragmento'
});
```

---

## Uso avanzado: Rutas anidadas

Para rutas hijas, puedes acceder a ellas mediante `children` o `firstChild`:

```typescript
this.route.firstChild?.paramMap.subscribe(...)
```

---

## Ejemplo completo

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  template: `
    <p>ID de ruta: {{ id }}</p>
    <p>Query param: {{ queryId }}</p>
    <button (click)="irAConQuery()">Ir a detalle con query param</button>
  `
})
export class DetalleComponent implements OnInit {
  id: string | null = '';
  queryId: string | null = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.route.queryParamMap.subscribe(params => {
      this.queryId = params.get('id');
    });
  }

  irAConQuery() {
    // Navegar a /detalle?id=555
    this.router.navigate(['/detalle'], { queryParams: { id: 555 } });
  }
}
```

---

## Notas y buenas prácticas

- Usa el observable (`paramMap`/`queryParamMap`) si el parámetro puede cambiar sin recargar el componente.
- Usa el `snapshot` si solo necesitas el valor inicial y el componente se recreará ante cambios de URL.
- Para integración con signals (Angular >= 16):  
  Puedes usar `toSignal` para transformar observables de `ActivatedRoute` en signals reactivas.

---

## Referencias

- [Angular Docs: ActivatedRoute](https://angular.io/api/router/ActivatedRoute)
- [Angular Router Guide](https://angular.io/guide/router)
