import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CardApi, CardStateService, LanguageService, QueryParamsService } from '@core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CardDisplayComponent, CardStyle, Country } from '@shared';
import { TuiButton, TuiIcon, TuiLoader, TuiNotificationService } from '@taiga-ui/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-card-preview',
  imports: [CardDisplayComponent, TuiButton, TuiLoader, TuiIcon, TranslatePipe],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPreviewComponent {
  readonly #state = inject(CardStateService);
  readonly #cardApi = inject(CardApi);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #queryParams = inject(QueryParamsService);
  readonly #langService = inject(LanguageService);
  readonly #translate = inject(TranslateService);
  readonly #destroy = inject(DestroyRef);
  readonly #notifications = inject(TuiNotificationService);

  protected readonly formData = this.#state.formData;
  protected readonly loading = signal(false);
  protected readonly createdCardId = signal<string | null>(null);

  constructor() {
    if (!this.#state.formData()) {
      this.#tryRestoreFromQueryParams();
    }
  }

  #tryRestoreFromQueryParams(): void {
    const parsed = this.#queryParams.parseQueryParams(this.#route.snapshot.queryParams);
    const name = parsed['name'] as string | undefined;
    const birthDate = parsed['birthDate'] instanceof Date ? parsed['birthDate'] : null;
    const countryCode = (parsed['countryCode'] as Country | undefined) ?? Country.WW;
    const gender = parsed['gender'] as 'male' | 'female' | undefined;
    const style = parsed['style'] as CardStyle | undefined;

    if (!name || !birthDate || !gender || !style || !Object.values(CardStyle).includes(style)) {
      this.#router.navigate(this.#langService.langPath('create', 'form'));
      return;
    }

    this.loading.set(true);
    this.#cardApi
      .preview({ birthDate, countryCode, gender })
      .pipe(
        takeUntilDestroyed(this.#destroy),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: ({ expectedDeathDate }) => {
          this.#state.set({
            recipientName: name,
            birthDate,
            deathDate: new Date(expectedDeathDate),
            lang: this.#langService.currentLanguageOption().value,
            countryCode,
            gender,
            style,
          });
        },
        error: () => this.#router.navigate(this.#langService.langPath('create', 'form')),
      });
  }

  protected goBack(): void {
    this.#router.navigate(this.#langService.langPath('create', 'style'), { queryParamsHandling: 'preserve' });
  }

  protected submit(): void {
    const data = this.formData();
    if (!data || this.loading())
      return;

    this.loading.set(true);
    this.#cardApi
      .create({
        recipientName: data.recipientName,
        birthDate: data.birthDate,
        lang: data.lang,
        countryCode: data.countryCode,
        gender: data.gender,
        style: data.style,
      })
      .pipe(
        takeUntilDestroyed(this.#destroy),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: card =>this.createdCardId.set(String(card.id)),
      });
  }

  protected createAnother(): void {
    this.#state.clear();
    this.#router.navigate(this.#langService.langPath());
  }

  protected copyLink(): void {
    const id = this.createdCardId();
    if (!id)
      return;
    navigator.clipboard
      .writeText(`${window.location.origin}/card/${id}`)
      .then(() => {
        this.#notifications
          .open(this.#translate.instant('preview.copied'), { appearance: 'positive', autoClose: 5000 })
          .subscribe();
      });
  }

  protected openCard(): void {
    const id = this.createdCardId();
    if (!id)
      return;
    window.open(`${window.location.origin}/card/${id}`, '_blank');
  }
}
