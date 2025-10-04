# Apuntes: Uso de injectQuery con signals en TanStack Query Angular

> **Nota:**
> El `queryFn` de `injectQuery` puede devolver una `Promise`, un `Observable` (Angular lo convierte internamente a promesa), o incluso un valor síncrono. Sin embargo, lo más común es devolver una promesa o un observable (por ejemplo, una petición HTTP). Si devuelves un valor síncrono, TanStack Query lo manejará igualmente como una promesa.


## 1. Estructura básica de injectQuery

```typescript
import { injectQuery } from '@tanstack/angular-query-experimental';

// Ejemplo simple con valor fijo
const issueQuery = injectQuery(() => ({
  queryKey: ['issue', 1],
  queryFn: () => getIssueByNumber(1)
}));
```

## 2. Uso de enabled para controlar la ejecución

```typescript
const issueQuery = (id: number | null) => injectQuery(() => ({
  queryKey: ['issue', id],
  queryFn: () => getIssueByNumber(id!),
  enabled: id != null
}));
```

- Si `id` es null, la query no se ejecuta.
- Puedes mostrar un mensaje personalizado si `id` es null.

## 3. Uso con signals (recomendado para reactividad)

```typescript
import { Signal } from '@angular/core';

// issueNumber es un Signal<number | null>
const issueQuery = (issueNumber: Signal<number | null>) => injectQuery(() => ({
  queryKey: ['issue', issueNumber()], // Tipado estricco
  queryFn: () => getIssueByNumber(issueNumber()!),
  enabled: issueNumber() != null
}));
```

- La query se reactiva automáticamente cuando cambia el valor del signal.
- Solo se ejecuta si el id es válido.

## 4. Manejo de error si el id no existe

```typescript
const issueQuery = (id: number | null) => injectQuery(() => ({
  queryKey: ['issue', id],
  queryFn: () => {
    if (id == null) throw new Error('ID no encontrado');
    return getIssueByNumber(id);
  },
  enabled: id != null
}));
```

- Si el id es null, lanza un error y puedes mostrar el mensaje en el componente.


---

## 5. Ejemplo: Uso de injectQuery para hacer un POST (no recomendado, pero posible)

Normalmente, las queries son para peticiones GET. Para hacer un POST, puedes usar `queryFn` con una función que haga la petición POST, aunque lo ideal es usar mutations para esto. Ejemplo:

```typescript
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HttpClient } from '@angular/common/http';

const http = inject(HttpClient);

const postQuery = injectQuery(() => ({
  queryKey: ['createIssue', body],
  queryFn: () => http.post('/api/issues', body).toPromise(),
  enabled: !!body // solo ejecuta si body existe
}));
```

> ⚠️ Lo recomendado para POST, PUT, DELETE es usar `injectMutation` en vez de `injectQuery`.

### ¿Cuándo usarlo?
- Solo si necesitas cachear el resultado de un POST y no puedes usar mutation.
- Para efectos demostrativos o pruebas.

---

Estos patrones te permiten controlar la ejecución y el manejo de errores de queries en Angular usando TanStack Query y signals.

## ERROR Error: NG0203: injectQuery() can only be used within an injection context

> ERROR Error: NG0203: injectQuery() can only be used within an injection context such as a constructor, a factory function, a field initializer, or a function used with runInInjectionContext. Find more at https://angular.dev/errors/NG0203.

El error es porque esta invocando el injectQuery en un metodo, y el injectQuery esta dentro de otro metodo en un servicio.


```ts
// en el componente
get issuesBySate(){
  // se le pasa al serivcio
  return this.issueService.getAllIssuesByState( this.stateSelected )
}
```

```ts
// servico
public getAllIssuesByState = (state: Signal<State>) => injectQuery( () =>({
  queryKey: ['allIssues', state()], // identificador con el que se cachea, consiste en unarreglo que genera una llave unica
  queryFn: () => getGithubIssuesActionsByState(state()), // peticion http
  enabled: !!state() // solo se ejecuta si state es truthy (no null, undefined, 0, etc.)
}));

```

### Como solucioanrlo
Component:
```ts
// A: Invocarlo como variable del compontne (como se hace en el caso de issueByNumber)
issues = this.issueService.getAllIssuesByState( this.stateSelected )


// B: Usar runInInjectionContext en el componente (En el serivicio no haría falta nada)
public getAllIssuesByState = (state: Signal<State>) =>
 runInInjectionContextt(inject(IssuesService), () =>
   injectQuery(() => ({
     queryKey: ['allIssues', state()],
     queryFn: () => getGithubIssuesActionsByState(state()),
     enabled: !!state()
   }))
 );

// C: Cambiar el injectQuery para que no este dentro de un metodo del serivicio, lo que implica que el estado sea gesitoando por el servicoi (Recomendada)
get issuesBySate(){
  return this.issueService.getAllIssuesByState()
}

pucli updateState(newState:State[]){
  this.issueService( state)
}
```

En el servcio:
```ts

// Si se usaa la opción A
public getAllIssuesByState = (state: Signal<State>) => injectQuery( () =>({
  queryKey: ['allIssues', state()], // identificador con el que se cachea, consiste en unarreglo que genera una llave unica
  queryFn: () => getGithubIssuesActionsByState(state()), // peticion http
  enabled: !!state() // solo se ejecuta si state es truthy (no null, undefined, 0, etc.)
}));


// Si se usa la opción C
public stateSelected = signal<State>(State.All);

public getAllIssuesByState = injectQuery(() => ({
  queryKey: ['allIssues', this.stateSelected()],
  queryFn: () => getGithubIssuesActionsByState(this.stateSelected()),
  enabled: !!this.stateSelected()
}));
```