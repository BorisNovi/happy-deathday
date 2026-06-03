import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { InterpolatableTranslationObject, TranslateService } from '@ngx-translate/core';
import { ILanguageOption } from '@shared';
import { TuiLanguageSwitcherService } from '@taiga-ui/i18n';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly #translate = inject(TranslateService);
  readonly #storage = inject(StorageService);
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly #tuiLang = inject(TuiLanguageSwitcherService);

  readonly availableLanguages = ['ru', 'en'];
  readonly #defaultLanguage = 'en';
  readonly #localeMap: Record<string, string> = { en: 'en_US', ru: 'ru_RU' };

  readonly #currentLang = signal<string>(this.#getInitialLanguage());

  readonly languageOptions: readonly ILanguageOption[] = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English' },
  ];

  readonly currentLanguageOption = computed<ILanguageOption>(
    () => this.languageOptions.find(o => o.value === this.#currentLang()) ?? this.languageOptions[0],
  );

  readonly currentLang = this.#currentLang.asReadonly();

  constructor() {
    this.#translate.addLangs(this.availableLanguages);
    this.#translate.use(this.#currentLang());
    this.#tuiLang.setLanguage(this.#toTuiLang(this.#currentLang()));
  }

  changeLanguage(value: string): void {
    this.#currentLang.set(value);
    this.#storage.setItem('language', value);
    this.#translate.use(value);
    this.#tuiLang.setLanguage(this.#toTuiLang(value));
  }

  loadLang(lang: string): Observable<InterpolatableTranslationObject> {
    this.#currentLang.set(lang);
    this.#storage.setItem('language', lang);
    this.#tuiLang.setLanguage(this.#toTuiLang(lang));
    return this.#translate.use(lang);
  }

  #toTuiLang(lang: string): 'russian' | 'english' {
    return lang === 'ru' ? 'russian' : 'english';
  }

  readonly currentLocale = computed(() => this.localeFor(this.#currentLang()));

  localeFor(lang: string): string {
    return this.#localeMap[lang] ?? lang;
  }

  langPath(...segments: string[]): string[] {
    return [this.currentLang(), ...segments];
  }

  #getInitialLanguage(): string {
    const saved = this.#storage.getItem<string>('language');
    if (saved && this.availableLanguages.includes(saved))
      return saved;

    if (this.#isBrowser) {
      const browser = this.#translate.getBrowserLang();
      if (browser && this.availableLanguages.includes(browser))
        return browser;
    }

    return this.#defaultLanguage;
  }
}
