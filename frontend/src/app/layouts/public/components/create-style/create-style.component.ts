import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CardApi, CardStateService, LanguageService, QueryParamsService } from '@core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardStyle, Country } from '@shared';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-style',
  imports: [TuiButton, TuiLoader, TranslatePipe],
  templateUrl: './create-style.component.html',
  styleUrl: './create-style.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStyleComponent {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #queryParams = inject(QueryParamsService);
  readonly #state = inject(CardStateService);
  readonly #langService = inject(LanguageService);
  readonly #cardApi = inject(CardApi);
  readonly #destroy = inject(DestroyRef);

  protected readonly styles = Object.values(CardStyle);
  protected readonly selectedStyle = signal<CardStyle>(CardStyle.Standard);
  protected readonly loading = signal(false);

  constructor() {
    const parsed = this.#queryParams.parseQueryParams(this.#route.snapshot.queryParams);
    const style = parsed['style'] as string | undefined;
    if (style && Object.values(CardStyle).includes(style as CardStyle))
      this.selectedStyle.set(style as CardStyle);
  }

  protected selectStyle(style: CardStyle): void {
    this.selectedStyle.set(style);
    this.#queryParams.updateQueryParams({ style }, undefined, true);
  }

  protected preview(): void {
    const parsed = this.#queryParams.parseQueryParams(this.#route.snapshot.queryParams);
    const name = parsed['name'] as string | undefined;
    const birthDate = parsed['birthDate'] instanceof Date ? parsed['birthDate'] : null;
    const countryCode = (parsed['countryCode'] as Country | undefined) ?? Country.WW;
    const gender = parsed['gender'] as 'male' | 'female' | undefined;

    if (!name || !birthDate || !gender) {
      this.#router.navigate(['../form'], { relativeTo: this.#route, queryParamsHandling: 'preserve' });
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
            style: this.selectedStyle(),
          });
          this.#router.navigate(['/public/card-preview'], { queryParamsHandling: 'preserve' });
        },
      });
  }

  protected back(): void {
    this.#router.navigate(['../form'], { relativeTo: this.#route, queryParamsHandling: 'preserve' });
  }
}
