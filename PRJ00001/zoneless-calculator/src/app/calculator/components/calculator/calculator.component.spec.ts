import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { CalculatorService } from '@/calculator/services/calculator.service';
import { MockCalculatorService } from '@/calculator/services/mock-calculator.service.spec';

// npx  ng test --code-coverage

describe('CalculatorComponent', () => {
  let fixture: ComponentFixture<CalculatorComponent>;
  let component: CalculatorComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [ CalculatorService, MockCalculatorService ] // Se inyecta el MockCalculatorService
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges(); // se requiere para se detecten los cambios iniciales, como la injección de dependencias
    console.log('CalculatorComponent created: ', { component }, { compiled });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the current getters',() => {
    expect(component.resultText()).toBe('100.00');
    expect(component.subResultText()).toBe('50.00');
    expect(component.lastOperator()).toBe('+');
  })

});
