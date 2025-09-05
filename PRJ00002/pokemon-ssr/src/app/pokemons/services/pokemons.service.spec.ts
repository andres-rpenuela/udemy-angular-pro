import { TestBed } from '@angular/core/testing';
import { PokemonsService } from './pokemons.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SimplePokemon } from '../interfaces/simple-pokemon.interface';

const expectedSimplePokemons:SimplePokemon[] = [
  { id: '1', name: 'Pikachu' },
  { id: '2', name: 'Bulbasaur' }
];

const mockSimplePokemon: SimplePokemon = {
  id: '1',
  name: 'bulbasaur',
};

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(PokemonsService);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });
});
