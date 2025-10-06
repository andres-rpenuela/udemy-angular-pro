import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { getGitHubIssueByNumberAction } from './get-github-issue.action';
import { environment } from 'src/environments/environment.development';
import {  State } from '../interfaces/github-issue.interface';

const ISSUE_NUMBER = 123;
const BASE_URL = environment.GITHUB_ANGULAR_PATH_BASE;

const MOCK_ISSUE = {
  id: 1,
  number: ISSUE_NUMBER,
  title: "Issue title",
  body: "Issue body",
  state: State.Open,
  comments: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  labels: ['bug', 'enhancement']
};

describe('getGitHubIssueByNumberAction', () => {
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

  it('should return the correct issue data', (done) => {
    // Usar done callback en lugar de async/await
    getGitHubIssueByNumberAction(ISSUE_NUMBER, httpClient).then(result => {
      expect(result).toBeDefined();
      expect(result.number).toBe(ISSUE_NUMBER);
      expect(result.state).toBe(State.Open);
      done();
    }).catch(error => {
      done.fail(error);
    });

    // Interceptar la petición después de un pequeño delay
    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${ISSUE_NUMBER}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.GITHUB_TOKEN}`);
      req.flush(MOCK_ISSUE);
    }, 1600); // Después del sleep(1500)
  });

  it('should throw error for invalid issue number', (done) => {
    getGitHubIssueByNumberAction(0, httpClient).then(() => {
      done.fail('Should have thrown an error');
    }).catch(error => {
      expect(error.message).toBe('El número del issue debe ser un entero positivo.');
      done();
    });
  });

  it('should handle 404 errors gracefully', (done) => {
    getGitHubIssueByNumberAction(ISSUE_NUMBER, httpClient).then(() => {
      done.fail('Should have thrown an error');
    }).catch(error => {
      expect(error.message).toContain('Error al obtener el issue de GitHub:');
      expect(error.message).toContain('El issue no existe (404)');
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${ISSUE_NUMBER}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    }, 1600);
  });

  it('should handle other HTTP errors', (done) => {
    getGitHubIssueByNumberAction(ISSUE_NUMBER, httpClient).then(() => {
      done.fail('Should have thrown an error');
    }).catch(error => {
      expect(error.message).toContain('Error al obtener el issue de GitHub:');
      expect(error.message).toContain('Error HTTP personalizado:');
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${ISSUE_NUMBER}`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    }, 1600);
  });

  it('should handle null response data', (done) => {
    getGitHubIssueByNumberAction(ISSUE_NUMBER, httpClient).then(() => {
      done.fail('Should have thrown an error');
    }).catch(error => {
      expect(error.message).toContain('Error al obtener el issue de GitHub:');
      expect(error.message).toContain('El issue solicitado no existe o no se ha podido cargar.');
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${ISSUE_NUMBER}`);
      req.flush(null);
    }, 1600);
  });
});
