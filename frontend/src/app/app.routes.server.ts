import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'card/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'public/create/intro',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'public/create/form',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'public/create/style',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
