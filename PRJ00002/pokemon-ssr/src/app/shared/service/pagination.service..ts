import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  // Con query params, permite que sea opcional el paremtor y no hace falta definirlo en router
  //const page = this._route.snapshot.queryParamMap.get('page') ?? '1'; // esto ya no devuelve un observable
  // public currentPage$ = this._activatedRoute.queryParamMap.pipe(
  //     map(params => {
  //       const page = Number(params.get('page'));
  //       return (isNaN(page) || page < 1) ? 1 : page;
  //     })
  // );

  // Con path param (Se peude suar params, o paramMap)
 // const page = this._route.snapshot.params['page'] ?? '1'; // esto ya no devuelve un observable
  public currentPage$ = this._activatedRoute.paramMap.pipe(
    map(params => {
      console.log('param page= ' + params.get('page'))
      const page = Number(params.get('page'));
      return (isNaN(page) || page < 1) ? 1 : page;
    }),
    tap(page => console.log('param page= ' + page))
  );

  constructor() { }


  // public goToPage(page: number, pageName: string = 'pokemon') {
  //   if(page<=0)
  //     return;

  //   const currentPath = this._router.url.split('?')[0]; // ignoramos query params

  //   // Se añade startsWith para soportar /pokemon/ con barra final:
  //   if ( currentPath.startsWith(`/${pageName}`)) {
  //     console.log("redirigiendo")
  //     this._router.navigate([], {
  //       relativeTo: this._activatedRoute, // ActivatedRoute
  //       queryParams: { page },   // actualiza o añade page
  //       queryParamsHandling: 'merge' // mantiene otros query params
  //     });
  //   }
  // }
}
