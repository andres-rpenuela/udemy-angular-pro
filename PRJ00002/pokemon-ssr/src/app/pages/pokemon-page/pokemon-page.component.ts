import { Pokemon } from '@/pokemons/interfaces/pokemon.interface';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, OnInit } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { catchError, delay, map, of, switchMap, tap, throwError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

@Component({
  selector: 'pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.css'],
  imports: [NgClass, NgIf, NgFor]
})
export default class PokemonPageComponent implements OnInit {

// public pokemon = signal<Pokemon | null>(null);
  //private id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  private id = toSignal(inject(ActivatedRoute).paramMap.pipe(
    map(map => map.get('id'))
  ));

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
    //params: () => ({ id: this.id }), // ✅ antes era "request"// common params: () => ({ id: this.id }), // ✅ antes era "request"// common params
   params: () => ({ id: this.id()??null }), // ✅ antes era "request"// common params
          stream: ({ params }) =>  {          // ✅ recibe { params, abortSignal }
      // opcion A, con fetch
      // fromFetch(`${this.RESOURCE_URL}${params.id}`).pipe(
      //   delay(1000),
      //   switchMap(res => res.json() as Promise<Pokemon>)
      // )
      // opcion B, con HTTP (recomenado para test)
      if (!params.id) {
        return of({} as Pokemon); // no llamar API si no hay id
      }

      return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
      // common
      .pipe(
        tap( ({id, name}) => {
          //console.log(id, name)
            const title = `${id} - Pokemon ${name}`;
            const description = `Details Pokemon - ${name}`
            this.title.setTitle(title);

            this.meta.updateTag( {name:"description",content: description});

            // rrss
            this.meta.updateTag( {name:"og:title",content: title});
            this.meta.updateTag( {name:"og:description",content: description});
            this.meta.updateTag( {name:"og:image",content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`})

        }),
        catchError((err) => { // Devhe,v e, bacm un 40x por ejemplo
          //console.error("❌ Error en stream:", err);
          // Opción A. devovler un json vacio
          //         return of({} as Pokemon); // no llamar API si no hay id

          // Opción B. convertir HttpErrorResponse en Error
          //return throwError(() => new Error(err.message || 'Pokemon not found'));

          // Opción C. manejador de error
          return this.handleError(err)
        })
      )},
    defaultValue: {} as Pokemon        // evita undefined en .value()
  });

  constructor() { }

  ngOnInit() {
  }

  private handleError( error: HttpErrorResponse){
      if( error.status === 0 ){
        // error en el cliente
        console.error('An error ocurred: ', error.error);
      }else{
        // error en el banck
        console.log(`Backend error, code: ${error.status}, body: `, error.error);
      }

      const errorMessage = error.error ?? 'An error ocurred';

      return throwError(() => new Error(errorMessage));
  }

}
