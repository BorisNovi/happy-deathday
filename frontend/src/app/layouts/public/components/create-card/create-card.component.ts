import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiError, TuiInput } from '@taiga-ui/core';
import { tuiValidationErrorsProvider } from '@taiga-ui/core/tokens';
import { TuiInputDate } from '@taiga-ui/kit';
import { TuiDay } from '@taiga-ui/cdk';
import { CardStateService } from '@core';

@Component({
  selector: 'app-create-card',
  imports: [ReactiveFormsModule, TuiInput, TuiInputDate, TuiButton, TuiError],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'Обязательное поле',
      maxlength: ({ requiredLength }: { requiredLength: number }) =>
        `Не более ${requiredLength} символов`,
    }),
  ],
})
export class CreateCardComponent {
  readonly #state = inject(CardStateService);
  readonly #router = inject(Router);

  protected readonly maxDate = TuiDay.currentLocal();

  protected readonly form = new FormGroup({
    recipientName: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(30)],
      nonNullable: true,
    }),
    birthDate: new FormControl<TuiDay | null>(null, Validators.required),
  });

  constructor() {
    const saved = this.#state.formData();
    if (saved) {
      this.form.setValue({
        recipientName: saved.recipientName,
        birthDate: TuiDay.fromLocalNativeDate(saved.birthDate),
      });
    }
  }

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
