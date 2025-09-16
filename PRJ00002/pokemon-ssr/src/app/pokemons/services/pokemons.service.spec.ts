import { TestBed } from '@angular/core/testing';
import { PokemonsService } from './pokemons.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SimplePokemon } from '../interfaces/simple-pokemon.interface';
import { PokeAPIResponse } from '../interfaces/pokemon-api.response';


const expectedSimplePokemons:SimplePokemon[] = [
  { id: '1', name: 'bulbasaur' },
  { id: '2', name: 'ivysaur' },
];

const mockResponse:PokeAPIResponse =
{
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20",
  "previous": '',
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    }
  ]
}

const mockSimplePokemon: SimplePokemon = {
  id: '1',
  name: 'bulbasaur',
};

describe('PokemonsService', () => {
  let service: PokemonsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(PokemonsService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() =>{
    // asegurar que no hay mas peticiones
    httpMock.verify();
    // restablecer las pruebas
    TestBed.resetTestingModule;
  })

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('loadPage(1) debería devolver la lista de pokemons', () => {
    service.loadPage(1).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedSimplePokemons);
    });

   const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0'); // 🔹 ajusta la URL a tu API real

    expect(req.request.method).toBe('GET');
    // se envia la informacion deseada, y dispara el observable
    req.flush(mockResponse);
  });

   it('loadPage(5) debería devolver la lista de pokemons', () => {
    service.loadPage(5).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedSimplePokemons);
    });

   const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/?limit=20&offset=80'); // 🔹 ajusta la URL a tu API real

    expect(req.request.method).toBe('GET');
    // se envia la informacion deseada, y dispara el observable
    req.flush(mockResponse);
  });

});
