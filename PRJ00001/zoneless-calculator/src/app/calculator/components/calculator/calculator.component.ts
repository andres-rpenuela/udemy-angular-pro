import { Component, HostListener, OnInit, viewChildren } from '@angular/core';
import { CalculatorButtonComponent } from '@calculator/components/calculator-button/calculator-button.component';

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
  host: {
    //'class': 'rounded shadow p-4'
    '(document:keyup)': 'handleKeyboardEvent($event)',
  },
  imports: [CalculatorButtonComponent],
})
export class CalculatorComponent implements OnInit {
  public calculatorButtons = viewChildren(CalculatorButtonComponent);

  constructor() {}

  ngOnInit() {}

  public handleClick(value: string) {
    console.log('se ha puslado: ' + value);
  }

  // Evento global, alternativa de usar host
  //@HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    //console.log(event, event.key);
    this.handleClick(event.key);

    const keyEquivalents: Record<string, string> = {
      Espace: 'C',
      Clear: 'C',
      'c': 'C',
      '*': 'x',
      '%': '%',
      '/': '%',
      Enter: '=',
    };

    // Llama la función keyBoardPressedStyle() de todos los hijos que son CalculatorButtonComponent

    this.calculatorButtons().forEach((button) => {
      const key = keyEquivalents[event.key] ?? event.key;
      button.keyBoardPressedStyle(key);
    });
  }
}
