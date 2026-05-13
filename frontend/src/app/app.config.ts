import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideTaiga } from '@taiga-ui/core';
import { routes } from './app.routes';
import { TransferStateLoader } from './core/language/transfer-state.loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([]), withFetch()),
    provideTaiga(),
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'ru',
        loader: {
          provide: TranslateLoader,
          useClass: TransferStateLoader,
        },
      }),
    ),
  ],
};
