import { TestBed } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { QueryClient } from '@tanstack/query-core';
import { injectQuery, provideTanStackQuery } from '@tanstack/angular-query-experimental';
import { IssuesService } from './issues.service';
import { State } from '../interfaces/github-issue.interface';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';

describe('IssuesService', () => {
  let service: IssuesService;
  let queryClient: QueryClient;

  beforeEach(() => {
    // Crear QueryClient para tests
    const testQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Desactivar reintentos en tests
          gcTime: 0, // Limpiar caché inmediatamente
        },
        mutations: {
          retry: false,
        },
      },
    });

    TestBed.configureTestingModule({
      teardown: {
        destroyAfterEach: false // Para reutilizar instancia
      },
      providers: [
        // Agregar proveedores de HttpClient
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTanStackQuery(testQueryClient),
        IssuesService
      ],
    });

    service = TestBed.inject(IssuesService);
    queryClient = TestBed.inject(QueryClient);
  });

  afterEach(() => {
    // Limpiar caché después de cada test
    queryClient.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería tener labelsSelected como señal vacía inicialmente', () => {
    expect(service.labelsSelected).toBeDefined();
    expect(service.labelsSelected()).toEqual([]);
  });

  it('debería agregar un label cuando no está seleccionado', () => {
    const labelName = 'bug';

    service.toggleLabel(labelName);

    expect(service.labelsSelected()).toContain(labelName);
    expect(service.isLabelSelected(labelName)).toBeTrue();
  });

  it('debería remover un label cuando ya está seleccionado', () => {
    const labelName = 'enhancement';

    // Agregar primero
    service.toggleLabel(labelName);
    expect(service.labelsSelected()).toContain(labelName);

    // Remover
    service.toggleLabel(labelName);
    expect(service.labelsSelected()).not.toContain(labelName);
    expect(service.isLabelSelected(labelName)).toBeFalse();
  });

  it('debería manejar múltiples labels', () => {
    const labels = ['bug', 'enhancement', 'documentation'];

    // Agregar todos los labels
    labels.forEach(label => service.toggleLabel(label));

    // Verificar que todos están seleccionados
    labels.forEach(label => {
      expect(service.isLabelSelected(label)).toBeTrue();
    });

    expect(service.labelsSelected()).toEqual(jasmine.arrayContaining(labels));
  });

  it('debería hacer prefetch de un issue por número', () => {
    const issueNumber = 123;
    const prefetchSpy = spyOn(queryClient, 'prefetchQuery');

    service.prefetchIssueByNumber(issueNumber);

    expect(prefetchSpy).toHaveBeenCalledWith({
      queryKey: [`issue-${issueNumber}`],//['issue', issueNumber],
      queryFn: jasmine.any(Function),
      staleTime: 1000 * 60 * 5
    });
  });

  it('debería usar señales correctamente en prefetchIssueByNumber', () => {
    const issueNumber = 42;
    const prefetchSpy = spyOn(queryClient, 'prefetchQuery').and.returnValue(Promise.resolve());

    service.prefetchIssueByNumber(issueNumber);

    // obtiene el primer argumento de la primera llamada al spy prefetchQuery.
    expect(prefetchSpy).toHaveBeenCalledTimes(1);

    // prefetchSpy.calls.first().args[0];
    const callArgs = prefetchSpy.calls.first().args[0];
    expect(callArgs.queryKey).toEqual([`issue-${issueNumber}`]);//['issue', issueNumber]);
    expect(typeof callArgs.queryFn).toBe('function');
  });

  it('debería integrar con QueryClient correctamente', async () => {
    const issueNumber = 456;
    const mockIssueData = {
      id: issueNumber,
      number: issueNumber,
      title: 'Test Issue',
      state: State.Open
    };

    // Simular datos en caché
    queryClient.setQueryData([`issue-${issueNumber}`], mockIssueData);

    // Verificar que los datos están en caché
    const cachedData = queryClient.getQueryData([`issue-${issueNumber}`]);
    expect(cachedData).toEqual(mockIssueData);
  });

  it('debería manejar el estado de labels de forma reactiva', () => {
    const initialLabels = service.labelsSelected();
    expect(initialLabels).toEqual([]);

    // Simular cambios reactivos
    service.toggleLabel('priority-high');
    service.toggleLabel('needs-review');

    const updatedLabels = service.labelsSelected();
    expect(updatedLabels).toContain('priority-high');
    expect(updatedLabels).toContain('needs-review');
    expect(updatedLabels.length).toBe(2);
  });


  // Como realizar un test de tanstack query sin usar tanstak testing module (sin mock)
  it('deberia cargar los labels', async () => {
    const { data } = await service.getAllLabels.refetch(); // fuerza la recarga de datos (hace dos peticiones http)

    expect(data).toBeDefined();
    expect(data!.length).toBeGreaterThan(0); // espera que haya al menos una etiqueta
    expect(data?.length).toBe(30);

    const [label] = data!;

    expect(label).toEqual(jasmine.objectContaining({
      id: jasmine.any(Number),
      name: jasmine.any(String),
      color: jasmine.any(String)
    }))

    expect(typeof label.name).toBe('string');
    expect(typeof label.color).toBe('string');
    expect(typeof label.id).toBe('number');

  });

  // testing de tanstack query con signals
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

  it('debería reaccionar a cambios de estado y labels', () => {
    // Para que esté deshabilitada, necesitas un estado falsy Y sin labels
    service.stateSelected.set(State.All);
    service.labelsSelected.set([]);

    const query = service.getAllIssuesByStateAndLabels;

    // Verificar que la query está habilitada
    expect(query.isEnabled()).toBeTruthy();
  });

  it('debería estar deshabilitada cuando no hay filtros', () => {
    // Resetear a estado inicial

    service.stateSelected.set(null as any); // o undefined, dependiendo de tu implementación
    service.labelsSelected.set([]);

    const query = service.getAllIssuesByStateAndLabels;

    // La query debería estar deshabilitada
    expect(query.isEnabled()).toBeFalsy();
  });


  it('debería cargar datos cuando se hace refetch', async () => {
    service.stateSelected.set(State.Open);
    service.toggleLabel('bug');

    const query = service.getAllIssuesByStateAndLabels;

    // Hacer refetch manual
    const { data, error } = await query.refetch();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTruthy();
  });

  // Test con peticiones reales (sin mock)
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

});
