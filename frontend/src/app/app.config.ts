import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { errorInterceptor, ssrApiInterceptor, TransferStateLoader } from '@core';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { provideTaiga } from '@taiga-ui/core';
import { tuiLanguageSwitcher } from '@taiga-ui/i18n';
import { routes } from './app.routes';

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
