import { RenderMode, ServerRoute } from '@angular/ssr';

const LANGS = [{ lang: 'en' }, { lang: 'ru' }];

export const serverRoutes: ServerRoute[] = [
  {
    path: 'card/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang/create',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang/create/form',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS,
  },
  {
    path: ':lang/create/style',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
