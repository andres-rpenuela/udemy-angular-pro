# TanStack Query
[TanStack Query][2])] (_anteriormente conocido como React Query_) es una biblioteca de código abierto diseñada para simplificar la gestión del estado del servidor en aplicaciones web modernas.

---

## 🧠 ¿Qué es TanStack Query?

TanStack Query es una herramienta para manejar datos asincrónicos en aplicaciones web, enfocándose en la interacción con el servidor. A diferencia de bibliotecas como Redux o MobX, que gestionan el estado del cliente, TanStack Query se especializa en el estado del servidor, facilitando tareas como la obtención, almacenamiento en caché, actualización y sincronización de datos remotos. ([Medium][1])

---

## 🔧 Características principales

* **Obtención de datos declarativa**: Utiliza funciones como `useQuery` para obtener datos de manera declarativa, manejando automáticamente estados como carga, error y éxito.

* **Almacenamiento en caché y actualización automática**: Gestiona el almacenamiento en caché de datos y los actualiza en segundo plano para mantener la información fresca.

* **Soporte para mutaciones**: Permite realizar operaciones de escritura en el servidor con `useMutation`, facilitando tareas como la creación, actualización o eliminación de datos.

* **Soporte para Suspense de React**: Integración con React Suspense para una experiencia de usuario más fluida y declarativa.

* **Compatibilidad con múltiples frameworks**: Además de React, TanStack Query es compatible con otros frameworks como Vue, Svelte, Solid y Angular.

---

## 📦 Instalación

Para proyectos basados en React:

```bash
npm install @tanstack/react-query
```

Para Angular:

```bash
npm i @tanstack/angular-query-experimental

```
---

## 🧪 Ejemplo básico en React

A continuación, se muestra un ejemplo básico de cómo utilizar `useQuery` para obtener una lista de usuarios:

```jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function UsersList() {
  const { data, error, isLoading } = useQuery(['users'], fetchUsers);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UsersList;
```

Este ejemplo muestra cómo utilizar `useQuery` para obtener datos de una API y manejar los estados de carga y error de manera sencilla.

## Ejemplo básico en Angular

Primero, crea un servicio que realice las conexiones http al back
```ts
@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient)

  getTodos(): Promise<Todo[]> {
    return lastValueFrom(
      this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos'),
    )
  }

  addTodo(todo: Todo): Promise<Todo> {
    return lastValueFrom(
      this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo),
    )
  }
}

interface Todo {
  id: string
  title: string
}
```

Luego, provee este cliente en tu módulo principal (_aplicaciones no standalone_):

```ts
import { provideHttpClient } from '@angular/common/http'
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental'

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideTanStackQuery(new QueryClient())],
})
```
> Nota: `QueryClient` es un objeto que alojará todas las respuestas de las peticiones (_las que se han resuelto, las que no, las que han vencido, las nuevas, ..._)

> **Importante**: Instalar las DevTools de TanStack [Link](https://tanstack.com/query/latest/docs/framework/angular/devtools) y añadir las extensioens la navegador, con esto debería verse un icono de TanStack
> ![alt text](tanstack-query-devtools.png)

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { withDevtools } from '@tanstack/angular-query-experimental/devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideTanStackQuery(new QueryClient(), withDevtools())
  ]
};
```

Usar useQuery en un componente Angular
```ts
import { Component, Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { lastValueFrom } from 'rxjs'

import {
  injectMutation,
  injectQuery,
  QueryClient
} from '@tanstack/angular-query-experimental'

@Component({
  template: `
    <div>
      <button (click)="onAddTodo()">Add Todo</button>

      <ul>
        @for (todo of query.data(); track todo.title) {
          <li>{{ todo.title }}</li>
        }
      </ul>
    </div>
  `,
})
export class TodosComponent {
  todoService = inject(TodoService)
  queryClient = inject(QueryClient)

  query = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: () => this.todoService.getTodos(),
  }))

  mutation = injectMutation(() => ({
    mutationFn: (todo: Todo) => this.todoService.addTodo(todo),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  }))

  onAddTodo() {
    this.mutation.mutate({
      id: Date.now().toString(),
      title: 'Do Laundry',
    })
  }
}
``

