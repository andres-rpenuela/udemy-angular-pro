import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCardComponent } from './pokemon-card.component';
import { provideRouter } from '@angular/router';
import { SimplePokemon } from '@/pokemons/interfaces/simple-pokemon.interface';

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
      imports: [PokemonCardComponent],
      providers: [ provideRouter([]) ] // ! esto registra Router + ActivatedRoute (REQUERIDO PARA USAR RouterLink)
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
    expect(compiled.textContent).toContain('pikachu');
  });

  it('should render pokemon name', () => {
    // 👇 asignamos el input antes de detectar cambios
    fixture.componentRef.setInput('pokemon', { id: 1, name: 'bulbasaur' });
    fixture.detectChanges(); // ! detectamos cambios para que se renderice el input
    expect(compiled.textContent).toContain('bulbasaur');
  });
});
