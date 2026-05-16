import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CardApi, CardStateService, LanguageService, QueryParamsService } from '@core';
import { CardDisplayComponent, CardStyle } from '@shared';
import { TuiButton } from '@taiga-ui/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-card-preview',
  imports: [CardDisplayComponent, TuiButton, TranslatePipe],
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
  readonly #destroy = inject(DestroyRef);

  protected readonly formData = this.#state.formData;
  protected readonly loading = signal(false);

  protected readonly estimatedDeathDate = computed(() => {
    const data = this.formData();
    if (!data) return new Date();
    const d = new Date(data.birthDate);
    const lifeExpectancy = data.gender === 'female' ? 76 : 71;
    d.setFullYear(d.getFullYear() + lifeExpectancy);
    return d;
  });

  constructor() {
    if (!this.#state.formData()) {
      this.#tryRestoreFromQueryParams();
    }
  }

  #tryRestoreFromQueryParams(): void {
    const parsed = this.#queryParams.parseQueryParams(this.#route.snapshot.queryParams);
    const name = parsed['name'] as string | undefined;
    const birthDate = parsed['birthDate'] instanceof Date ? parsed['birthDate'] : null;
    const gender = parsed['gender'] as 'male' | 'female' | undefined;
    const style = parsed['style'] as CardStyle | undefined;

    if (name && birthDate && gender && style && Object.values(CardStyle).includes(style as CardStyle)) {
      this.#state.set({
        recipientName: name,
        birthDate,
        lang: this.#langService.currentLanguageOption().value,
        gender,
        style,
      });
    } else {
      this.#router.navigate(['/public/create/form']);
    }
  }

  protected goBack(): void {
    this.#router.navigate(['/public/create/style'], { queryParamsHandling: 'preserve' });
  }

  protected submit(): void {
    const data = this.formData();
    if (!data || this.loading()) return;

    this.loading.set(true);
    this.#cardApi
      .create({
        recipientName: data.recipientName,
        birthDate: data.birthDate,
        lang: data.lang,
        gender: data.gender,
        style: data.style,
      })
      .pipe(
        takeUntilDestroyed(this.#destroy),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: card => {
          this.#state.clear();
          this.#router.navigate(['/card', card.id]);
        },
      });
  }
}
