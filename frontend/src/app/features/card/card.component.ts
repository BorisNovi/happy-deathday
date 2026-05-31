import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CardApi, SeoService } from '@core';
import { CardDisplayComponent } from '@shared';
import { EMPTY, catchError, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [CardDisplayComponent, TranslatePipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly #cardApi = inject(CardApi);
  readonly #route = inject(ActivatedRoute);
  readonly #translate = inject(TranslateService);
  readonly #seo = inject(SeoService);
  readonly #doc = inject(DOCUMENT);

  protected readonly error = signal<string | null>(null);

  protected readonly card = toSignal(
    this.#route.paramMap.pipe(
      map(params => params.get('id')!),
      switchMap(id =>
        this.#cardApi.getById(id).pipe(
          catchError(() => {
            this.error.set(this.#translate.instant('card.notFound'));
            return EMPTY;
          }),
        ),
      ),
    ),
  );

  protected readonly cardStyle = computed(() => this.card()?.style ?? null);

  protected readonly birthDate = computed(() => {
    const c = this.card();
    return c ? new Date(c.birthDate) : null;
  });

  protected readonly deathDate = computed(() => {
    const c = this.card();
    return c ? new Date(c.expectedDeathDate) : null;
  });

  constructor() {
    effect(() => {
      const c = this.card();
      if (!c)
        return;
      this.#seo.setCardMeta(c, this.#doc.location.origin);
    });
  }
}
