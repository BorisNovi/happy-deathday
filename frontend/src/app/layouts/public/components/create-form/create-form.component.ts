import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardStateService, LanguageService, QueryParamsService } from '@core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Country } from '@shared';
import { TuiDropdownSheet } from '@taiga-ui/addon-mobile';
import { TUI_PLATFORM, TuiDay } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiError, TuiGroup, TuiIcon, TuiInput, TuiRadio } from '@taiga-ui/core';
import { TUI_ITEMS_HANDLERS } from '@taiga-ui/core/directives/items-handlers';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/core/tokens';
import { TuiBlock, TuiInputDate, TuiSelect, TuiTooltip } from '@taiga-ui/kit';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-create-form',
  imports: [ReactiveFormsModule, TuiInput, TuiInputDate, TuiButton, TuiError, TuiGroup, TuiBlock, TuiRadio, TuiIcon, TuiSelect, TuiDataList, TuiTooltip, TuiDropdownSheet, TranslatePipe],
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
    {
      provide: TUI_ITEMS_HANDLERS,
      useFactory: () => {
        const translate = inject(TranslateService);
        return {
          stringify: () => (countryCode: Country) => translate.instant(`country.${countryCode}`),
          identityMatcher: signal((a: unknown, b: unknown) => a === b),
          disabledItemHandler: signal(() => false),
        };
      }
    },
  ],
})
export class CreateFormComponent {
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #queryParams = inject(QueryParamsService);
  readonly #state = inject(CardStateService);

  readonly #platform = inject(TUI_PLATFORM);
  protected readonly isMobile = this.#platform !== 'web';
  protected readonly maxDate = TuiDay.currentLocal();
  protected readonly countryGroups: { label: string | null; codes: Country[] }[] = [
    { label: null, codes: [Country.WW] },
    { label: 'createCard.form.country.group.cis', codes: [Country.RU, Country.UA, Country.BY, Country.KZ, Country.UZ, Country.GE, Country.AM, Country.IL] },
    { label: 'createCard.form.country.group.english', codes: [Country.US, Country.GB, Country.CA, Country.AU] },
    { label: 'createCard.form.country.group.europe', codes: [Country.DE, Country.FR, Country.PL, Country.ES, Country.IT, Country.NL, Country.RS] },
    { label: 'createCard.form.country.group.asia', codes: [Country.CN, Country.JP, Country.KR, Country.SG, Country.VN, Country.TH, Country.MY, Country.ID, Country.PH, Country.IN] },
  ];

  protected readonly form = this.#fb.group({
    recipientName: this.#fb.nonNullable.control('', [Validators.required, Validators.maxLength(30)]),
    birthDate: this.#fb.control<TuiDay | null>(null, Validators.required),
    countryCode: this.#fb.control<Country | null>(Country.WW),
    gender: this.#fb.control<'male' | 'female' | null>(null, Validators.required),
  });

  constructor() {
    const saved = this.#state.formData();
    const parsed = this.#queryParams.parseQueryParams(this.#route.snapshot.queryParams);

    const name = saved?.recipientName ?? parsed['name'];
    const birthDate = saved?.birthDate ?? (parsed['birthDate'] instanceof Date ? parsed['birthDate'] : null);
    const countryCode = saved?.countryCode ?? parsed['countryCode'];
    const gender = saved?.gender ?? (parsed['gender'] as 'male' | 'female' | null);

    if (name)
      this.form.patchValue({ recipientName: name });
    if (birthDate)
      this.form.patchValue({ birthDate: TuiDay.fromLocalNativeDate(birthDate) });
    if (countryCode)
      this.form.patchValue({ countryCode });
    if (gender)
      this.form.patchValue({ gender });

    this.form.valueChanges
      .pipe(debounceTime(400), takeUntilDestroyed())
      .subscribe(() => this.#syncToParams(true));
  }

  #syncToParams(replace: boolean): void {
    const { recipientName, birthDate, countryCode, gender } = this.form.getRawValue();
    this.#queryParams.updateQueryParams({
      name: recipientName || null,
      birthDate: birthDate?.toLocalNativeDate() ?? null,
      countryCode: countryCode || null,
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
    this.#router.navigate(['/'], { relativeTo: this.#route });
  }
}
