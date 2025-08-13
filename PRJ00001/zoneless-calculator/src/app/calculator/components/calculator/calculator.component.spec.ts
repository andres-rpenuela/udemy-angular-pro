import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { CalculatorService } from '@/calculator/services/calculator.service';
import { MockCalculatorService } from '@/calculator/services/mock-calculator.service.spec';
import { inject } from '@angular/core';

// npx  ng test --code-coverage

describe('CalculatorComponent', () => {
  let fixture: ComponentFixture<CalculatorComponent>;
  let component: CalculatorComponent;
  let compiled: HTMLElement;

  let mockCalculatorService: MockCalculatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [ { provide: CalculatorService, useClass: MockCalculatorService}  ] // Se inyecta el MockCalculatorService
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    // injectaormos el servicio para dinamizar (opcional)
    mockCalculatorService = TestBed.inject(CalculatorService) as unknown as MockCalculatorService;

    // los cambios ya no se deben detectar aquí, porque otro en algun test se ingorará
    // <-- aquí ya se evaluaban los computed() con el valor inicial del mock
    // so provocaba que las computed() se inicializaran y se quedaran con el valor inicial ('100.00', '50.00', '+') antes de que el test pudiera cambiar el spy.
    //fixture.detectChanges(); // se requiere para se detecten los cambios iniciales, como la injección de dependencias

    // si descomenta se inicializa los computed(), y esto dará problemas
    // el problema esta, con printar o cargar `component`, que inicia el componnte y por tanto los mock con spias, no detecatrá los cambios
    //console.log('CalculatorComponent created: ', { component }, { compiled }); // evitar usar aqui `component` también si se usa mock con spias
    // esto no pasa nada, ya que no inicia el compoente
    console.log( compiled );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the current getters',() => {
    expect(component.resultText()).toBe('100.00');
    expect(component.subResultText()).toBe('20');
    expect(component.lastOperator()).toBe('-');
    console.log( component );
    expect(compiled.querySelector('span')?.innerText).toBe('20 -');
  })

  it('should display proper calcualtion values',() => {
    //     console.log( component ); // Dara problemlas, ya que inicia el computed(), y al ser un spy no detactará el cmaio.

    // como son spy, se peude cambiar el valor
    mockCalculatorService.resultText.and.returnValue('50.00');
    mockCalculatorService.subResultText.and.returnValue('123');
    mockCalculatorService.lastOperator.and.returnValue('*');
    // mockCalculatorService.setResultText('50.00');
    // mockCalculatorService.setSubResultText('123');
    // mockCalculatorService.setLastOperator('*');

    //console.log( component ); // aqui no pasa nada

    // Al comentar fixture.detectChanges() en el beforeEach y dejarlo solo en el test donde realmente haces los cambios
    // Ahora los computed() se evalúan después de cambiar los spies, por lo que ya devuelven el valor nuevo.
    fixture.detectChanges(); // se requeire que se detecte los cambios aqui

    //console.log('CalculatorComponent update: ', { component }, { compiled });
    console.log( compiled );
    //como solo hay un span
    console.log( compiled.querySelector('span'))
    expect(compiled.querySelector('span')?.innerHTML.valueOf()).toBe('123 *');
    expect(compiled.querySelector('span')?.innerText).toBe('123 *');

    expect(component.resultText()).toBe('50.00');
    expect(component.subResultText()).toBe('123');
    expect(component.lastOperator()).toBe('*');
  })
});
