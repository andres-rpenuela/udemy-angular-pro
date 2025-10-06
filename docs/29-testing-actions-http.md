# Testing de Funciones con Peticiones HTTP en Angular

## ¿Por qué usar `done` en lugar de `async/await`?

Cuando testeas funciones que hacen peticiones HTTP y tienen delays (como `sleep()`), el patrón `async/await` puede causar problemas de timing. El callback `done` te da más control sobre cuándo el test debe completarse.

### Problemas con async/await

```typescript
// ❌ PROBLEMÁTICO - puede causar timeouts
it('should work', async () => {
  const result = await functionWithDelay();
  // El test puede terminar antes de que HttpTestingController intercepte
  const req = httpMock.expectOne(url);
  req.flush(data);
});
```

### Solución con done callback

```typescript
// ✅ CORRECTO - control total del timing
it('should work', (done) => {
  functionWithDelay().then(result => {
    expect(result).toBeDefined();
    done(); // El test termina cuando nosotros decidimos
  }).catch(error => {
    done.fail(error); // Fallar el test si hay error
  });
  
  setTimeout(() => {
    const req = httpMock.expectOne(url);
    req.flush(data);
  }, 1600); // Después del delay de la función
});
```

## Estructura de Testing para Funciones HTTP

### Setup básico

```typescript
describe('HttpFunction', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verificar que no hay peticiones pendientes
  });
});
```

### Patrón para casos exitosos

```typescript
it('should return correct data', (done) => {
  const mockData = { id: 1, name: 'Test' };
  
  functionWithHttp(httpClient).then(result => {
    expect(result).toEqual(mockData);
    expect(result.id).toBe(1);
    done();
  }).catch(error => {
    done.fail(error);
  });

  setTimeout(() => {
    const req = httpMock.expectOne('https://api.example.com/data');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(mockData);
  }, 1600); // Ajustar según el delay de tu función
});
```

### Patrón para errores HTTP

```typescript
it('should handle HTTP errors', (done) => {
  functionWithHttp(httpClient).then(() => {
    done.fail('Should have thrown an error');
  }).catch(error => {
    expect(error.message).toContain('Expected error message');
    done();
  });

  setTimeout(() => {
    const req = httpMock.expectOne('https://api.example.com/data');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  }, 1600);
});
```

### Patrón para validación de entrada

```typescript
it('should validate input parameters', (done) => {
  functionWithValidation(0, httpClient).then(() => {
    done.fail('Should have thrown validation error');
  }).catch(error => {
    expect(error.message).toBe('Invalid parameter');
    done();
  });
  // No necesita setTimeout porque la validación es síncrona
});
```

## Casos de Uso Comunes

### 1. Función con delay y petición HTTP

```typescript
export const fetchWithDelay = async (id: number, http: HttpClient) => {
  if (id <= 0) throw new Error('Invalid ID');
  await sleep(1500);
  
  const data = await firstValueFrom(
    http.get(`/api/items/${id}`)
  );
  
  return data;
};

// Test
it('should fetch data after delay', (done) => {
  fetchWithDelay(123, httpClient).then(result => {
    expect(result.id).toBe(123);
    done();
  }).catch(done.fail);

  setTimeout(() => {
    const req = httpMock.expectOne('/api/items/123');
    req.flush({ id: 123, name: 'Item' });
  }, 1600);
});
```

### 2. Función con manejo de errores personalizado

```typescript
it('should transform HTTP errors', (done) => {
  fetchWithErrorHandling(123, httpClient).then(() => {
    done.fail('Should have thrown');
  }).catch(error => {
    expect(error.message).toContain('Custom error:');
    expect(error.message).toContain('Item not found');
    done();
  });

  setTimeout(() => {
    const req = httpMock.expectOne('/api/items/123');
    req.flush('Item not found', { status: 404, statusText: 'Not Found' });
  }, 1600);
});
```

### 3. Función con respuesta null/undefined

```typescript
it('should handle null responses', (done) => {
  fetchData(123, httpClient).then(() => {
    done.fail('Should have thrown for null data');
  }).catch(error => {
    expect(error.message).toContain('No data received');
    done();
  });

  setTimeout(() => {
    const req = httpMock.expectOne('/api/data/123');
    req.flush(null); // Simular respuesta null
  }, 1600);
});
```

## Ventajas del patrón `done`

1. **Control de timing**: Decides exactamente cuándo el test debe completarse
2. **Manejo de delays**: Funciona bien con funciones que tienen `sleep()` o delays
3. **Claridad**: Separación clara entre la ejecución y la verificación
4. **Compatibilidad**: Funciona consistentemente con HttpTestingController
5. **Debugging**: Más fácil debuggear problemas de timing

## Notas importantes

- **setTimeout delay**: Debe ser mayor al delay de tu función (ej: 1600ms > 1500ms)
- **Siempre usar `done.fail(error)`** en catch blocks
- **Verificar headers**: Comprobar Authorization, Content-Type, etc.
- **httpMock.verify()**: En afterEach para verificar que no hay peticiones pendientes
- **Mock data**: Crear objetos mock que coincidan con tu interfaz TypeScript