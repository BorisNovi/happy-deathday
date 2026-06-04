import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { SSR_API_BASE } from '@core';
import { WA_NAVIGATOR, WA_WINDOW } from '@ng-web-apis/common';
import { provideTranslateLoader } from '@ngx-translate/core';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { TranslateServerLoader } from './core/language/translate-server.loader';

const ssrWindow = {
  matchMedia: () => ({
    addEventListener: () => {},
    removeEventListener: () => {},
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
  document: {
    documentElement: { clientWidth: 0, clientHeight: 0 },
  },
  requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(cb, 0),
  cancelAnimationFrame: clearTimeout,
} as unknown as Window;

const ssrNavigator = { userAgent: '' } as Navigator;

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: SSR_API_BASE, useValue: process.env['SSR_API_BASE'] ?? 'http://backend:8080' },
    { provide: WA_WINDOW, useValue: ssrWindow },
    { provide: WA_NAVIGATOR, useValue: ssrNavigator },
    provideTranslateLoader(TranslateServerLoader),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
