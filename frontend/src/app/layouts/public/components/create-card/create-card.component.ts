import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiInput } from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';
import { TuiDay } from '@taiga-ui/cdk';
import { CardStateService } from '@core';

@Component({
  selector: 'app-create-card',
  imports: [ReactiveFormsModule, TuiInput, TuiInputDate, TuiButton],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCardComponent {
  readonly #state = inject(CardStateService);
  readonly #router = inject(Router);

  protected readonly maxDate = TuiDay.currentLocal();

  protected readonly form = new FormGroup({
    recipientName: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    }),
    birthDate: new FormControl<TuiDay | null>(null, Validators.required),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { recipientName, birthDate } = this.form.getRawValue();

    this.#state.set({
      recipientName,
      birthDate: birthDate!.toLocalNativeDate(),
    });

    this.#router.navigate(['/public/card-preview']);
  }
}
