// npx ng test --code-coverage
// snipper: ng-component-test
import { ComponentFixture, TestBed } from '@angular/core/testing';
import CalculatorLayoutComponent from './calculator-layout.component';

describe('CalculatorLayoutComponent', () => {
  let fixture: ComponentFixture<CalculatorLayoutComponent>;
  let component: CalculatorLayoutComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorLayoutComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contian app-calculator component', () => {
    const calculatorElement = compiled.querySelector('calculator');
    expect(calculatorElement).toBeTruthy();
  });

  it('should contain basic css classes', () => {
    const expectedClasses = "w-screen mx-auto rounded-xl bg-gray-100 shadow-xl text-gray-800 relative overflow-hidden".replace(/\s+/g, ' ').split(' ');
    const classes = compiled.querySelector('div')?.classList.value.split(' ')

    expectedClasses.forEach(className =>{
      expect(classes).toContain(className);
    });
  });
});
