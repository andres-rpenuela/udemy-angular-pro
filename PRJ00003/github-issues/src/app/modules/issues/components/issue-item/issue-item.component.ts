import { Component, input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { GitHubIssue } from '../../interfaces/github-issue.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'issue-item',
  imports: [CommonModule, DatePipe, SlicePipe, RouterLink],
  templateUrl: './issue-item.component.html',
  styleUrls: ['./issue-item.component.css']
})
export class IssueItemComponent implements OnInit {
  public issue = input.required<GitHubIssue>();
  constructor() { }

  ngOnInit() {
  }

}
