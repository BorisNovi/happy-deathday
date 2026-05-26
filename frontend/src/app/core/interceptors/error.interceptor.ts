import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TuiNotificationService } from '@taiga-ui/core';
import { environment } from '@environments';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID)) || !req.url.startsWith(environment.apiUrl))
    return next(req);

  const notifications = inject(TuiNotificationService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const key = err.status === 0
          ? 'error.network'
          : err.status >= 500
            ? 'error.server'
            : 'error.client';

        notifications
          .open(translate.instant(key), {
            label: translate.instant('error.title'),
            appearance: 'negative',
            autoClose: 5000,
          })
          .subscribe();
      }

      return throwError(() => err);
    }),
  );
};
