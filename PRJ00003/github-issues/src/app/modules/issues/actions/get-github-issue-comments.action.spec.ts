import { HttpClient, provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment.development";
import { getGitHubIssueCommentsByNumberAction } from "./get-github-issue-comments.action";
import { GitHubIssue } from "../interfaces/github-issue.interface";

const BASE_URL = environment.GITHUB_ANGULAR_PATH_BASE;

describe('GetGithubIssueCommentsAction', () => {
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

  it('should fetch issue comments', (done) => {
    const issueNumber = 123;
    const mockComments = [
      { id: 1, body: "Comment 1" },
      { id: 2, body: "Comment 2" }
    ];

    // Invoke the action y evaluta
    getGitHubIssueCommentsByNumberAction(issueNumber, httpClient).then(comments => {
      expect(comments).toBeDefined();
      expect(comments.length).toBe(2);
      expect(comments).toEqual(mockComments as GitHubIssue[] );
      done();
    }).catch(error => {
      done.fail(error);
    });

    // Interceptar la petición después de un pequeño delay
    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${issueNumber}/comments`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${environment.GITHUB_TOKEN}`);
      req.flush(mockComments);
    },1600);
  });

  it('should handle no comments found', (done) => {
    const issueNumber = 123;
    const mockErrorMessage = 'Los comentarios del issue solicitado no existen o no se han podido cargar.';
    getGitHubIssueCommentsByNumberAction(issueNumber, httpClient).then(() => {
      done.fail('Expected method to reject.');
    }
    ).catch(error => {
      expect(error).toBeDefined();
      expect(error.message).toContain(mockErrorMessage);
      done();
    });
    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${issueNumber}/comments`);
      req.flush(null); // Simula una respuesta sin datos
    }, 1600);
  });

  it('should handle 404 error', (done) => {
    const issueNumber = 99999; // Asumimos que este issue no existe
    const mockErrorMessage = 'El issue no existe (404)';

    getGitHubIssueCommentsByNumberAction(issueNumber, httpClient).then(() => {
      done.fail('Expected method to reject.');
    }  ).catch(error => {
      expect(error).toBeDefined();
      expect(error.message).toContain(mockErrorMessage);
      done();
    });
    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${issueNumber}/comments`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    } ,1600);
  });

  it('should handle invalid issue number', (done) => {
    const invalidIssueNumber = -1;
    const mockErrorMessage = 'El número del issue debe ser un entero positivo.';
    getGitHubIssueCommentsByNumberAction(invalidIssueNumber, httpClient).then(() => {
      done.fail('Expected method to reject.');
    }).catch(error => {
      expect(error).toBeDefined();
      expect(error.message).toContain(mockErrorMessage);
      done();
    });

    setTimeout(() => {
      httpMock.expectNone(`${BASE_URL}/issues/${invalidIssueNumber}/comments`);
    }, 1600);
  });

  it('should handle network error', (done) => {
    const issueNumber = 123;
    const mockErrorMessage = 'Error HTTP personalizado';
    getGitHubIssueCommentsByNumberAction(issueNumber, httpClient).then(() => {
      done.fail('Expected method to reject.');
    }).catch(error => {
      expect(error).toBeDefined();
      expect(error.message).toContain(mockErrorMessage);
      done();
    });
    setTimeout(() => {
      const req = httpMock.expectOne(`${BASE_URL}/issues/${issueNumber}/comments`);
      const mockError = new ErrorEvent('Network error', {
        message: 'Simulated network error'
      });
      req.error(mockError);
    }, 1600);
  });

});
