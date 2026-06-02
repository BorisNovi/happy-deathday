import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { TranslateLoader, type TranslationObject } from '@ngx-translate/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Observable, of } from 'rxjs';

@Injectable()
export class TranslateServerLoader implements TranslateLoader {
  readonly #state = inject(TransferState);

  getTranslation(lang: string): Observable<TranslationObject> {
    const key = makeStateKey<TranslationObject>(`i18n.${lang}`);
    try {
      const filePath = join(process.cwd(), 'dist/frontend/browser/assets/i18n', `${lang}.json`);
      const data: TranslationObject = JSON.parse(readFileSync(filePath, 'utf-8'));
      this.#state.set(key, data);
      return of(data);
    }
    catch (e) {
      console.error('[TranslateServerLoader] failed to load', lang, 'from', process.cwd(), e);
      return of({});
    }
  }
}
