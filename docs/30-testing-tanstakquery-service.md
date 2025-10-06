# Testing de Servicios con TanStack Query en Angular

## Configuración del TestBed

Para testear servicios que usan TanStack Query, necesitas configurar correctamente los proveedores:

```typescript
import { TestBed } from '@angular/core/testing';
import { QueryClient } from '@tanstack/query-core';
import { provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('IssuesService', () => {
  let service: IssuesService;
  let queryClient: QueryClient;

  beforeEach(() => {
    // QueryClient configurado para tests
    const testQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Sin reintentos
          gcTime: 0, // Limpia caché inmediatamente
        },
        mutations: {
          retry: false,
        },
      },
    });

    TestBed.configureTestingModule({
      teardown: {
        destroyAfterEach: false
      },
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(testQueryClient),
        YourService
      ],
    });

    service = TestBed.inject(YourService);
    queryClient = TestBed.inject(QueryClient);
  });

  afterEach(() => {
    queryClient.clear(); // Limpiar caché
  });
});
```

## Testing de injectQuery

### 1. Verificar que la query existe y tiene las propiedades correctas

```typescript
it('debería tener getAllIssuesByStateAndLabels definido', () => {
  expect(service.getAllIssuesByStateAndLabels).toBeDefined();
  expect(typeof service.getAllIssuesByStateAndLabels).toBe('object');
});

it('debería tener las propiedades de query correctas', () => {
  const query = service.getAllIssuesByStateAndLabels;

  // Verificar que tiene las propiedades esperadas de una query
  expect(query.data).toBeDefined();
  expect(query.isLoading).toBeDefined();
  expect(query.error).toBeDefined();
  expect(query.refetch).toBeDefined();
  expect(typeof query.refetch).toBe('function');
});
```

### 2. Testing de reactividad con señales

```typescript
it('debería reaccionar a cambios de estado y labels', () => {
  // Configurar señales
  service.stateSelected.set(State.Open);
  service.toggleLabel('bug');

  const query = service.getAllIssuesByStateAndLabels;

  // Verificar que la query está habilitada con filtros
  expect(query.isEnabled()).toBeTruthy();
});

it('debería estar deshabilitada cuando no hay filtros', () => {
  // Resetear a estado que deshabilita la query
  service.stateSelected.set(null as any);
  service.labelsSelected.set([]);

  const query = service.getAllIssuesByStateAndLabels;

  // La query debería estar deshabilitada
  expect(query.isEnabled()).toBeFalsy();
});
```

### 3. Testing con peticiones HTTP reales (sin mocks)

```typescript
// Test para queries que cargan datos reales del API
it('debería cargar datos reales cuando se hace refetch', async () => {
  service.stateSelected.set(State.Open);
  service.toggleLabel('bug');

  const query = service.getAllIssuesByStateAndLabels;

  // Hacer refetch manual (petición real)
  const { data, error } = await query.refetch();

  expect(error).toBeNull();
  expect(data).toBeDefined();
  expect(Array.isArray(data)).toBeTruthy();

  if (data && data.length > 0) {
    const [issue] = data;
    expect(issue).toEqual(jasmine.objectContaining({
      id: jasmine.any(Number),
      number: jasmine.any(Number),
      title: jasmine.any(String),
      state: jasmine.any(String)
    }));
  }
});

// Test para queries que devuelven arrays de datos
it('debería cargar los labels', async () => {
  const { data } = await service.getAllLabels.refetch();

  expect(data).toBeDefined();
  expect(data!.length).toBeGreaterThan(0);
  expect(data?.length).toBe(30); // Verificar cantidad esperada

  const [label] = data!;

  expect(label).toEqual(jasmine.objectContaining({
    id: jasmine.any(Number),
    name: jasmine.any(String),
    color: jasmine.any(String)
  }));

  // Verificar tipos específicos
  expect(typeof label.name).toBe('string');
  expect(typeof label.color).toBe('string');
  expect(typeof label.id).toBe('number');
});
```

### 4. Testing con HttpTestingController (mocks) - no probado

```typescript
it('debería cargar datos con mock HTTP cuando se hace refetch', (done) => {
  const httpMock = TestBed.inject(HttpTestingController);

  service.stateSelected.set(State.Open);
  service.toggleLabel('bug');

  const mockIssues = [
    {
      id: 1,
      number: 123,
      title: 'Test Issue',
      state: State.Open,
      labels: ['bug']
    }
  ];

  const query = service.getAllIssuesByStateAndLabels;

  query.refetch().then(({ data, error }) => {
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data).toEqual(mockIssues);
    done();
  }).catch(error => {
    done.fail(error);
  });

  // Interceptar después de un pequeño delay
  setTimeout(() => {
    const req = httpMock.expectOne(request =>
      request.url.includes('/issues') && 
      request.url.includes('state=open') &&
      request.url.includes('labels=bug')
    );
    req.flush(mockIssues);
  }, 100);
});
```

