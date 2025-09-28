import { Injectable } from '@angular/core';
import { getGithubIssuesActions } from '../actions/get-github-issues.actions';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

constructor() { }

  public getAllIssues = injectQuery( () =>({
    queryKey: ['allIssues'], // identificador con el que se cachea, consiste en un arreglo que genera una llave unica
    queryFn: () => getGithubIssuesActions() // peticion http
  }));

}
