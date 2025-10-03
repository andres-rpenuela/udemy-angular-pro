import { Component, inject, input, OnInit, HostListener } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { GitHubIssue } from '../../interfaces/github-issue.interface';
import { RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { LabelsSelectorComponent } from "../labels-selector/labels-selector.component";
import { IssuesService } from '../../services/issues.service';

@Component({
  selector: 'issue-item',
  imports: [CommonModule, DatePipe, SlicePipe, RouterLink, MarkdownModule, LabelsSelectorComponent],
  templateUrl: './issue-item.component.html',
  styleUrls: ['./issue-item.component.css'],
  // Host listener para prefetch de datos
  host: { 'class': 'block hover:scale-[1.02] hover:shadow-xl active:scale-100 transition-transform' }
})
export class IssueItemComponent implements OnInit {
  public issue = input.required<GitHubIssue>();

  private issueService = inject(IssuesService);

  constructor() { }

  ngOnInit() {
  }


  // Prefetch al pasar el mouse por encima del host
  @HostListener('mouseenter') // Esto eliminala neceista de usar (mouseenter) en el HTML
  prefetchData() {
    // Hay dos opciones:

    // acciendo una peticion para precargar los datos del issue al pasar el mouse por encima
    //this.issueService.prefetchIssueByNumber(this.issue().number);

    // Actualiza la cache con los datos actuales del issue
    this.issueService.setIssueData(this.issue());
  }

}
