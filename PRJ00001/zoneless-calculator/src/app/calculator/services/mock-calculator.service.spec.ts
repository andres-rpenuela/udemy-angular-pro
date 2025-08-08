export class MockCalculatorService{

  // atributos mockeados
  public resultText = jasmine.createSpy('resultText').and.returnValue('100.00');
  public subResultText = jasmine.createSpy('subResultText').and.returnValue('50.00');
  public lastOperator = jasmine.createSpy('lastOperator').and.returnValue('+');
  private percentApplied = false;

  // funciones mockeadas
  public constuctNumber = jasmine.createSpy('constuctNumber');
}