> Notas importantes
> * TanStack Query maneja caché, refetch automático y mutaciones igual que en React.
> * Puedes usar useMutation para crear, actualizar o eliminar datos en Angular.
> * Todo se integra muy bien con Angular RxJS Observables.

---

### 🔍 Herramientas de desarrollo

TanStack Query ofrece herramientas de desarrollo dedicadas que permiten inspeccionar y depurar las consultas y mutaciones en tiempo real, facilitando el proceso de desarrollo y resolución de problemas.

----

# Plus:  *Mutacioens* con TanStack Query en Anuglar

`TanStack Query` (anteriormente React Query) no solo sirve para **GET/fetch**, también se puede usar para **mutaciones** como `POST`, `PUT`, `PATCH` o `DELETE`.

En Angular, usarías `@tanstack/angular-query` (la versión oficial para Angular).

---

## 🔹 Cómo hacer un `POST` con TanStack Query (mutación)

### 1. Importar `Mutation` y `useMutation`

```ts
import { Injectable } from '@angular/core';
import { useMutation, QueryClient } from '@tanstack/angular-query';
import { HttpClient } from '@angular/common/http';
import { GitHubIssue } from '../interfaces/github-issue.interface';
```

---

### 2. Crear la función que hace el POST

```ts
@Injectable({ providedIn: 'root' })
export class IssuesService {
  constructor(private http: HttpClient, private queryClient: QueryClient) {}

  createIssue(issue: Partial<GitHubIssue>) {
    return this.http.post<GitHubIssue>(
      'https://api.github.com/repos/angular/angular/issues',
      issue,
      { headers: { Authorization: `Bearer YOUR_TOKEN` } }
    );
  }
}
```

---

### 3. Crear la mutación

En tu componente:

```ts
import { Component } from '@angular/core';
import { IssuesService } from './issues.service';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html'
})
export class CreateIssueComponent {
  constructor(private issuesService: IssuesService) {}

  createIssueMutation = useMutation({
    mutationFn: (newIssue: Partial<GitHubIssue>) => 
      this.issuesService.createIssue(newIssue).toPromise(),
    onSuccess: (data) => {
      console.log('✅ Issue creado:', data);
      // Aquí puedes invalidar queries para recargar la lista
      // queryClient.invalidateQueries(['issues']);
    },
    onError: (error) => {
      console.error('❌ Error creando el issue:', error);
    }
  });

  submit() {
    this.createIssueMutation.mutate({
      title: 'Nuevo issue desde Angular',
      body: 'Descripción del issue...'
    });
  }
}
```

---

### 🔹 Explicación

* `mutationFn` → función que realiza el POST (o cualquier mutación).
* `mutate()` → ejecuta la mutación con los datos que pases.
* `onSuccess` / `onError` → callbacks para manejar resultado o errores.
* Puedes **invalidar queries** (`queryClient.invalidateQueries`) para refrescar los datos automáticamente después de crear un issue.

---

💡 **Tip:** TanStack Query separa claramente **fetching de datos (queries)** de **mutaciones (POST/PUT/DELETE)**, lo que te permite mantener tu estado sincronizado y optimista de manera sencilla.


---

### 📚 Recursos adicionales

* [Documentación oficial de TanStack Query](https://tanstack.com/query)

* [Repositorio en GitHub](https://github.com/TanStack/query)

* [Paquete de npm para React](https://www.npmjs.com/package/@tanstack/react-query)

---

Si deseas profundizar más en TanStack Query, te recomiendo ver el siguiente video tutorial:

[TanStack Query: Una introducción sencilla](https://www.youtube.com/watch?v=w9r55wd2CAk&utm_source=chatgpt.com)

---

[1]: https://medium.com/%40ignatovich.dm/tanstack-query-a-powerful-tool-for-data-management-in-react-0c5ae6ef037c?utm_source=chatgpt.com "TanStack Query: A Powerful Tool for Data Management in ..."
[2]: https://tanstack.com/query/latest/docs/framework/angular/overview "TansTack Query - Guie Official"