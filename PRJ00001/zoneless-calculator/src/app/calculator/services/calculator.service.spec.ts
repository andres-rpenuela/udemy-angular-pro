/* tslint:disable:no-unused-variable */

/**
 * Comandos útiles:
 * npx ng test
 * nnpx ng test --code-coverage
 */

import { TestBed, inject } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('Service: Calculator', () => {

  let service: CalculatorService;
  // ciclo de vida de un text
  beforeEach(() => {

    TestBed.configureTestingModule({
      //providers: [CalculatorService]
    });

    service = TestBed.inject(CalculatorService);
  });

  beforeAll( () => {});
  afterEach( () => {});
  afterAll( () => {
    // Resetea el servicio después de todas las pruebas
    service.resultText.set('0');
    service.subResultText.set('0');
    service.lastOperator.set('+');
  });

  // pruebas unitarias
  // it('should ...', inject([CalculatorService], (service: CalculatorService) => {
  //   expect(service).toBeTruthy();
  // }));

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });


  it('should be created with default values', () => {
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should set resultText, subResultText, and lastOperator to "0" when C is pressed', () => {
    // A - Arrange
    service.resultText.set('123');
    service.subResultText.set('456');
    service.lastOperator.set('*');

    // A- Act
    service.constuctNumber('C');

    // A - Assert
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });
});
