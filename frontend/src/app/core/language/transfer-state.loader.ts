import { HttpClient } from '@angular/common/http';
import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { TranslateLoader, type TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TransferStateLoader implements TranslateLoader {
  readonly #http = inject(HttpClient);
  readonly #state = inject(TransferState);

  getTranslation(lang: string): Observable<TranslationObject> {
    const key = makeStateKey<TranslationObject>(`i18n.${lang}`);
    const cached = this.#state.get(key, null);

    if (cached) {
      this.#state.remove(key);
      return of(cached);
    }

    return this.#http
      .get<TranslationObject>(`/assets/i18n/${lang}.json`)
      .pipe(tap(data => this.#state.set(key, data)));
  }
}
