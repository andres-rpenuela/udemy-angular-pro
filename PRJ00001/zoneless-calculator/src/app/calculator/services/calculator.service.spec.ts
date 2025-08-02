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


  // Test para el caso de que se pulse numeros
  it('should update resultText with number input', () => {

    service.constuctNumber('5');

    expect(service.resultText()).toBe('5');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

    service.constuctNumber('1');

    expect(service.resultText()).toBe('51');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  // Test para el caso de que se ,
  it('should update resultText with decimal input', () => {
    service.constuctNumber('5');
    service.constuctNumber('.');
    service.constuctNumber('3');

    expect(service.resultText()).toBe('5.3');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

    service.constuctNumber('.');
    service.constuctNumber('3');

     expect(service.resultText()).toBe('5.33');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  } );

  // Test para el caso de que se supera el límite de 10 dígitos
  it('should not allow more than 10 digits in resultText', () => {
    for (let i = 0; i < 10; i++) {
      service.constuctNumber('1');
    }
    expect(service.resultText()).toBe('1111111111');
    service.constuctNumber('2');
    expect(service.resultText()).toBe('1111111111'); // No debería cambiar
  });

  // Test para el operador +
  it('should set lastOperator to "+" and update subResultText when "+" is pressed', () => {
    service.constuctNumber('5');
    service.constuctNumber('+');

    expect(service.lastOperator()).toBe('+');
    expect(service.subResultText()).toBe('5');
    expect(service.resultText()).toBe('0');
  });

  // Test para la operacion de suma
  it('should calcule result correctly for addition', () => {
    service.constuctNumber('5');
    service.constuctNumber('+');
    service.constuctNumber('3');
    service.constuctNumber('=');

    expect(service.resultText()).toBe('8');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

    service.constuctNumber('+');
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('8');
    expect(service.lastOperator()).toBe('+');
  });


  // Test para la operacion de resta
  it('should calcule result correctly for subtraction', () => {
    service.constuctNumber('5');
    service.constuctNumber('-');
    service.constuctNumber('3');
    service.constuctNumber('=');

    expect(service.resultText()).toBe('2');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

  });

  // Test para la operacion de cambio de signo
  it('should  handle sing change correctly', () => {
    service.constuctNumber('5');
    service.constuctNumber('+/-');

    expect(service.resultText()).toBe('-5');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

    service.constuctNumber('+/-');

    expect(service.resultText()).toBe('5');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });


  // Test para verifica el Baskspace
  it('should handle Backspace correctly', () => {
    service.resultText.set('123');
    service.constuctNumber('Backspace');


    expect(service.resultText()).toBe('12');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

    service.constuctNumber('Backspace');


    expect(service.resultText()).toBe('1');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');

    service.constuctNumber('Backspace');


    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });
});
