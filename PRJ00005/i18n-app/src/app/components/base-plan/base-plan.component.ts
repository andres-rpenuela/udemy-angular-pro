import { Component, OnInit } from '@angular/core';
import { LenguageSelectorComponent } from "../lenguage-selector/lenguage-selector.component";
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-base-plan',
  templateUrl: './base-plan.component.html',
  styleUrls: ['./base-plan.component.css'],
  imports: [LenguageSelectorComponent, TranslateModule, CurrencyPipe]
})
export default class BasePlanComponent implements OnInit {


  constructor() { }

  ngOnInit() {
  }

}
