import { Component, inject, input, OnInit } from '@angular/core';
import { GitHubLabel } from '../../interfaces/github-label.interface';
import { convertBlackOrWhiteFromCodeHex } from '@app/helpers/color.helper';
import { IssuesService } from '../../services/issues.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'issues-labels-selector',
  templateUrl: './labels-selector.component.html',
  styleUrls: ['./labels-selector.component.css'],
  imports: [NgClass]
})
export class LabelsSelectorComponent implements OnInit {

  public labels = input.required<GitHubLabel[]>();

  public issuesService = inject(IssuesService);

  constructor() { }

  ngOnInit() {
  }

  public getTextColor(hex: string): string {
    return convertBlackOrWhiteFromCodeHex(hex);
  }

  public onClickLabel(labelName: string) {
    this.issuesService.toggleLabel(labelName);
  }

  public isLabelSelected(labelName: string): boolean {
    return this.issuesService.isLabelSelected(labelName);
  }
}
