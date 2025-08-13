import { signal } from "@angular/core";

export class MockCalculatorService{

  // atributos mockeados
  public resultText = jasmine.createSpy('resultText').and.returnValue('100.00');
  public subResultText = jasmine.createSpy('subResultText').and.returnValue('20');
  public lastOperator = jasmine.createSpy('lastOperator').and.returnValue('-');

  private percentApplied = false;

  // funciones mockeadas
  public constuctNumber = jasmine.createSpy('constuctNumber');

  // ALternaitva a usar spias
  //  Ahora computed() detecta los cambios automáticamente porque son señales reactivas, no solo spies.
  // private _resultText = signal('100.00');
  // private _subResultText = signal('20');
  // private _lastOperator = signal('-');

  // resultText = () => this._resultText();
  // subResultText = () => this._subResultText();
  // lastOperator = () => this._lastOperator();

  // setResultText(value: string) { this._resultText.set(value); }
  // setSubResultText(value: string) { this._subResultText.set(value); }
  // setLastOperator(value: string) { this._lastOperator.set(value); }
}
