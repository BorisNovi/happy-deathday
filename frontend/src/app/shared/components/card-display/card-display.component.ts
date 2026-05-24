import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { LanguageService } from '@core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Country } from '@shared';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const;

@Component({
  selector: 'app-card-display',
  imports: [TranslatePipe],
  templateUrl: './card-display.component.html',
  styleUrl: './card-display.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDisplayComponent {
  readonly recipientName = input.required<string>();
  readonly birthDate = input.required<Date>();
  readonly deathDate = input.required<Date>();
  readonly countryCode = input<Country | undefined>(undefined);
  readonly gender = input<'male' | 'female' | undefined>(undefined);
  readonly quote = input<string | undefined>(undefined);

  readonly #destroy = inject(DestroyRef);
  readonly #translate = inject(TranslateService);
  readonly #langService = inject(LanguageService);
  readonly #now = signal<Date | null>(null);
  protected readonly flash = signal(false);
  protected readonly currentLang = this.#langService.currentLang;

  constructor() {
    afterNextRender(() => {
      this.#now.set(new Date());
      const id = setInterval(() => {
        this.#now.set(new Date());
        this.flash.set(true);
        setTimeout(() => this.flash.set(false), 80);
      }, 1000);
      this.#destroy.onDestroy(() => clearInterval(id));
    });
  }

  #pluralMonths(n: number): string {
    const m10 = n % 10, m100 = n % 100;
    if (m100 >= 11 && m100 <= 14) return this.#translate.instant('card.age.month.many');
    if (m10 === 1) return this.#translate.instant('card.age.month.one');
    if (m10 >= 2 && m10 <= 4) return this.#translate.instant('card.age.month.few');
    return this.#translate.instant('card.age.month.many');
  }

  #pluralYears(n: number): string {
    const m10 = n % 10, m100 = n % 100;
    if (m100 >= 11 && m100 <= 14) return this.#translate.instant('card.age.year.many');
    if (m10 === 1) return this.#translate.instant('card.age.year.one');
    if (m10 >= 2 && m10 <= 4) return this.#translate.instant('card.age.year.few');
    return this.#translate.instant('card.age.year.many');
  }

  #pad(n: number, len = 2): string {
    return String(n).padStart(len, '0');
  }

  protected readonly birthDateFormatted = computed<string>(() => {
    const d = this.birthDate();
    return `${d.getDate()} · ${ROMAN[d.getMonth()]} · ${d.getFullYear()}`;
  });

  protected readonly deathDateLabel = computed<string>(() => {
    const d = this.deathDate();
    return `${this.#pad(d.getDate())}.${this.#pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  });

  protected readonly ageDisplay = computed<string>(() => {
    const lang = this.currentLang();
    const now = this.#now();
    if (!now)
      return '';
    const elapsed = now.getTime() - this.birthDate().getTime();
    const years = Math.floor(elapsed / (365.25 * 86_400_000));
    const months = Math.floor((elapsed % (365.25 * 86_400_000)) / (30.44 * 86_400_000));
    const days = Math.floor(elapsed / 86_400_000);
    return this.#translate.instant('card.age.format', {
      years,
      yearWord: this.#pluralYears(years),
      months,
      monthWord: this.#pluralMonths(months),
      days: days.toLocaleString(lang),
    });
  });

  protected readonly countdown = computed<Record<'days' | 'hours' | 'mins' | 'secs', number>>(() => {
    const now = this.#now();
    if (!now)
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    const diff = Math.max(0, this.deathDate().getTime() - now.getTime());
    const totalSec = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSec / 86_400),
      hours: Math.floor((totalSec % 86_400) / 3600),
      mins: Math.floor((totalSec % 3600) / 60),
      secs: totalSec % 60,
    };
  });

  protected readonly daysDisplay = computed<string>(() => this.#pad(this.countdown().days, 5));
  protected readonly hoursDisplay = computed<string>(() => this.#pad(this.countdown().hours));
  protected readonly minsDisplay = computed<string>(() => this.#pad(this.countdown().mins));
  protected readonly secsDisplay = computed<string>(() => this.#pad(this.countdown().secs));

  protected readonly progress = computed<number>(() => {
    const now = this.#now();
    if (!now)
      return 0;
    const birth = this.birthDate().getTime();
    const death = this.deathDate().getTime();
    return Math.min(100, Math.max(0, ((now.getTime() - birth) / (death - birth)) * 100));
  });

  protected readonly progressDisplay = computed<string>(() => this.progress().toFixed(2));

  protected readonly lifeExpectancy = computed<string>(() => {
    this.currentLang();
    const span = this.deathDate().getTime() - this.birthDate().getTime();
    const years = Math.round(span / (365.25 * 86_400_000));
    const code = this.countryCode();
    const g = this.gender();
    const country = code ? this.#translate.instant(`country.${code}`) : '';
    const genderLabel = g ? this.#translate.instant(`createCard.form.gender.${g}`) : '';
    const suffix = [country, genderLabel].filter(Boolean).join(', ');
    return suffix
      ? `${years} ${this.#pluralYears(years)}, ${suffix}`
      : `${years} ${this.#pluralYears(years)}`;
  });

  protected readonly message = computed<string>(() => {
    this.currentLang();
    const p = this.progress();
    if (p < 25) return this.#translate.instant('card.message.early');
    if (p < 50) return this.#translate.instant('card.message.quarter');
    if (p < 75) return this.#translate.instant('card.message.half');
    return this.#translate.instant('card.message.late');
  });
}
