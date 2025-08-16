import { Pokemon } from '@/pokemons/interfaces/pokemon.interface';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

@Component({
  selector: 'pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.css'],
  imports: [NgClass, NgIf, NgFor]
})
export default class PokemonPageComponent implements OnInit {

  // public pokemon = signal<Pokemon | null>(null);
  private id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  private readonly RESOURCE_URL = "https://pokeapi.co/api/v2/pokemon/";

  // ejemplo de rxResource, en lugar de usarlo en el servicio
  public pokemon = rxResource<Pokemon, { id: string | null }>({
    params: () => ({ id: this.id }),   // ✅ antes era "request"
    stream: ({ params }) =>            // ✅ recibe { params, abortSignal }
      fromFetch(`${this.RESOURCE_URL}${params.id}`).pipe(
        delay(1000),
        switchMap(res => res.json() as Promise<Pokemon>)
      ),
    defaultValue: {} as Pokemon        // evita undefined en .value()
  });


  constructor() { }

  ngOnInit() {
  }

}
