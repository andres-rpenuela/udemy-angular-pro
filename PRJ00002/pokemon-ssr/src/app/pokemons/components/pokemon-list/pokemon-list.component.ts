import { Component, input, OnInit, output, signal } from '@angular/core';
import { PokemonCardComponent } from "../pokemon-card/pokemon-card.component";
import { PokemonListSkeletonComponent } from "./ui/pokemon-list-skeleton/pokemon-list-skeleton.component";
import { SimplePokemon } from '@/pokemons/interfaces/simple-pokemon.interface';

@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  imports: [PokemonCardComponent]
})
export class PokemonListComponent implements OnInit {

  public pokemons = input.required<SimplePokemon[]>();

  private loadedCount = 0;

  constructor() { }

  ngOnInit() {
  }
}
