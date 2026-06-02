import { HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { WA_NAVIGATOR, WA_WINDOW } from '@ng-web-apis/common';
import { provideTranslateLoader } from '@ngx-translate/core';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { TranslateServerLoader } from './core/language/translate-server.loader';

const ssrApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const base = process.env['SSR_API_BASE'] ?? 'http://backend:8080';
    return next(req.clone({ url: `${base}${req.url}` }));
  }
  return next(req);
};

const ssrWindow = {
  matchMedia: () => ({
    // matches: false,
    // media: '',
    // onchange: null,
    // addListener: () => {},
    // removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    // dispatchEvent: () => false,
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
  // localStorage: null,
  // innerWidth: 0,
  // innerHeight: 0,
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
    provideHttpClient(withFetch(), withInterceptors([ssrApiInterceptor])),
    { provide: WA_WINDOW, useValue: ssrWindow },
    { provide: WA_NAVIGATOR, useValue: ssrNavigator },
    provideTranslateLoader(TranslateServerLoader),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
