import { ApplicationRef, Component, computed, inject, linkedSignal, OnDestroy, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from "@/pokemons/components/pokemon-list/pokemon-list.component";
import { filter, first, Subscription, switchMap } from 'rxjs';
import { PokemonsService } from '@/pokemons/services/pokemons.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SimplePokemon } from '@/pokemons/interfaces/simple-pokemon.interface';
import { PaginationService } from '@/shared/service/pagination.service.';

@Component({
  selector: 'pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.css'],
  imports: [PokemonListComponent]
})
export default class PokemonsPageComponent implements OnInit, OnDestroy{
  public isLoading = signal(true);

  private appRef = inject(ApplicationRef);


  // recomendacion de usar, antes que hacer un cambio que afecte a la vista en el OnInit
  // private appState$ = this.appRef.isStable
  //     .pipe(
  //       filter(stable => stable),// espera que sea TRUE
  //       first() // cuando sea TRUE, emite y se cierra
  //     )
  //     .subscribe(() => {
  //       console.log('SSR: Aplicación estable, lista para renderizar');
  //           setTimeout( ()=>{
  //               this.isLoading.set(false);
  //           },5000);
  //     });

  constructor() { }

  ngOnInit() {

    // se aconseja que se haga cuando sea estable, no el OnInit si se utiliza SSR
    // setTimeout( ()=>{
    //   this.isLoading.set(false);
    // },5000);

    // sin señales
    // this.loadPokemons();
  }

   private pokemonService = inject(PokemonsService);

  /** http **/
  // ejemplo tradicional
  // private pokeSub$:Subscription | undefined;

  // public loadPokemons = (pageNumer = 0) => {
  //   this.pokeSub$ = this.pokemonService.loadPage(0)
  //   .subscribe( res =>{
  //     console.log('sub: ',{res});
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.pokeSub$?.unsubscribe();
  // }
  ngOnDestroy(): void {

  }
    // paginacion
  private pageService = inject(PaginationService);
  public currentPage = toSignal(
    this.pageService.currentPage$ ?? 1,
    {initialValue: 1}
  )



  // ejemplo con señales
  // convierte un obs en una señal
  // cuando el componente que contiene este signal se destruya, Angular llamará automáticamente al unsubscribe() sobre el observable
  // public pokemons = toSignal(
  //   this.pokemonService.loadPage( 0 ),
  //   { initialValue: [] }
  // );

  /**
   * Forma correcta usando toSignal con un Observable
   * <ul>
   *  <li>currentPage emite un nuevo número cuando la página cambia.</li>
   *  <li>switchMap cancela la petición anterior y hace una nueva llamada a loadPage(page).
   *  <li>toSignal convierte todo esto en una señal reactiva, por lo que pokemons() siempre devuelve la lista correcta de Pokemons según la página.</li>
   * </ul>
   */
  public pokemons = toSignal(
    this.pageService.currentPage$
    .pipe(
      switchMap(page => this.pokemonService.loadPage(page)) // cada cambio de page hace un GET
    ),
    { initialValue: [] } // valor mientras no llega nada
  );

  goToPage(nextPage:number){
    this.pageService.goToPage( nextPage );
  }

}
