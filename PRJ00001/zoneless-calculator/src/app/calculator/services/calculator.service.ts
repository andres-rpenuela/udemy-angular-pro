import { Injectable, signal } from '@angular/core';

const numbers = Array.from({ length: 10 }, (_, i) => i + '');
const operators = ['+', '-', '*','x', '/', '÷'];
const specialOperatiors = ['C', '%', '.', '+/-', '=', 'Backspace'];

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  public resultText = signal<string>('-123.345');
  public subResultText = signal<string>('0');
  public lastOperator = signal<string>('+');

  // Flag para controlar si ya aplicamos % al valor actual
  private percentApplied = false;

  public constuctNumber(value: string): void {
    if (![...numbers, ...operators, ...specialOperatiors].includes(value)) {
      console.warn(`Invalid value: ${value}`);
      return;
    }

    console.log('CalculatorService, processing:', value);

    // =
    if (value === '=' || value === 'Enter' || value === '%' ) {
      console.log('Calculating result...');
      this.calulateResult(value);
      return;
    }

    // C
    if (value === 'C') {
      this.resultText.set('0');
      this.subResultText.set('0');
      this.lastOperator.set('+');
      this.percentApplied = false; // Resetea el flag de porcentaje
      return;
    }

    // Baskspace
    if (value === 'Backspace') {
      if (this.resultText().startsWith('-')) {
        // Si el texto empieza con '-', resta un carácter
        // Pero si solo quedan signo y un dígito (longitud ≤ 2), vuelve a '0'
        this.resultText.update((text) =>
          text.length > 2 ? text.slice(0, -1) : '0'
        );
      } else {
        // Para números positivos, elimina el último carácter
        // Pero si solo queda un dígito (longitud ≤ 1), vuelve a '0'
        this.resultText.update((text) =>
          text.length > 1 ? text.slice(0, -1) : '0'
        );
      }
      return;
    }

    // operadores
    if( operators.includes(value)) {
      this.lastOperator.set(value);
      this.subResultText.set(this.resultText());
      this.resultText.set('0');
      return;
    }

    // Limitar numeros a 10 dígitos
    if (this.resultText().length >= 10) {
      console.warn('Maximum number of digits reached (10).');
      return;
    }

    // punto decimal
    if (value === '.' && !this.resultText().includes('.') ) {
      if( this.resultText() === '0' || this.resultText() === '') {
        // Si el resultado es '0', lo reemplaza por '0.'
        this.resultText.set('0.');
      }else {
        this.resultText.update((text) => text + '.');
      }
      return;
    }

    // +/- (cambiar signo)
    if (value === '+/-') {
      if (this.resultText().startsWith('-')) {
        // Si el número es negativo, lo convierte a positivo
        this.resultText.set(this.resultText().slice(1));
      } else {
        // Si el número es positivo, lo convierte a negativo
        this.resultText.set('-' + this.resultText());
      }
      return;
    }

    // dígitos
    if (numbers.includes(value)) {
      if (this.resultText() === '0' || this.resultText() === '' || this.resultText() === '-0') {
        // Si el resultado es '0', lo reemplaza por el dígito
        if( this.resultText() === '-0') {
          // Si el resultado es '-0', lo reemplaza por el dígito con signo negativo
          this.resultText.set('-' + value);
        } else {
          this.resultText.set(value);
        }
      } else {
        // Si no es '0', concatena el dígito al final del número actual
        this.resultText.update((text) => text + value);
      }
      return;
    }
  }

  public calulateResult(value:string): void {
    const currentResult = parseFloat( this.resultText() ) ;
    const previousResult = parseFloat( this.subResultText() );
    const operator = this.lastOperator();

        console.log(`Calculating: ${previousResult} ${operator} ${currentResult}`);

    // Si es %, y no lo hemos aplicado ya, lo hacemos una sola vez
    if (value === '%' && currentResult !== 0 && !this.percentApplied) {
      console.log('Calculating percentage…');
      this.resultText.set((currentResult / 100).toString());
      this.subResultText.set('0');
      this.lastOperator.set('+');
      this.percentApplied = true;   // marcamos que ya aplicamos %
      return;
    }

    let result: number;
    console.log(`Calculating: ${previousResult} ${operator} ${currentResult}`);
    switch (operator) {
      case '+':
        result = previousResult + currentResult;
        break;
      case '-':
        result = previousResult - currentResult;
        break;
      case '*':
      case 'x':
        result = previousResult * currentResult;
        break;
      case '/':
      case '÷':
        if (currentResult === 0) {
          console.warn('Division by zero is not allowed.');
          return;
        }
        result = previousResult /currentResult;
        break;
      default:
        console.warn(`Unknown operator: ${operator}`);
        return;
    }

    // Actualiza el resultado y el subresultado
    this.resultText.set(result.toString());
    this.subResultText.set('0');
    this.lastOperator.set('+'); // Resetea el operador a '+'
  }
}
