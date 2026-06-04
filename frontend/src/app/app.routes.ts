import { Routes } from '@angular/router';
import { defaultLangGuard, langGuard } from '@core';

export const routes: Routes = [
  {
    path: '',
    canActivate: [defaultLangGuard],
    children: [],
  },
  {
    path: 'card/:id',
    title: 'Happy Deathday!',
    loadComponent: () => import('./features').then(c => c.CardComponent),
  },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts').then(c => c.publicLayoutRoutes),
      }
    ],
  },
  {
    path: '**',
    title: '404',
    loadComponent: () => import('./features').then(c => c.NotFoundComponent),
  },
];
