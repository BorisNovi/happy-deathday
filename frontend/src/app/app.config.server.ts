import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { WA_NAVIGATOR, WA_WINDOW } from '@ng-web-apis/common';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

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
    { provide: WA_WINDOW, useValue: ssrWindow },
    { provide: WA_NAVIGATOR, useValue: ssrNavigator },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
