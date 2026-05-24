import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CardApi } from '@core';
import { CardDisplayComponent } from '@shared';
import { EMPTY, catchError, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [CardDisplayComponent, TranslatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly #cardApi = inject(CardApi);
  readonly #route = inject(ActivatedRoute);
  readonly #translate = inject(TranslateService);

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

  protected readonly birthDate = computed(() => {
    const c = this.card();
    return c ? new Date(c.birthDate) : null;
  });

  protected readonly deathDate = computed(() => {
    const c = this.card();
    return c ? new Date(c.expectedDeathDate) : null;
  });
}
