import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CalculatorButtonComponent } from "./calculator-button.component";

// npx ng test --code-coverage
describe('CalculatorButtonComponent', () => {
  // Referencias a la instancia del componente, su fixture (entorno de prueba) y el DOM renderizado
  let fixture: ComponentFixture<CalculatorButtonComponent>;
  let component: CalculatorButtonComponent;
  let compiled: HTMLElement;

  // Se ejecuta antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorButtonComponent] // Se importa el componente directamente (standalone)
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorButtonComponent); // Se crea el componente
    component = fixture.componentInstance; // Se accede a la instancia de clase del componente
    compiled = fixture.nativeElement as HTMLElement; // Se accede al DOM del componente

    fixture.detectChanges(); // Se dispara el ciclo de detección de cambios inicial
  });

  // Limpieza opcional al final de todas las pruebas
  afterAll(() => {
    fixture.componentRef.setInput('isDobuleSize', false); // Resetea la propiedad de entrada
    fixture.detectChanges();
  });

  // Prueba 1: Verifica que el componente se crea correctamente
  it('should create the component', () => {
    console.log('CalculatorButtonComponent created: ', { component }, { compiled });
    expect(component).toBeTruthy();
  });

  // Prueba 2: Verifica el comportamiento por defecto de la clase CSS
  it('should apply w-1/4 when doubleSize is false (default)', () => {
    const hostCssClass: string[] = compiled.classList.value.split(' ');

    expect(hostCssClass).toContain('w-1/4'); // Espera la clase por defecto
    expect(component.isDobuleSize()).toBeFalse();
  });

  // Prueba 3: Verifica que cambie a w-2/4 cuando se activa isDobuleSize
  it('should apply w-2/4 when isDobuleSize is true', () => {
    fixture.componentRef.setInput('isDobuleSize', true); // Se simula el cambio de entrada, @input
    fixture.detectChanges(); // Se actualiza el DOM

    const hostCssClass: string[] = compiled.classList.value.split(' ');

    expect(hostCssClass).toContain('w-2/4'); // Se espera clase de ancho doble
    expect(component.isDobuleSize() ).toBeTrue(); // Confirma que la propiedad fue activada
  });


  // Espias para verificar la emisión de eventos @output
  // Prueba 4: Verifica que se emite un valor al hacer clic
  it('should emit value on click when handleClick is called', () => {
    spyOn(component.onClick, 'emit'); // Espía al método emit del output, observa si se llama .emit

    component.emitValue() // Simula el clic

    expect(component.onClick.emit).toHaveBeenCalled(); // Verifica que se haya llamado al método emit
    expect(component.onClick.emit).toHaveBeenCalledWith(''); // Verifica que se emita un valor vacío
  });


  it('should set isPressed to trueand tehn false when keyboardPressStyle is called with a matching key', (done) => {
    spyOn(component.onClick, 'emit'); // Espía al método emit del output, observa si se llama .emit

    // simula
    component.contentValue()!.nativeElement.innerText = '1'; // Simula el contenido del botón
    component.keyBoardPressedStyle('1'); // Simula la pulsación de una tecla

    expect(component.isPressed()).toBeTrue();
    expect(component.onClick.emit).toHaveBeenCalledWith('1'); // Verifica que se emita un valor vacío
    expect(component.isPressed()).toBe(true); // Verifica que se emita un valor vacío

    // implica que se use "done" para esperar el timeout o se llame a la función "done"
    setTimeout(() => {
      expect(component.isPressed()).toBeFalse(); // Verifica que isPressed se restablezca a false después del timeout
      done(); // ✅ IMPORTANTE: Llamar done cuando la verificación termina
    }, 101); // Verifica que isPressed se restablezca a false después del timeout
  });


  it('should not set isPressed to true if not matching ', () => {
    spyOn(component.onClick, 'emit'); // Espía al método emit del output, observa si se llama .emit

    component.contentValue()!.nativeElement.innerText = '1'; // Simula el contenido del botón
    component.keyBoardPressedStyle('2'); // Simula la pulsación de una tecla diferente

    expect(component.isPressed()).toBeFalse(); // Verifica que isPressed no se active
    expect(component.onClick.emit).not.toHaveBeenCalled(); // Verifica que no se emita ningún valor

  });

});

// >npx  ng test --code-coverage

