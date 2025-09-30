import { Component, input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { GitHubIssue } from '../../interfaces/github-issue.interface';

@Component({
  selector: 'issue-comment',
  standalone: true,
  imports: [CommonModule, DatePipe, SlicePipe],
  templateUrl: './issue-comment.component.html',
  styleUrls: ['./issue-comment.component.css']
})
export class IssueCommentComponent implements OnInit {
  public comment = input.required<GitHubIssue>();

  constructor() { }

  ngOnInit() {}
}
