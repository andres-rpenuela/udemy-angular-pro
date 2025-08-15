import { ApplicationRef, Component, inject, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from "@/pokemons/components/pokemon-list/pokemon-list.component";
import { filter, first } from 'rxjs';

@Component({
  selector: 'pokemons-page',
  templateUrl: './pokemons-page.component.html',
  styleUrls: ['./pokemons-page.component.css'],
  imports: [PokemonListComponent]
})
export default class PokemonsPageComponent implements OnInit {
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
  }

}
