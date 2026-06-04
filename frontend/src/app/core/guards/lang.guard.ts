import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { LanguageService } from '../language/language.service';

export const langGuard: CanActivateFn = route => {
  const lang = route.params['lang'] as string;
  const langService = inject(LanguageService);
  const router = inject(Router);

  if (!langService.availableLanguages.includes(lang))
    return router.createUrlTree([langService.currentLang()]);

  return langService.loadLang(lang).pipe(
    map(() => true),
    catchError(() => of(true)),
  );
};

export const defaultLangGuard: CanActivateFn = () => {
  const lang = inject(LanguageService).currentLang();
  return inject(Router).createUrlTree([lang]);
};
