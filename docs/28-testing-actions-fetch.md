# Testing con Mock de Fetch en Angular

## Configuración básica

Para testear peticiones HTTP usando `fetch` en Angular, necesitas crear mocks que simulen las respuestas del servidor.

### Setup del test

```typescript
import { environment } from "src/environments/environment.development";
import { State } from "../interfaces/github-issue.interface";
import { getGithubIssuesActionsByStateAndLables } from "./get-github-issues-filters";

const BASE_URL = environment.GITHUB_ANGULAR_PATH_BASE;
const MOCK_ISSUE = {
  id: 1,
  number: 123,
  title: "Issue title",
  body: "Issue body",
  state: State.Open,
  comments: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  labels: ['bug', 'enhancement']
};

describe('getGithubIssuesActionsByStateAndLabels', () => {
  // Setup opcional global
  beforeEach(() => {
    // Limpiar spies si es necesario
  });
});
```

## Mock exitoso (200)

```typescript
it('should return the correct action type', async () => {
  const state = State.Open;
  const labels = ['bug', 'enhancement'];

  // Crear respuesta mock exitosa
  const issueResponse = new Response(
    JSON.stringify([MOCK_ISSUE]),
    { status: 200, statusText: 'OK' }
  );

  // Espiar fetch y mockear la respuesta
  spyOn(window, 'fetch').and.resolveTo(issueResponse);

  // Ejecutar la función
  const action = await getGithubIssuesActionsByStateAndLables(state, labels);

  // Verificar que fetch fue llamado correctamente
  expect(fetch).toHaveBeenCalledWith(
    `${BASE_URL}/issues?state=${state}&labels=${labels.join('%2C')}`,
    jasmine.objectContaining({
      headers: jasmine.objectContaining({
        Authorization: `Bearer ${environment.GITHUB_TOKEN}`
      })
    })
  );

  // Verificar el resultado
  expect(action).toBeDefined();
  expect(Array.isArray(action)).toBeTrue();
  expect(action.length).toBe(1);
  expect(action[0].number).toBe(123);
  expect(action[0].state).toBe(State.Open);
});
```

## Mock de error (500)

```typescript
it('should throw error when request fails', async () => {
  const state = State.Open;
  const labels = ['bug', 'enhancement'];

  // Crear respuesta mock de error
  const issueResponse = new Response(
    JSON.stringify(null),
    { status: 500, statusText: 'Internal Server Error' }
  );

  spyOn(window, 'fetch').and.resolveTo(issueResponse);

  // Opción 1: Verificar que se rechaza la promesa
  await expectAsync(getGithubIssuesActionsByStateAndLables(state, labels))
    .toBeRejected();

  // Opción 2: Verificar mensaje específico del error
  await expectAsync(getGithubIssuesActionsByStateAndLables(state, labels))
    .toBeRejectedWithError('Error al obtener los issues de GitHub: Internal Server Error');

  // Opción 3: Try/catch para verificar el error
  try {
    await getGithubIssuesActionsByStateAndLables(state, labels);
    fail('Should have thrown an error');
  } catch (error) {
    expect(error).toBeDefined();
    expect((error as any).message).toContain('Internal Server Error');
  }
});
```

## Patrones de testing

### 1. Verificar llamadas a fetch
```typescript
expect(fetch).toHaveBeenCalledTimes(1);
expect(fetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
```

### 2. Mock de respuestas
```typescript
// Respuesta exitosa
const successResponse = new Response(JSON.stringify(data), {
  status: 200,
  statusText: 'OK'
});

// Respuesta de error
const errorResponse = new Response(null, {
  status: 404,
  statusText: 'Not Found'
});
```

### 3. Verificar errores async
```typescript
// Con expectAsync (recomendado)
await expectAsync(asyncFunction()).toBeRejected();
await expectAsync(asyncFunction()).toBeRejectedWithError('mensaje');

// Con try/catch
try {
  await asyncFunction();
  fail('Should have thrown');
} catch (error) {
  expect(error.message).toContain('expected message');
}
```

### 4. Matchers útiles para objetos
```typescript
// Verificar que un objeto contiene propiedades específicas
expect(fetch).toHaveBeenCalledWith(
  jasmine.any(String),
  jasmine.objectContaining({
    method: 'GET',
    headers: jasmine.objectContaining({
      'Authorization': jasmine.any(String)
    })
  })
);
```

## Notas importantes

- Usa `spyOn(window, 'fetch')` para mockear fetch global
- `new Response()` para crear respuestas HTTP simuladas
- `expectAsync()` para promesas que deberían fallar
- `jasmine.objectContaining()` para verificar propiedades parciales
- Siempre verifica que fetch fue llamado con los parámetros correctos