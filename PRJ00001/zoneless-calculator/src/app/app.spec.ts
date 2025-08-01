import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {

  let fixture : ComponentFixture<App>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    compiled = fixture.nativeElement as HTMLElement;

  });

  it('should create the app', () => {
    // const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should be 2', () => {
    // A = Arrange
    const num1 = 1;
    const num2 = 2;

    // A = Act
    const result = num1 + num2;

    // A = Assert
    expect(result).toBe(3);
    // Uncomment the following lines to throw an error if the test fails
    // if( result !== 3 ) {
    //   throw new Error(`Expected 1 + 2 to be 3, but got ${result}`);
    // }
  });

  // comprueba que el título se renderiza correctamente, pero no se esta por eso fallara, se peude comprobar que tenga un rotuer-outlet por ejemplo
  // it('should render title', () => {
  //   //const fixture = TestBed.createComponent(App);
  //  // fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   console.log(compiled);

  //    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, zoneless-calculator');
  // });

  // comprobar router-outlet
  it('should have a router outlet', () => {
    // se extrae y carga de forma local
    // const fixture = TestBed.createComponent(App);
    // const compiled = fixture.nativeElement as HTMLElement;

    // expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  // coprobar el div que contega el rotuer-outlet (hace obsoleta la anterior)
  it('should render router-outlet wrapper with css classes', () => {

    const divElement = compiled.querySelector('div'); // obtiene el primer div
    // console.log(divElement);
    // console.log(divElement?.className);
    // console.log(divElement?.classList);

    const expectedClasses : string[] = 'min-w-screen min-h-screen bg-slate-600 flex items-center justify-center px-5 py-5'.split(' ');

    expect(divElement).not.toBeNull();
    // esto comprueba que el div tenga las clases esperadas estricamente en el orden esperado
    //expect(divElement?.classList.value).toBe(expectedClasses);
    // esto comprueba que el div tenga las clases esperadas sin importar el orden, pero si se añade falla
    // divElement?.classList.forEach((className) => {
    //   expect(expectedClasses).toContain(className);
    // });

    // si hay clases de mas en el div, no falla, minimo debe tener las definidas en expectedClasses
    const divClasses = divElement?.classList.value.split(' ');
    expectedClasses.forEach((className) => {
      // equivalee a expect( divElement?.classList.value ).toContain(className);
      expect( divClasses ).toContain(className);
    });

  });

  // comprobar que exita un link con el texto 'buy me a beer'
  it('should contain the \'buy me a beer\' link', () => {
    const divElements = compiled.querySelectorAll('div'); // obtiene todos primer div
    // console.log(divElements);
    const divElement = divElements[divElements.length-1]; // se coge el ultimo div renderizado en app.html, el que contiente un anchor bar
    console.log(divElement)

    const anchorElement = divElement?.querySelector('a')
    expect(divElement).not.toBeNull();
    expect( anchorElement ).not.toBeNull();
    expect( anchorElement?.title).toContain('Buy me a beer');
    // expect( anchorElement?.href).toBe('https://www.buymeacoffee.com/scottwindon');
    expect( anchorElement?.getAttribute('href')).toBe('https://www.buymeacoffee.com/scottwindon');

  });
});
