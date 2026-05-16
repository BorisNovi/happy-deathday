import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout.component';

export const publicLayoutRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'create' },
      {
        path: 'create',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'intro' },
          {
            path: 'intro',
            title: 'Happy Deathday',
            loadComponent: () => import('./components').then(c => c.CreateIntroComponent),
          },
          {
            path: 'form',
            title: 'Создать открытку',
            loadComponent: () => import('./components').then(c => c.CreateFormComponent),
          },
          {
            path: 'style',
            title: 'Выбор стиля',
            loadComponent: () => import('./components').then(c => c.CreateStyleComponent),
          },
        ],
      },
      {
        path: 'card-preview',
        title: 'Предпросмотр открытки',
        loadComponent: () => import('./components').then(c => c.CardPreviewComponent),
      },
    ],
  },
];
