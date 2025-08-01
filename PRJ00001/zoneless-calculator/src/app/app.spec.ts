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

});
