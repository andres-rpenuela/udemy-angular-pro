import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SimplePokemon } from '@/pokemons/interfaces/simple-pokemon.interface';
import { Meta, Title } from '@angular/platform-browser';
import { Pokemon } from '@/pokemons/interfaces/pokemon.interface';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import PokemonPageComponent from './pokemon-page.component';
import { provideHttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { bulbasaurMock } from './mocks/pokemon.mock';


// 🔹 Subject que simula cambios de paramMap
  const paramMap$ = new BehaviorSubject(
    new Map([['id', 'bulbasaur']]) // valor inicial
  );

describe('PokemonPageComponent', () => {

  let fixture: ComponentFixture<PokemonPageComponent>;
  let component: PokemonPageComponent;
  let compiled: HTMLElement;
  let httpMock: HttpTestingController;

  beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [PokemonPageComponent,],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      Title,
      Meta,
      // Esto no levanta el router completo, solo le dices al TestBed “cuando alguien haga inject(ActivatedRoute), dale este objeto”.
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: paramMap$.asObservable(),
          snapshot: {
            paramMap: {
              get: (key: string) => paramMap$.value.get(key),
            },
          },
        },
      },
      // Esto es para comprobar la navegacion, crea un spy
      {
        provide: Router,
        useValue: jasmine.createSpyObj('Router', ['navigate']),
      },
    ]
  });

  fixture = TestBed.createComponent(PokemonPageComponent);
  component = fixture.componentInstance;
  httpMock = TestBed.inject(HttpTestingController);
});


  it('debería inicializar con defaultValue', () => {
    expect(component.pokemon.value()).toEqual({} as Pokemon);
  });


  it('debería leer el id inicial desde ActivatedRoute', () => {
    const activateRotuer = component['activateRotuer']; // si lo guardas en ctor
    expect(activateRotuer.snapshot.paramMap.get('id')).toBe('bulbasaur');
  });


  it('debería reaccionar cuando cambia el id en paramMap', fakeAsync(() => {
    // 1️⃣ Cambiar id simulado
    paramMap$.next( new Map([['id', 'bulbasaur']]) );
    fixture.detectChanges();

    // 2️⃣ Forzar reload
    component.pokemon.reload();

    // 3️⃣ Interceptar la request
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    expect(req.request.method).toBe('GET');
    req.flush(bulbasaurMock);

    // 4️⃣ Avanzar el ciclo de detección ()
    tick();
    fixture.detectChanges();

    // 5️⃣ Ahora el resource ya tiene el valor
    const value = component.pokemon.value();
    expect(value.id).toBe(1);
    expect(value.name).toBe('bulbasaur');
  }));

  it('debería navegar usando Router.navigate Sinc', () => {
    const router = TestBed.inject(Router);
    router.navigate(['/pokemons', 99]);

    expect(router.navigate).toHaveBeenCalledWith(['/pokemons', 99]);
    console.log(component.pokemon.value())
    expect(component.pokemon.value()).toEqual({} as Pokemon);
  });

  afterEach(() =>{
    // asegurar que no hay mas peticiones
    httpMock.verify();
    // restablecer las pruebas
    TestBed.resetTestingModule;
  })

});
