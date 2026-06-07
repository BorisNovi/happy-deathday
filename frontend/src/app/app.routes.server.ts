import { RenderMode, ServerRoute } from '@angular/ssr';


export const serverRoutes: ServerRoute[] = [
  {
    path: 'card/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
