import { Component, OnInit } from '@angular/core';
import { CalculatorButtonComponent } from "@calculator/components/calculator-button/calculator-button.component";

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styles: `
  /* alternaiva, para evitar el view-encapuslation de los componentes hijos */
  /*
    .is-command{
      @apply bg-indigo-700 bg-opacity-20;
    }
  */
  `,
  // añade al host element, la case, sin neceisada del añadir un div, es decir, en <calculator clas='ro...'></calculator>
  /*host:{
    'class': 'rounded shadow p-4'
  },*/
  imports: [ CalculatorButtonComponent]
})
export class CalculatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public handleClick(value: string){
    console.log("se ha puslado: "+value);
  }
}
