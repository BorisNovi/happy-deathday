import { RenderMode, ServerRoute } from '@angular/ssr';

const LANGS = [{ lang: 'en' }, { lang: 'ru' }];

export const serverRoutes: ServerRoute[] = [
  {
    path: 'card/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang/public/create/intro',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang/public/create/form',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS,
  },
  {
    path: ':lang/public/create/style',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
