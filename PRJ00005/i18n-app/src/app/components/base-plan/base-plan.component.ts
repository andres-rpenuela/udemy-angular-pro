import { Component, OnInit } from '@angular/core';
import { LenguageSelectorComponent } from "../lenguage-selector/lenguage-selector.component";

@Component({
  selector: 'app-base-plan',
  templateUrl: './base-plan.component.html',
  styleUrls: ['./base-plan.component.css'],
  imports: [LenguageSelectorComponent]
})
export default class BasePlanComponent implements OnInit {


  constructor() { }

  ngOnInit() {
  }

}
