import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { WA_WINDOW } from '@ng-web-apis/common';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const ssrWindow = {
  matchMedia: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
  localStorage: null,
} as unknown as Window;

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: WA_WINDOW, useValue: ssrWindow },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
