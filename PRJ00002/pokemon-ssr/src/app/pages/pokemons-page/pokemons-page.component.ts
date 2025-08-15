import { Component, OnInit } from '@angular/core';
import { PokemonListComponent } from "@/pokemons/components/pokemon-list/pokemon-list.component";

@Component({
  selector: 'pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.css'],
  imports: [PokemonListComponent]
})
export default class PokemonsPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
