import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CardApi } from '@core';
import { CardDisplayComponent } from '@shared';
import { EMPTY, catchError, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [CardDisplayComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly #cardApi = inject(CardApi);
  readonly #route = inject(ActivatedRoute);

  protected readonly error = signal<string | null>(null);

  protected readonly card = toSignal(
    this.#route.paramMap.pipe(
      map(params => params.get('id')!),
      switchMap(id =>
        this.#cardApi.getById(id).pipe(
          catchError(() => {
            this.error.set('Открытка не найдена или срок её действия истёк.');
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
    if (!c)
      return null;
    if (c.deathDate)
      return new Date(c.deathDate);
    const d = new Date(c.birthDate);
    // TODO: дата захардкожена, добавить на бэке
    d.setFullYear(d.getFullYear() + 73);
    return d;
  });
}
