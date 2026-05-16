import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardStateService, LanguageService, QueryParamsService } from '@core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiButton, TuiError, TuiGroup, TuiInput, TuiRadio } from '@taiga-ui/core';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/core/tokens';
import { TuiBlock, TuiInputDate } from '@taiga-ui/kit';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-create-form',
  imports: [ReactiveFormsModule, TuiInput, TuiInputDate, TuiButton, TuiError, TuiGroup, TuiBlock, TuiRadio, TranslatePipe],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.less',
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
export class CreateFormComponent {
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #queryParams = inject(QueryParamsService);
  readonly #state = inject(CardStateService);

  protected readonly maxDate = TuiDay.currentLocal();

  protected readonly form = this.#fb.group({
    recipientName: this.#fb.nonNullable.control('', [Validators.required, Validators.maxLength(30)]),
    birthDate: this.#fb.control<TuiDay | null>(null, Validators.required),
    gender: this.#fb.control<'male' | 'female' | null>(null, Validators.required),
  });

  constructor() {
    const saved = this.#state.formData();
    const parsed = this.#queryParams.parseQueryParams(this.#route.snapshot.queryParams);

    const name = saved?.recipientName ?? parsed['name'];
    const birthDate = saved?.birthDate ?? (parsed['birthDate'] instanceof Date ? parsed['birthDate'] : null);
    const gender = saved?.gender ?? (parsed['gender'] as 'male' | 'female' | null);

    if (name)
      this.form.patchValue({ recipientName: name });
    if (birthDate)
      this.form.patchValue({ birthDate: TuiDay.fromLocalNativeDate(birthDate) });
    if (gender)
      this.form.patchValue({ gender });

    this.form.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed())
      .subscribe(() => this.#syncToParams(true));
  }

  #syncToParams(replace: boolean): void {
    const { recipientName, birthDate, gender } = this.form.getRawValue();
    this.#queryParams.updateQueryParams({
      name: recipientName || null,
      birthDate: birthDate?.toLocalNativeDate() ?? null,
      gender: gender || null,
    }, undefined, replace);
  }

  protected next(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.#syncToParams(false);
    this.#router.navigate(['../style'], { relativeTo: this.#route, queryParamsHandling: 'preserve' });
  }

  protected back(): void {
    this.#router.navigate(['../intro'], { relativeTo: this.#route });
  }
}
