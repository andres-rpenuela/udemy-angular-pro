import { HttpClient } from "@angular/common/http";
import { sleep } from "@app/commons/sleep.helper";
import { firstValueFrom } from "rxjs";
import { environment } from "src/environments/environment.development";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GitHubIssue } from "../interfaces/github-issue.interface";

// https://api.github.com/repos/angular/angular/issues/3600
export const getGitHubIssueByNumberAction = async (issueNumber: number, http: HttpClient) :Promise<GitHubIssue> => {
  if(!issueNumber || issueNumber <= 0)  throw new Error('El número del issue debe ser un entero positivo.');
  await sleep(1500); // dealy de 1,5 s

  const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/issues/${issueNumber}`;

  try{
    const data = await firstValueFrom(
      http.get<GitHubIssue>(url, { headers: { Authorization: `Bearer ${environment.GITHUB_TOKEN}` } })
        .pipe(
          catchError((error) => {
            // Aquí puedes transformar el error antes de que llegue al catch externo
            if (error.status === 404) {
              return throwError(() => new Error('El issue no existe (404)'));
            }
            return throwError(() => new Error('Error HTTP personalizado: ' + error.message));
          })
        )
    );

    // Esto es por si se reice un 200 pero con el cuerpo null o undefiend, se deja como "defensive code" pero es  poco probable que pase
    if(!data) throw new Error('El issue solicitado no existe o no se ha podido cargar.');

    console.log('✅ Issue cargado:', data);
    return data;

  }catch(error: any){
     console.error('Error original:', error);
     throw new Error(
       `Error al obtener el issue de GitHub: ${error?.message ?? ''}`,
       { cause: error }
     );;
  }
};
