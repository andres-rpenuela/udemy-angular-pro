import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'contact',
    loadComponent: () => import('./pages/contact-page/contact-page.component')
  },
  {
    path:'pricing',
    loadComponent: () => import('./pages/pricing-page/pricing-page.component')
  },
  {
    path:'about',
    loadComponent: () => import('./pages/about-page/about-page.component')
  },
  {
    path:'pokemons',
    loadComponent: () => import('./pages/pokemons-page/pokemons-page.component')
  },
  {
    path: 'pokemon/:id',
    loadComponent: () => import('./pages/pokemon-page/pokemon-page.component')
  },
  {
    path:'',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo: () =>{
      return 'about';
    }
  }
];
