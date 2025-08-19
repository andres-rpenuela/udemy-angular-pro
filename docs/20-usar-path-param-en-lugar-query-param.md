# Usar PathParam en lugar de QueryParam

Lo que se busca es que Angular por medio del **Prerendering**, genere de forma estatica varias paginas del resutlado de "pokemons", para ello se recomienda usar el path param y pasar el numero de pagina en lugar de un query param dinamico.

## 1. Cambiar la ruta.

```ts
// en app.routes.ts, agregar el path param /:page
 // {
  //   path:'pokemons',
  //   loadComponent: () => import('./pages/pokemons-page/pokemons-page.component')
  // },
  {
    path:'pokemons/page/:page',
    loadComponent: () => import('./pages/pokemons-page/pokemons-page.component')
  },
```
## 2. Adaptar la señal de "CurrentPage()"
Lo principal es que cambia `queryParamMap` por `params`.
El parametro en lugar de usar `get(key)`, se usa `[key]`

```ts
 // Con query params, permite que sea opcional el paremtor y no hace falta definirlo en router
  //const page = this._route.snapshot.queryParamMap.get('page') ?? '1'; // esto ya no devuelve un observable
  // public currentPage$ = this._activatedRoute.queryParamMap.pipe(
  //     map(params => {
  //       const page = Number(params.get('page'));
  //       return (isNaN(page) || page < 1) ? 1 : page;
  //     })
  // );

  // Con path param
  // const page = this._route.snapshot.params['page'] ?? '1'; // esto ya no devuelve un observable
  public currentPage$ = this._activatedRoute.params.pipe(
      map(params => {
        const page = Number(params['page']);
        return (isNaN(page) || page < 1) ? 1 : page;
      })
  );
```

Independientemente del modo, para convertir el observable a señal:
```ts
  public currentPage = toSignal(
    this.pageService.currentPage$ ?? 1,
    {initialValue: 1}
  )
```

## 3. Eliminar la insercción del query param dinamico
Este ya no es necesario al usar `path param`:
 - usar un metodo para cambiar de pagina
 - usar una lógica para añadir el parametor `?page=x`

```ts
public goToPage(page: number, pageName: string = 'pokemon') {
    if(page<=0)
      return;

    const currentPath = this._router.url.split('?')[0]; // ignoramos query params

    // Se añade startsWith para soportar /pokemon/ con barra final:
    if ( currentPath.startsWith(`/${pageName}`)) {
      console.log("redirigiendo")
      this._router.navigate([], {
        relativeTo: this._activatedRoute, // ActivatedRoute
        queryParams: { page },   // actualiza o añade page
        queryParamsHandling: 'merge' // mantiene otros query params
      });
    }
  }
```

## 4. Actualizar la navegación y carga de la información
En lugar de una función, la navegación se realiza con `routerLink`:

```html
<div class="flex justify-between">
  <!-- <button class="mt-2" (click)="goToPage( currentPage() - 1 )"> -->
    <button class="mt-2" [class.disabled]="currentPage() == 1" [routerLink]="['/pokemons/page', currentPage()-1]">
    Anteriores
  </button>
   <!-- <button class="mt-2" (click)="goToPage( currentPage() + 1 )"> -->
    <button class="mt-2" [routerLink]="['/pokemons/page', currentPage()+1]">
    Siguientes
  </button>
</div>
```

En el navbar, se actualiza

```html
<!-- 
 <a [routerLink]="['/pokemons']" 
    [routerLinkActive]="['text-orange-600']" 
    [routerLinkActiveOptions]="{exact:true}"
    class="text-white px-4 py-2 hover:text-orange-600">Pokemons</a> -->
 
 <a [routerLink]="['/pokemons/page/1']" 
    [routerLinkActive]="['text-orange-600']" 
    [routerLinkActiveOptions]="{exact:true}" 
    class="text-white px-4 py-2 hover:text-orange-600">Pokemons</a>
```