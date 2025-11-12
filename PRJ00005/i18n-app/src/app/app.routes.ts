import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component')
  },
  {
    path: 'base-plan',
    loadComponent: () => import('./components/base-plan/base-plan.component')
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
