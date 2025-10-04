import { inject, Injectable, runInInjectionContext, signal, Signal } from '@angular/core';
import { getGithubIssuesActions, getGithubIssuesActionsByState } from '../actions/get-github-issues.actions';
import { injectQuery, injectQueryClient, QueryClient } from '@tanstack/angular-query-experimental';
import { getGithubLabelsActions } from '../actions/get-github-labels.actions';
import { HttpClient } from '@angular/common/http';
import { getGitHubIssueByNumberAction } from '../actions/get-github-issue.action';
import { getGitHubIssueCommentsByNumberAction } from '../actions/get-github-issue-comments.action';
import { GitHubIssue, State } from '../interfaces/github-issue.interface';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  // tanstack query client
  private queryClient = inject(QueryClient);

  constructor() { }

  private http = inject(HttpClient);

  // Descomentar si se queire usar
  // public getAllIssues = injectQuery( () =>({
  //   queryKey: ['allIssues'], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
  //   queryFn: () => getGithubIssuesActions() // peticion http
  // }));

  // ERROR Error: NG0203: injectQuery() can only be used within an injection context such as a constructor, a factory function, a field initializer, or a function used with runInInjectionContext. Find more at https://angular.dev/errors/NG0203.
  // public getAllIssuesByState = (state: Signal<State>) => injectQuery( () =>({
  //   queryKey: ['allIssues', state()], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
  //   queryFn: () => getGithubIssuesActionsByState(state()), // peticion http
  //   enabled: !!state() // solo se ejecuta si state es truthy (no null, undefined, 0, etc.)
  // }));
  public stateSelected = signal<State>(State.All);

  public getAllIssuesByState = injectQuery(() => ({
    queryKey: ['allIssues', this.stateSelected()],
    queryFn: () => getGithubIssuesActionsByState(this.stateSelected()),
    enabled: !!this.stateSelected(),
    staleTime: 1000 * 60 * 5 // 5 minutos, tiempo que dura en estar "fresco" el query
  }));

  //   Solucion Usa field initializer o runInInjectionContext para mantener el contexto de inyección.

  // EUsa un factory o helper que reciba la señal y ejecute el query dentro de un contexto de inyección, por ejemplo usando runInInjectionContext:
  // public getAllIssuesByState = (state: Signal<State>) =>
  //   runInInjectionContextt(inject(IssuesService), () =>
  //     injectQuery(() => ({
  //       queryKey: ['allIssues', state()],
  //       queryFn: () => getGithubIssuesActionsByState(state()),
  //       enabled: !!state()
  //     }))
  //   );

  /** Obtiene todas las etiquetas */
  public getAllLabels = injectQuery( () =>({
    queryKey: ['allLabels'], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
    queryFn: () => getGithubLabelsActions() // peticion http
  }));

  /** Obtiene un issue por su número */
  // Se recibe el numero como señal para que si cambia el número, se vuelva a ejecutar la consulta
  public getIssueByNumber = (issueNumber: Signal<number | null> ) => injectQuery(  () => ({
      queryKey:[`issue-${issueNumber()}`], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
      queryFn: () => {
        //throw new Error('issue by number not found'); // Para simular un error
        if( issueNumber() == null) throw new Error('issue by number not found');
        return getGitHubIssueByNumberAction(issueNumber()!, this.http);
      },
      enabled: !!issueNumber, // solo se ejecuta si issueNumber es truthy (no null, undefined, 0, etc.)
      staleTime: 1000 * 60 * 5 // 5 minutos, tiempo que dura en estar "fresco" el query
    })
  );


  public getIssueCommentsByNumber = (issueNumber: Signal<number | null> ) =>  injectQuery(  () => ({
      queryKey:[`issue-${issueNumber()}`,'comments'], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
      queryFn: () => {
        // throw new Error('issue comments by issue number not found'); // Para simular un error
        if( issueNumber() == null) throw new Error('issue comments by number not found');
        return getGitHubIssueCommentsByNumberAction(issueNumber()!, this.http);
      },
      enabled: !!issueNumber // solo se ejecuta si issueNumber es truthy (no null, undefined, 0, etc.)
    })
  )
  // Método para invalidar la cache de un query en específico
  public prefetchIssueByNumber(issueNumber: number) {
    // Convertir el número a una señal
    const issueNumberSignal = signal(issueNumber);
    // Usa this.queryClient.prefetchQuery en lugar de injectQuery
    this.queryClient.prefetchQuery({
      queryKey: [`issue-${issueNumberSignal()}`], // mismo queryKey que en getIssueByNumber
      queryFn: () => getGitHubIssueByNumberAction(issueNumberSignal(), this.http),
      staleTime: 1000 * 60 * 5 // 5 minutos, tiempo que dura en estar "fresco" el query
    });

  }

  // ideal para acutlaizar los datos, evita hacer una petición http si los datos están frescos
  public setIssueData(issue:GitHubIssue) {

    const issueNumberSignal = signal(issue.number);

    this.queryClient.setQueryData(
      [`issue-${ issueNumberSignal() }`],
      issue,
      // en lugar de staleTime, se puede usar updatedAt para forzar que los datos estén "viejos" o nuevos y se actualicen en el background
     { updatedAt: Date.now() + 1000 * 60 } // Hace que los datos tengan 1 minuto de validez, para que no estén "frescos" y se actualicen en el background
    );
  }


}
