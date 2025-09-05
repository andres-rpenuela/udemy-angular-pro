import { Pokemon } from '@/pokemons/interfaces/pokemon.interface';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs';
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

  private title = inject(Title);
  private meta = inject(Meta);
  private http = inject(HttpClient);
  private activateRotuer = inject(ActivatedRoute);

  // Opcion A (mas limpia)
  // public pokemon = rxResource<Pokemon, { id: string | null }>({
  //   params: () => ({ id: null }), // params dummy
  //   stream: () =>
  //     this.activateRotuer.paramMap.pipe(
  //       switchMap(paramMap => {
  //         const id = paramMap.get('id');
  //         if (!id) throw new Error('ID not provided');
  //         return this.http.get<Pokemon>(`${this.RESOURCE_URL}${id}`).pipe(
  //           tap(({ id, name }) => {
  //             const title = `${id} - Pokemon ${name}`;
  //             const description = `Details Pokemon - ${name}`;
  //             this.title.setTitle(title);
  //             this.meta.updateTag({ name: 'description', content: description });
  //             this.meta.updateTag({ name: 'og:title', content: title });
  //             this.meta.updateTag({ name: 'og:description', content: description });
  //             this.meta.updateTag({
  //               name: 'og:image',
  //               content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  //             });
  //           }),
  //           //tap(res => console.log("res:",res))
  //         );
  //       })
  //     ),
  //   defaultValue: {} as Pokemon
  // });


  // Opcion B:
  // ejemplo de rxResource, en lugar de usarlo en el servicio
    public pokemon = rxResource<Pokemon, { id: string | null }>({
    // params: () => {
    //   let currentId: string | null = null;
    //   this.activateRotuer.paramMap.subscribe(map => {
    //     console.log("entro en parmas: "+map.get('id'))
    //     currentId = map.get('id');
    //   });
    //   return { id: currentId };
    // },
    //params: () => ({ id: this.activateRotuer.snapshot.paramMap.get('id') }), // ✅ antes era "request"
    params: () => ({ id: this.id }), // ✅ antes era "request"// common params
    stream: ({ params }) =>            // ✅ recibe { params, abortSignal }
      // opcion A, con fetch
      // fromFetch(`${this.RESOURCE_URL}${params.id}`).pipe(
      //   delay(1000),
      //   switchMap(res => res.json() as Promise<Pokemon>)
      // )
      // opcion B, con HTTP (recomenado para test)
      this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
      // common
      .pipe(
        tap( ({id, name}) => {
          console.log(id, name)
            const title = `${id} - Pokemon ${name}`;
            const description = `Details Pokemon - ${name}`
            this.title.setTitle(title);

            this.meta.updateTag( {name:"description",content: description});

            // rrss
            this.meta.updateTag( {name:"og:title",content: title});
            this.meta.updateTag( {name:"og:description",content: description});
            this.meta.updateTag( {name:"og:image",content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`})

        })
      ),
    defaultValue: {} as Pokemon        // evita undefined en .value()
  });

  constructor() { }

  ngOnInit() {
  }

}
