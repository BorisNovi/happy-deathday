import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardStateService, LanguageService } from '@core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiInput } from '@taiga-ui/core';
import { tuiValidationErrorsProvider } from '@taiga-ui/core/tokens';
import { TuiInputDate } from '@taiga-ui/kit';

@Component({
  selector: 'app-create-card',
  imports: [ReactiveFormsModule, TuiInput, TuiInputDate, TuiButton, TuiError, TranslatePipe],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'Обязательное поле',
      maxlength: ({ requiredLength }: { requiredLength: number }) =>
        `Не более ${requiredLength} символов`,
    })
  ],
})
export class CreateCardComponent {
  readonly #fb = inject(FormBuilder);
  readonly #state = inject(CardStateService);
  readonly #router = inject(Router);
  readonly #langService = inject(LanguageService);

  protected readonly maxDate = TuiDay.currentLocal();

  protected readonly form = this.#fb.group({
    recipientName: this.#fb.nonNullable.control('', [Validators.required, Validators.maxLength(30)]),
    birthDate: this.#fb.control<TuiDay | null>(null, Validators.required),
  });

  constructor() {
    const saved = this.#state.formData();
    if (saved) {
      this.form.patchValue({
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
      lang: this.#langService.currentLanguageOption().value,
      recipientName,
      birthDate: birthDate!.toLocalNativeDate(),
    });

    this.#router.navigate(['/public/card-preview']);
  }
}
