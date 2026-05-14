import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardStateService, LanguageService } from '@core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiInput } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/core/tokens';
import { TuiInputDate } from '@taiga-ui/kit';

@Component({
  selector: 'app-create-card',
  imports: [ReactiveFormsModule, TuiInput, TuiInputDate, TuiButton, TuiError, TranslatePipe],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useFactory: (translate: TranslateService, langService: LanguageService) => ({
        required: computed(() => {
          langService.currentLang();
          return translate.instant('validation.required');
        }),
        maxlength: ({ requiredLength }: { requiredLength: number }) =>
          translate.instant('validation.maxlength', { requiredLength }),
      }),
      deps: [TranslateService, LanguageService],
    },
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
      recipientName,
      birthDate: birthDate!.toLocalNativeDate(),
      lang: this.#langService.currentLanguageOption().value,
    });

    this.#router.navigate(['/public/card-preview']);
  }
}