## Patrones de Testing Adicionales

### 1. Testing de Señales

```typescript
it('debería tener señales inicializadas correctamente', () => {
  expect(service.labelsSelected).toBeDefined();
  expect(service.labelsSelected()).toEqual([]);
});

it('debería actualizar señales reactivamente', () => {
  service.toggleLabel('bug');
  
  expect(service.labelsSelected()).toContain('bug');
  expect(service.isLabelSelected('bug')).toBeTrue();
});
```

### 2. Testing de Prefetch con Spies

```typescript
it('debería hacer prefetch correctamente', () => {
  const issueNumber = 123;
  const prefetchSpy = spyOn(queryClient, 'prefetchQuery');

  service.prefetchIssueByNumber(issueNumber);

  expect(prefetchSpy).toHaveBeenCalledWith({
    queryKey: [`issue-${issueNumber}`],
    queryFn: jasmine.any(Function),
    staleTime: 1000 * 60 * 5
  });
});
```

### 3. Verificación de Argumentos Detallada

```typescript
it('debería usar parámetros correctos en prefetch', () => {
  const issueNumber = 42;
  const prefetchSpy = spyOn(queryClient, 'prefetchQuery')
    .and.returnValue(Promise.resolve());

  service.prefetchIssueByNumber(issueNumber);

  expect(prefetchSpy).toHaveBeenCalledTimes(1);
  
  // Obtener el primer argumento de la primera llamada
  const callArgs = prefetchSpy.calls.first().args[0];
  expect(callArgs.queryKey).toEqual([`issue-${issueNumber}`]);
  expect(typeof callArgs.queryFn).toBe('function');
  expect(callArgs.staleTime).toBe(300000);
});
```

### 4. Testing de Caché del QueryClient

```typescript
it('debería integrar con QueryClient correctamente', async () => {
  const issueNumber = 456;
  const mockData = {
    id: issueNumber,
    number: issueNumber,
    title: 'Test Issue',
    state: State.Open
  };

  // Simular datos en caché
  queryClient.setQueryData([`issue-${issueNumber}`], mockData);

  // Verificar que los datos están en caché
  const cachedData = queryClient.getQueryData([`issue-${issueNumber}`]);
  expect(cachedData).toEqual(mockData);
});
```

## Características específicas de injectQuery

### Diferencias con funciones normales

```typescript
// ❌ injectQuery NO es una función
// service.getAllIssuesByStateAndLabels() // Error!

// ✅ injectQuery es un objeto query con propiedades
const query = service.getAllIssuesByStateAndLabels;
const data = query.data();
const isLoading = query.isLoading();
const error = query.error();
```

### Propiedades disponibles en injectQuery

```typescript
const query = service.getAllIssuesByStateAndLabels;

// Datos y estados
expect(query.data).toBeDefined();        // Signal con los datos
expect(query.isLoading).toBeDefined();   // Signal boolean
expect(query.error).toBeDefined();       // Signal con error
expect(query.isError).toBeDefined();     // Signal boolean
expect(query.isSuccess).toBeDefined();   // Signal boolean
expect(query.isEnabled).toBeDefined();   // Signal boolean

// Métodos
expect(query.refetch).toBeDefined();     // Función para refrescar
expect(typeof query.refetch).toBe('function');
```

### Testing de estados específicos

```typescript
it('debería manejar estados de loading y error', async () => {
  const query = service.getAllIssuesByStateAndLabels;

  // Estado inicial
  expect(query.isLoading()).toBe(false);
  expect(query.error()).toBeNull();

  // Configurar para hacer petición
  service.stateSelected.set(State.Open);

  // Verificar que la query se puede refrescar
  expect(typeof query.refetch).toBe('function');
});
```

## Mejores Prácticas para injectQuery

1. **Verificar existencia y tipo**: Siempre confirma que es un objeto, no una función
2. **Testear reactividad**: Verifica que cambios en señales afecten la query
3. **Usar refetch() para tests**: Fuerza la ejecución manual de queries
4. **Combinar mocks y peticiones reales**: Mocks para tests unitarios, reales para integración
5. **Verificar propiedades de estado**: `isLoading`, `error`, `isEnabled`, etc.
6. **Testear casos edge**: Query deshabilitada, errores HTTP, datos vacíos

## Estructura de Test Recomendada para injectQuery

```typescript
describe('injectQuery Tests', () => {
  // Tests básicos (existencia, propiedades)
  
  // Tests de reactividad (cambios en señales)
  
  // Tests de comportamiento (enabled/disabled)
  
  // Tests con datos reales (refetch)
  
  // Tests con mocks HTTP (HttpTestingController)
  
  // Tests de casos edge (errores, datos null)
});
```