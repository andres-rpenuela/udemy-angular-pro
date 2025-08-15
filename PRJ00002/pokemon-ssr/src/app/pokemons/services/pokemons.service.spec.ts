/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PokemonsService } from './pokemons.service';

describe('Service: Pokemons', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonsService]
    });
  });

  it('should ...', inject([PokemonsService], (service: PokemonsService) => {
    expect(service).toBeTruthy();
  }));
});
