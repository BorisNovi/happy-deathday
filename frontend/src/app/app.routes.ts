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
  // {
  //   path: 'auth',
  //   canActivate: [loggedInGuard],
  //   loadChildren: () => import('./features').then(c => c.authRoutes),
  // },
  // {
  //   path: '**',
  //   loadComponent: () => import('./features').then(c => c.NotFoundComponent),
  // },
];
