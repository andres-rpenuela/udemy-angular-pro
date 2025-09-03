import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {

  // varaibles comunes para las pruebas
  let fixture: ComponentFixture<App>;
  let app: App;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        //provideZonelessChangeDetection(),
        provideRouter([]), // 👈 añade providers del router, unas rutas vacías
      ]
    }).compileComponents();

    // Crear el componente y obtener la instancia y el elemento compilado
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(App);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, pokemon-ssr');
  // });
  it('should render the navbar and rotuer-outlet', () => {
    // se crea el componente de la aplicación para acceder a sus propiedades y al DOM, de fora unica en este test
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any; // 👈 para acceder a la propiedad title (que es property) "engañar a TypeScript"
    const compiled = fixture.nativeElement as HTMLElement;

    fixture.detectChanges(); // disparar la detección de cambios para actualizar el DOM, sin esto e1 queda en blanco y no carga

    expect(app.title()).toEqual('pokemon-ssr');
    const el = compiled.querySelector(
      '.text-white.font-bold.text-3xl.mb-4.lg\\:mb-0.hover\\:text-orange-600.hover\\:cursor-pointer'
    );
    expect(el).not.toBeNull();
    expect(el?.classList.contains('font-bold')).toBeTrue();
    expect(el?.textContent).toContain('Pokemon-ssr');

    expect(compiled.querySelector('navbar')).toBeTruthy();

    expect(compiled.querySelector('router-outlet')).not.toBeNull();

    // debug
    //console.log(el?.textContent);
    //console.log(compiled);
  });


  afterEach(() => {
    // reinicializar el entorno de pruebas a su estado original, como si nunca se hubiera configurado ningún módulo
    // En Angular 12+ optimizó el aislamiento de pruebas, pero en recomendable para evitar fugas de estado o conflictos
    // sobre todo en Angular 15+ con las nuevas APIs de señales
     TestBed.resetTestingModule();
  });
});
