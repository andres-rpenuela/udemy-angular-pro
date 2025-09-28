import { Component, inject, OnInit } from '@angular/core';
import { IssuesService } from '../../services/issues.service';

@Component({
  selector: 'app-issuses-list-page',
  templateUrl: './issuses-list-page.component.html',
  styleUrls: ['./issuses-list-page.component.css']
})
export default class IssusesListPageComponent implements OnInit {

  private issuesService = inject(IssuesService);

  constructor() { }

  ngOnInit() {
  }

  public getIssues(){
    return this.issuesService.getAllIssues;
  }

}
