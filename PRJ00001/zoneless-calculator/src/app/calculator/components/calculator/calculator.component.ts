import { CalculatorService } from '@/calculator/services/calculator.service';
import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  viewChildren,
} from '@angular/core';
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

  // servicio
  private calculatorService = inject(CalculatorService);

  // se recomiend usar una señal computed() para obtener el valor de las señales del servicio
  // de esta forma, se actualiza el valor de la señal cuando cambia el valor de las señales del servicio
  // como alternativa a los getters, que no se actualizan automáticamente
  //public get resultText(): string {
  //  return this.calculatorService.resultText();
  //}
  public resultText = computed( () => this.calculatorService.resultText() );
  public subResultText = computed( () => this.calculatorService.subResultText() );
  public lastOperator = computed( () => this.calculatorService.lastOperator() );


  public handleClick(value: string) {
    console.log('se ha puslado: ' + value);
    this.calculatorService.constuctNumber(value);
  }

  // Evento global, alternativa de usar host en la directiva @Componet
  //@HostListener('document:keyup', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) {
    //console.log(event, event.key);
    //this.handleClick(event.key);

    const keyEquivalents: Record<string, string> = {
      Espace: 'C',
      Clear: 'C',
      c: 'C',
      '*': 'x',
      '%': '%',
      '/': '/',
      Enter: '=',
      Basckspace: 'Backspace',
    };


    //console.log('handleKeyboardEvent, key up:',event.key);

    if( event.key === 'Backspace'){
      this.calculatorService.constuctNumber('Backspace');
      return;
    }

    // Llama la función keyBoardPressedStyle() de todos los hijos que son CalculatorButtonComponent
    // para ello `calculatorButtons`, es un viewChildren
    this.calculatorButtons().forEach((button) => {
      const key = keyEquivalents[event.key] ?? event.key;
      // este metodo se encarga de validar el key y emitrlo al prade si esta ok
      button.keyBoardPressedStyle(key);
    });
  }
}
