import { HttpClient } from "@angular/common/http";
import { GitHubIssue } from "../interfaces/github-issue.interface";
import { sleep } from "@app/helpers/sleep.helper";
import { environment } from "src/environments/environment.development";
import { catchError, firstValueFrom, throwError } from "rxjs";

// https://api.github.com/repos/angular/angular/issues/3600/comments
export const getGitHubIssueCommentsByNumberAction = async (issueNumber: number, http: HttpClient) :Promise<GitHubIssue[]> => {
  if(!issueNumber || issueNumber <= 0)  throw new Error('El número del issue debe ser un entero positivo.');
  await sleep(1500); // delay de 1,5 s

  const url = `${environment.GITHUB_ANGULAR_PATH_BASE}/issues/${issueNumber}/comments`;

  try{
    const data = await firstValueFrom(
      http.get<GitHubIssue[]>(url, { headers: { Authorization: `Bearer ${environment.GITHUB_TOKEN}` } })
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

    if(!data) throw new Error('Los comentarios del issue solicitado no existen o no se han podido cargar.');

    console.log('✅ Comentarios del Issue cargados:', data);
    return data;

  }catch(error: any){
     console.error('Error original:', error);
     throw new Error(
       `Error al obtener los comentarios del issue de GitHub: ${error?.message ?? ''}`,
       { cause: error }
     );
  }
}
