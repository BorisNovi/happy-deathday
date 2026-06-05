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
import { CardStyle, Country } from '@shared';

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const;

@Component({
  selector: 'app-card-display',
  imports: [TranslatePipe],
  templateUrl: './card-display.component.html',
  styleUrl: './card-display.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-style]': 'style()' },
})
export class CardDisplayComponent {
  readonly recipientName = input.required<string>();
  readonly birthDate = input.required<Date>();
  readonly deathDate = input.required<Date>();
  readonly style = input<CardStyle | undefined>(undefined);
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

  #plural(n: number, type: 'year' | 'month' | 'day'): string {
    const m10 = n % 10, m100 = n % 100;
    const form = (m100 >= 11 && m100 <= 14) ? 'many'
      : m10 === 1 ? 'one'
      : (m10 >= 2 && m10 <= 4) ? 'few'
      : 'many';
    return this.#translate.instant(`card.age.${type}.${form}`);
  }

  #pad(n: number, len = 2): string {
    return String(n).padStart(len, '0');
  }

  protected toRoman(n: number): string {
    return ROMAN[n] ?? String(n);
  }

  protected readonly deathDateLabel = computed<string>(() => {
    const d = this.deathDate();
    return `${this.#pad(d.getDate())}.${this.#pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  });

    protected readonly ageDisplay = computed(() => {
    const lang = this.currentLang();
    const now = this.#now();
    if (!now)
      return {};
    const elapsed = now.getTime() - this.birthDate().getTime();
    const years = Math.floor(elapsed / (365.25 * 86_400_000));
    const months = Math.floor((elapsed % (365.25 * 86_400_000)) / (30.44 * 86_400_000));
    const days = Math.floor(elapsed / 86_400_000);
    return {
      years,
      yearWord: this.#plural(years, 'year'),
      months,
      monthWord: this.#plural(months, 'month'),
      days: days.toLocaleString(lang),
      dayWord: this.#plural(days, 'day'),
    };
  });

  protected readonly isOvertime = computed<boolean>(() => {
    const now = this.#now();
    return !!now && now > this.deathDate();
  });

  protected readonly countdown = computed<Record<'days' | 'hours' | 'mins' | 'secs', number>>(() => {
    const now = this.#now();
    if (!now)
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    const diff = this.isOvertime()
      ? now.getTime() - this.deathDate().getTime()
      : this.deathDate().getTime() - now.getTime();
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
      ? `${years} ${this.#plural(years, 'year')}, ${suffix}`
      : `${years} ${this.#plural(years, 'year')}`;
  });

  protected readonly message = computed<string>(() => {
    this.currentLang();
    const p = this.progress();
    if (p < 15) return this.#translate.instant('card.message.dawn');
    if (p < 25) return this.#translate.instant('card.message.early');
    if (p < 33) return this.#translate.instant('card.message.beforeThird');
    if (p < 38) return this.#translate.instant('card.message.third');
    if (p < 50) return this.#translate.instant('card.message.beforeHalf');
    if (p < 65) return this.#translate.instant('card.message.half');
    if (p < 75) return this.#translate.instant('card.message.turning');
    if (p < 87) return this.#translate.instant('card.message.beforeLate');
    if (p < 100) return this.#translate.instant('card.message.late');
    return this.#translate.instant('card.message.final');
  });
}
