import { Component, input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { GitHubIssue } from '../../interfaces/github-issue.interface';
import { RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { LabelsSelectorComponent } from "../labels-selector/labels-selector.component";

@Component({
  selector: 'issue-item',
  imports: [CommonModule, DatePipe, SlicePipe, RouterLink, MarkdownModule, LabelsSelectorComponent],
  templateUrl: './issue-item.component.html',
  styleUrls: ['./issue-item.component.css']
})
export class IssueItemComponent implements OnInit {
  public issue = input.required<GitHubIssue>();
  constructor() { }

  ngOnInit() {
  }

}
