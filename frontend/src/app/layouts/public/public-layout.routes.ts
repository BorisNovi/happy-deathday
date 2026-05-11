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
        title: 'Создать открытку',
        loadComponent: () => import('./components').then(c => c.CreateCardComponent),
      },
      {
        path: 'card-preview',
        title: 'Предпросмотр открытки',
        loadComponent: () => import('./components').then(c => c.CardPreviewComponent),
      },
    ],
  },
];
