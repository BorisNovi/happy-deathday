import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardStateService, LanguageService, QueryParamsService } from '@core';
import { TranslatePipe } from '@ngx-translate/core';
import { CardStyle } from '@shared';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-create-style',
  imports: [TuiButton, TranslatePipe],
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

  protected readonly styles = Object.values(CardStyle);
  protected readonly selectedStyle = signal<CardStyle>(CardStyle.Standard);

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
    const gender = parsed['gender'] as 'male' | 'female' | undefined;

    if (!name || !birthDate || !gender) {
      this.#router.navigate(['../form'], { relativeTo: this.#route, queryParamsHandling: 'preserve' });
      return;
    }

    this.#state.set({
      recipientName: name,
      birthDate,
      lang: this.#langService.currentLanguageOption().value,
      gender,
      style: this.selectedStyle(),
    });
    this.#router.navigate(['/public/card-preview'], { queryParamsHandling: 'preserve' });
  }

  protected back(): void {
    this.#router.navigate(['../form'], { relativeTo: this.#route, queryParamsHandling: 'preserve' });
  }
}
