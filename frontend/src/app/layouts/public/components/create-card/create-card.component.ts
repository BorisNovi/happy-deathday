import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardStateService, LanguageService } from '@core';
import { TranslatePipe } from '@ngx-translate/core';
import { ILanguageOption } from '@shared';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiError, TuiInput } from '@taiga-ui/core';
import { tuiItemsHandlersProvider } from '@taiga-ui/core/directives/items-handlers';
import { tuiValidationErrorsProvider } from '@taiga-ui/core/tokens';
import { TuiInputDate, TuiSelect } from '@taiga-ui/kit';

@Component({
  selector: 'app-create-card',
  imports: [ReactiveFormsModule, TuiInput, TuiInputDate, TuiButton, TuiError, TuiSelect, TuiDataList, TranslatePipe],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'Обязательное поле',
      maxlength: ({ requiredLength }: { requiredLength: number }) =>
        `Не более ${requiredLength} символов`,
    }),
    tuiItemsHandlersProvider<ILanguageOption>({
      stringify: signal((o: ILanguageOption) => o.label),
      identityMatcher: signal((a: ILanguageOption, b: ILanguageOption) => a.value === b.value),
    }),
  ],
})
export class CreateCardComponent {
  readonly #fb = inject(FormBuilder);
  readonly #state = inject(CardStateService);
  readonly #router = inject(Router);
  readonly #langService = inject(LanguageService);

  protected readonly maxDate = TuiDay.currentLocal();
  protected readonly langOptions = this.#langService.languageOptions;

  protected readonly form = this.#fb.group({
    lang: this.#fb.nonNullable.control(this.#langService.currentLanguageOption()),
    recipientName: this.#fb.nonNullable.control('', [Validators.required, Validators.maxLength(30)]),
    birthDate: this.#fb.control<TuiDay | null>(null, Validators.required),
  });

  constructor() {
    const saved = this.#state.formData();
    if (saved) {
      this.form.patchValue({
        recipientName: saved.recipientName,
        birthDate: TuiDay.fromLocalNativeDate(saved.birthDate),
        lang: this.#langService.languageOptions.find(o => o.value === saved.lang),
      });
    }

    this.form.controls.lang.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(opt => {
        if (opt)
          this.#langService.changeLanguage(opt.value);
      });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { lang, recipientName, birthDate } = this.form.getRawValue();

    this.#state.set({
      lang: lang.value,
      recipientName,
      birthDate: birthDate!.toLocalNativeDate(),
    });

    this.#router.navigate(['/public/card-preview']);
  }
}
