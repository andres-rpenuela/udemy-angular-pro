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
  },{
    path:'**',
    redirectTo: () =>{
      return 'about';
    }
  }
];
