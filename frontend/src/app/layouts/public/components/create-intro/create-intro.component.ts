import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { CardStateService, LanguageService, SeoService } from '@core';

@Component({
  selector: 'app-create-intro',
  imports: [TuiButton, TuiIcon, TranslatePipe],
  templateUrl: './create-intro.component.html',
  styleUrl: './create-intro.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateIntroComponent {
  readonly #router = inject(Router);
  readonly #doc = inject(DOCUMENT);
  readonly #state = inject(CardStateService);
  readonly #seo = inject(SeoService);
  readonly #translate = inject(TranslateService);
  readonly #lang = inject(LanguageService);

  constructor() {
    this.#state.clear();
    this.#router.navigate(this.#lang.langPath('public', 'create', 'intro'), { replaceUrl: true });

    effect(() => {
      this.#seo.set({
        title: this.#translate.instant('createCard.title'),
        description: this.#translate.instant('createCard.intro.p'),
        locale: this.#lang.currentLocale(),
      });
      const origin = this.#doc.location.origin;
      this.#seo.setHreflang([
        { hreflang: 'en', href: `${origin}/en/public/create/intro` },
        { hreflang: 'ru', href: `${origin}/ru/public/create/intro` },
        { hreflang: 'x-default', href: `${origin}/en/public/create/intro` },
      ]);
    });
  }

  protected start(): void {
    this.#router.navigate(this.#lang.langPath('public', 'create', 'form'));
  }
}
