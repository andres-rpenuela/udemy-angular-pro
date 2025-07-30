import { Component, OnInit } from '@angular/core';
import { CalculatorComponent } from "@/calculator/components/calculator/calculator.component";

@Component({
  selector: 'app-calculator-layout',
  templateUrl: './calculator-layout.component.html',
  styles: '',
  imports: [CalculatorComponent]
})
export default class CalculatorLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
