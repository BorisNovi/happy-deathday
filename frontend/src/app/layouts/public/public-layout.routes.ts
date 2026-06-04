import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { PublicLayoutComponent } from './public-layout.component';

const loadTranslations = async () => firstValueFrom(inject(TranslateService).get('country'));

export const publicLayoutRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'create' },
      {
        path: 'create',
        children: [
          // { path: '', pathMatch: 'full', redirectTo: 'intro' },
          {
            path: '',
            title: 'Happy Deathday',
            loadComponent: () => import('./components').then(c => c.CreateIntroComponent),
          },
          {
            path: 'form',
            title: 'Happy Deathday - Create Card',
            resolve: { _translations: loadTranslations },
            loadComponent: () => import('./components').then(c => c.CreateFormComponent),
          },
          {
            path: 'style',
            title: 'Happy Deathday - Select Style',
            loadComponent: () => import('./components').then(c => c.CreateStyleComponent),
          },
          {
            path: 'card-preview',
            title: 'Happy Deathday - Card Preview',
            loadComponent: () => import('./components').then(c => c.CardPreviewComponent),
          },
        ],
      },
    ],
  },
];
