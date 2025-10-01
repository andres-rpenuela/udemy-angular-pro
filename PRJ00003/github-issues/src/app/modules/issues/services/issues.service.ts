import { inject, Injectable, Signal } from '@angular/core';
import { getGithubIssuesActions } from '../actions/get-github-issues.actions';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getGithubLabelsActions } from '../actions/get-github-labels.actions';
import { HttpClient } from '@angular/common/http';
import { getGitHubIssueByNumberAction } from '../actions/get-github-issue.action';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

constructor() { }

  private http = inject(HttpClient);

  public getAllIssues = injectQuery( () =>({
    queryKey: ['allIssues'], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
    queryFn: () => getGithubIssuesActions() // peticion http
  }));

  public getAllLabels = injectQuery( () =>({
    queryKey: ['allLabels'], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
    queryFn: () => getGithubLabelsActions() // peticion http
  }));

  // Se reicbe el numero como señal para que si cambia el número, se vuelva a ejecutar la consulta
  public getIssueByNumber = (issueNumber: Signal<number | null> ) => injectQuery(  () => ({
      queryKey:[`issue-${issueNumber()}`], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
      queryFn: () => {
        if( issueNumber() == null) throw new Error('issue number not found');
        return getGitHubIssueByNumberAction(issueNumber()!, this.http);
      },
      enabled: !!issueNumber // solo se ejecuta si issueNumber es truthy (no null, undefined, 0, etc.)
    })
  );
}
