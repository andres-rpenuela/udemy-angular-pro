import { Component, input, OnInit } from '@angular/core';
import { GitHubLabel } from '../../interfaces/github-label.interface';
import { convertBlackOrWhiteFromCodeHex } from '@app/helpers/color.helper';

@Component({
  selector: 'issues-labels-selector',
  templateUrl: './labels-selector.component.html',
  styleUrls: ['./labels-selector.component.css'],
})
export class LabelsSelectorComponent implements OnInit {

  public labels = input.required<GitHubLabel[]>();

  constructor() { }

  ngOnInit() {
  }

  public getTextColor(hex: string): string {
    return convertBlackOrWhiteFromCodeHex(hex);
  }
}
