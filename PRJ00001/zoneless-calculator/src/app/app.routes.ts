import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calculator',
    loadComponent: () => import("@calculator/layouts/calculator-layout/calculator-layout.component")
  },
  {
    path: '**',
    redirectTo: 'calculator'
  }
];
