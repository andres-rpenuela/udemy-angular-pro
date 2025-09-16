import { Component, CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

describe('App', () => {

  // varaibles comunes para las pruebas
  let fixture: ComponentFixture<App>;
  let app: App;
  let compiled: HTMLElement;

  // Componente mock para NavbarComponent
  // se puede crear fuera del test
  @Component({
    selector: 'navbar',
    template: '<div>Mock Navbar</div>'
  })
  class MockNavbarComponent {}


  // test setup
  beforeEach(async () => {
    // ! NO RECOMENDADO ya que no carga las depednecias que no se especifican
    // TestBed.overrideComponent(App, {
    //   set: {
    //     imports: [MockNavbarComponent] // 👈 añade el componente mock, EL RESTO DE IMPORTOS DEL COMPONETE APP NO SE CARGAN
    //     ,schemas: [CUSTOM_ELEMENTS_SCHEMA] // 👈 Que los elementos que no se carge no hacer nada como router-outlet
    //   }
    //  });
    // ! Reomomendado para cargar los mock
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        //provideZonelessChangeDetection(),
        provideRouter([]), // 👈 añade providers del router, unas rutas vacías
      ]
    })
    .overrideComponent(App,{
      add: {
        imports: [MockNavbarComponent]
      }, // 👈 añade el componente mock
      remove: {
        imports: [NavbarComponent] // 👈 elimina el componente real
      }
    })
    .compileComponents();

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

    expect(compiled.querySelector('navbar')).toBeTruthy()
    const navbar = compiled.querySelector('navbar') as HTMLElement;
    expect(navbar.querySelector('div')?.textContent).toContain('Mock Navbar');

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
