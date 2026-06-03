import { HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { errorInterceptor, TransferStateLoader } from '@core';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { provideTaiga } from '@taiga-ui/core';
import { tuiLanguageSwitcher } from '@taiga-ui/i18n';
import { routes } from './app.routes';

export const SSR_API_BASE = new InjectionToken<string>('SSR_API_BASE', { factory: () => '' });

const ssrApiInterceptor: HttpInterceptorFn = (req, next) => {
  const base = inject(SSR_API_BASE);
  if (base && req.url.startsWith('/api')) {
    return next(req.clone({ url: `${base}${req.url}` }));
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([errorInterceptor, ssrApiInterceptor]), withFetch()),
    provideTaiga(),
    tuiLanguageSwitcher(language => {
      if (language === 'russian')
        return import('@taiga-ui/i18n/languages/russian');
      return import('@taiga-ui/i18n/languages/english');
    }),
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateLoader(TransferStateLoader),
    }),
  ],
};
