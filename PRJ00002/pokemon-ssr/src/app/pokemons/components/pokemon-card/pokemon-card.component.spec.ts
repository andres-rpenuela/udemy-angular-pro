import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCardComponent } from './pokemon-card.component';
import { provideRouter, RouterLink, RouterLinkWithHref } from '@angular/router';
import { SimplePokemon } from '@/pokemons/interfaces/simple-pokemon.interface';
import { By } from '@angular/platform-browser';
import { routes } from '@/app.routes';


describe('PokemonCardComponent', () => {
  let fixture: ComponentFixture<PokemonCardComponent>;
  let component: PokemonCardComponent;
  let compiled: HTMLElement;

  // Mock input del componente
  const mockPokemon: SimplePokemon = {
    id: '1',
    name: 'bulbasaur',
    // agrega los campos mínimos que tenga tu interfaz
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent],// , RouterLinkStubDirective], // <--- stub agregado, si es estandalone
      providers: [ provideRouter(routes) ], // ! esto registra Router + ActivatedRoute (REQUERIDO PARA USAR RouterLink)
      //declarations:[ RouterLinkStubDirective],  // <--- stub agregado, si no es estandalone
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;

    //fixture.componentRef.setInput('pokemon', { id: 1, name: 'pikachu' });
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges(); // ! detectamos cambios para que se renderice el input

    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(compiled.textContent).toContain('bulbasaur');
  });

  it('should render pokemon name', () => {
    // 👇 asignamos el input antes de detectar cambios
    fixture.componentRef.setInput('pokemon', { id: 1, name: 'pikachu' });
    fixture.detectChanges(); // ! detectamos cambios para que se renderice el input
    expect(compiled.textContent).toContain('pikachu');
  });

  /** tarea */
  it('should have the SimplePokemon signal inputValue',() =>{
      expect(component.pokemon).not.toBeNull;
      expect(component.pokemon().name).toBe(mockPokemon.name);

      fixture.componentRef.setInput('pokemon', { id: 1, name: 'pikachu' });
      fixture.detectChanges(); // ! detectamos cambios para que se renderice el input
      expect(component.pokemon().name).toBe('pikachu');
  });

  it('should render the pokemon name and image correctly',() =>{

    // poner . antes de cada clase si quieres encadenar clases.
    const pokemonElement =  compiled.querySelector('.font-bold.text-xl.mb-2.text-center.capitalize');

    expect(pokemonElement).not.toBeNull;
    expect(pokemonElement?.textContent?.toLowerCase() ).toBe(mockPokemon.name);

    //const imgElemnt = compiled.querySelector('img');
    // usando <img  data-testid="pokemon-img" ...
    //const img: HTMLImageElement  = compiled.querySelector('[data-testid="pokemon-img"]');
    const img: HTMLImageElement | null = compiled.querySelector('[data-testid="pokemon-img"]')!;
    expect(img).toBeDefined();
    expect(img).not.toBeNull();
    expect(img?.src).toBe(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${mockPokemon.id}.png`
    );
    expect(img?.alt).toBe(mockPokemon.name);

  });

  /**
   * Cuando Angular renderiza un componente con @Input() o directivas (como routerLink),
   * en el DOM de pruebas (cuando usas fixture.nativeElement) se ve un atributo auxiliar llamado ng-reflect-...
   */
  it('should have the proper ng-reflect-router-link',()=>{
     // usando el atributo de desarrollo
     //console.log( compiled.querySelectorAll('div'))
    // const divWithElemnt = compiled.querySelectorAll('div')[0];
    //  console.log( divWithElemnt )
    //  console.log( divWithElemnt?.attributes )
    //console.log( divWithElemnt?.attributes.getNamedItem('ng-reflect-router-link')?.value )

    //  expect(divWithElemnt).not.toBeNull();
    // expect(divWithElemnt?.getAttribute('ng-reflect-router-link'))
    //   .toBe(`/pokemons/${mockPokemon.id}`);

    // Opción recomdendada
    const debugEl = fixture.debugElement.query(By.directive(RouterLink));
    const routerLinkInstance = debugEl.injector.get(RouterLinkWithHref) as any;
    console.log(routerLinkInstance)

    expect(routerLinkInstance['routerLinkInput']).toEqual(['/pokemon', mockPokemon.name]);
  });


  afterEach( () =>{
    TestBed.resetTestingModule();
  })
});
