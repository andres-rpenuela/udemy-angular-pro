import { Component, input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { GitHubIssue } from '../../interfaces/github-issue.interface';
import { MarkdownComponent } from "ngx-markdown";

@Component({
  selector: 'issue-comment',
  standalone: true,
  imports: [CommonModule, DatePipe, SlicePipe, MarkdownComponent],
  templateUrl: './issue-comment.component.html',
  styleUrls: ['./issue-comment.component.css']
})
export class IssueCommentComponent implements OnInit {
  public comment = input.required<GitHubIssue>();
  public bodyFull = input<boolean>(false);
  constructor() { }

  ngOnInit() {}

  cerrarModal($event: any) {
    console.log('Cerrando modal desde el componente hijo');
  }
}
