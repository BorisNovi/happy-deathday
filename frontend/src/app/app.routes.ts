import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    title: 'Happy Deathday!',
    redirectTo: 'public',
    pathMatch: 'full'
    // loadComponent: () => import('./features').then(c => c.LandingComponent),
  },
  // {
  //   path: 'app',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./layouts').then(c => c.privateLayoutRoutes),
  // },
  {
    path: 'public',
    canActivate: [],
    loadChildren: () => import('./layouts').then(c => c.publicLayoutRoutes),
  },
  {
    path: 'card/:id',
    title: 'Happy Deathday!',
    loadComponent: () => import('./features').then(c => c.CardComponent),
  },
  // {
  //   path: 'auth',
  //   canActivate: [loggedInGuard],
  //   loadChildren: () => import('./features').then(c => c.authRoutes),
  // },
  {
    path: '**',
    title: '404 — Страница мертва',
    loadComponent: () => import('./features').then(c => c.NotFoundComponent),
  },
];
