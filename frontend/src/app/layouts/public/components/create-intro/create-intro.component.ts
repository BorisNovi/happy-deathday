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
  readonly #state = inject(CardStateService);
  readonly #seo = inject(SeoService);
  readonly #translate = inject(TranslateService);
  readonly #lang = inject(LanguageService);

  constructor() {
    this.#state.clear();
    this.#router.navigate(['/public/create/intro'], { replaceUrl: true });

    effect(() => {
      const lang = this.#lang.currentLang();
      const locale = lang === 'en' ? 'en_US' : 'ru_RU';
      this.#seo.set({
        title: this.#translate.instant('createCard.title'),
        description: this.#translate.instant('createCard.intro.p'),
        locale,
      });
    });
  }

  protected start(): void {
    this.#router.navigate(['/public/create/form']);
  }
}
