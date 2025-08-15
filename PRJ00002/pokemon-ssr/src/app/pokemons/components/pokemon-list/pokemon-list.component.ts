import { Component, OnInit } from '@angular/core';
import { PokemonCardComponent } from "../pokemon-card/pokemon-card.component";

@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  imports: [PokemonCardComponent]
})
export class PokemonListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
