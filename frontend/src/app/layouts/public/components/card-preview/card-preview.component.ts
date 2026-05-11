import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CardApi, CardStateService } from '@core';
import { CardDisplayComponent } from '@shared';
import { TuiButton } from '@taiga-ui/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-card-preview',
  imports: [CardDisplayComponent, TuiButton],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPreviewComponent {
  readonly #state = inject(CardStateService);
  readonly #cardApi = inject(CardApi);
  readonly #router = inject(Router);
  readonly #destroy = inject(DestroyRef);

  protected readonly formData = this.#state.formData;
  protected readonly loading = signal(false);

  protected readonly estimatedDeathDate = computed(() => {
    const data = this.formData();
    if (!data)
      return new Date();
    const d = new Date(data.birthDate);
    // TODO: дата смерти захардкожена, добавить на бэке
    d.setFullYear(d.getFullYear() + 73);
    return d;
  });

  constructor() {
    if (!this.#state.formData())
      this.#router.navigate(['/public/card-creation']);
  }

  protected goBack(): void {
    this.#router.navigate(['/public/card-creation']);
  }

  protected submit(): void {
    const data = this.formData();
    if (!data || this.loading())
      return;

    this.loading.set(true);
    this.#cardApi
      .create({ recipientName: data.recipientName, birthDate: data.birthDate })
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
