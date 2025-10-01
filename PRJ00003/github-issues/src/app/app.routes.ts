import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'issues/:number',
    loadComponent: () => import('./modules/issues/pages/issues-page/issues-page.component')
  },
  {
    path: 'issues',
    loadComponent: () => import('./modules/issues/pages/issuses-list-page/issuses-list-page.component')
  },
  {
    path: '**',
    redirectTo: 'issues',
    pathMatch: 'full'
  }
];
