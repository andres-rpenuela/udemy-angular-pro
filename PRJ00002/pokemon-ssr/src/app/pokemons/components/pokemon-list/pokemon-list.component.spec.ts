import { ComponentFixture, TestBed } from '@angular/core/testing';
import {PokemonListComponent} from './pokemon-list.component';
import { SimplePokemon } from '@/pokemons/interfaces/simple-pokemon.interface';
import { provideRouter } from '@angular/router';

let mockPokemon:SimplePokemon[] = [
  {id:'1',name:'Pikachu'},
  {id:'2',name:'Bulbasaur'}
];

describe('Pokemon ListC omponent', () => {

  let fixture: ComponentFixture<PokemonListComponent>;
  let component: PokemonListComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers:[ provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('shoud pokemons is empty then render div', ()=>{
    fixture.componentRef.setInput('pokemons',[]);
    fixture.detectChanges();

    expect(component.pokemons().length).toBe(0);

    const secondElementDiv = compiled.querySelectorAll('div')[1]!;
    //console.log('TEST')
    //console.log(secondElementDiv)
    expect(secondElementDiv!.textContent!.trim()).toEqual('No hay pokemons!')
  });

  it('shoud pokemons is not empty then render pokemon-card', ()=>{
    fixture.componentRef.setInput('pokemons',mockPokemon);
    fixture.detectChanges();
    //console.log('TEST')
    //console.log(component.pokemons());
    expect(component.pokemons().length).toBe( mockPokemon.length );

    const elemenPokemonCards = compiled.querySelectorAll('pokemon-card')!;
    //console.log('TEST')
    //console.log(elemenPokemonCards)
    expect(elemenPokemonCards.length).toEqual( mockPokemon.length );
  });

  afterEach( ()=>{
    TestBed.resetTestingModule();
  });

});
