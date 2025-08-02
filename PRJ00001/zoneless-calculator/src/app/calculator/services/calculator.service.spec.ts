/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('Service: Calculator', () => {

  let service: CalculatorService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      //providers: [CalculatorService]
    });

    service = TestBed.inject(CalculatorService);
  });

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

});
