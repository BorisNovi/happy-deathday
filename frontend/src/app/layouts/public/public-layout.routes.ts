import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout.component';
export const publicLayoutRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'card-creation',
      },
      // ...routes,
      {
        path: 'card-creation',
        title: 'Card',
        // resolve: { data: resolver },
        loadComponent: () => import('./components').then(c => c.CreateCardComponent),
      },
    ],
  },
];
