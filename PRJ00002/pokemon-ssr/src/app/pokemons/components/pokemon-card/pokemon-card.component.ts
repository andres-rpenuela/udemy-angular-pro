import { SimplePokemon } from '@/pokemons/interfaces/simple-pokemon.interface';
import { AfterViewInit, Component, ElementRef, input, OnInit, output, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css'],
  imports: [RouterLink]
})
export class PokemonCardComponent implements OnInit{
  public pokemon = input.required<SimplePokemon>();

  public img = viewChild.required<ElementRef<HTMLImageElement>>('pokemonImg');

  constructor() { }

  ngOnInit() {
  }

}
