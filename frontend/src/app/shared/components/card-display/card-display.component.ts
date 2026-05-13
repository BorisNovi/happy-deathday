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

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const;

@Component({
  selector: 'app-card-display',
  templateUrl: './card-display.component.html',
  styleUrl: './card-display.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDisplayComponent {
  readonly recipientName = input.required<string>();
  readonly birthDate = input.required<Date>();
  readonly deathDate = input.required<Date>();
  readonly quote = input<string | undefined>(undefined);

  readonly #destroy = inject(DestroyRef);
  readonly #now = signal<Date | null>(null);
  protected readonly flash = signal(false);

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
    if (m100 >= 11 && m100 <= 14)
      return 'месяцев';
    if (m10 === 1)
      return 'месяц';
    if (m10 >= 2 && m10 <= 4)
      return 'месяца';
    return 'месяцев';
  }

  #pluralYears(n: number): string {
    const m10 = n % 10, m100 = n % 100;
    if (m100 >= 11 && m100 <= 14)
      return 'лет';
    if (m10 === 1)
      return 'год';
    if (m10 >= 2 && m10 <= 4)
      return 'года';
    return 'лет';
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
    const now = this.#now();
    if (!now)
      return '';
    const elapsed = now.getTime() - this.birthDate().getTime();
    const years = Math.floor(elapsed / (365.25 * 86_400_000));
    const months = Math.floor((elapsed % (365.25 * 86_400_000)) / (30.44 * 86_400_000));
    const days = Math.floor(elapsed / 86_400_000);
    return `${years} ${this.#pluralYears(years)} и ${months} ${this.#pluralMonths(months)} · ${days.toLocaleString('ru')} дней`;
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
    const span = this.deathDate().getTime() - this.birthDate().getTime();
    const years = Math.round(span / (365.25 * 86_400_000));
    return `${years} ${this.#pluralYears(years)}`;
  });

  protected readonly message = computed<string>(() => {
    const p = this.progress();
    if (p < 25)
      return 'Большая часть пути ещё впереди. Самое время начать думать о важном.';
    if (p < 50)
      return 'Официально прожита четверть отведённого времени. Отличный повод выпить что-нибудь хорошее.';
    if (p < 75)
      return 'Официально прожито больше половины отведённого времени. Финальный акт уже не за горами.';
    return 'Финальный акт. Тратить время хорошо — единственный способ его победить.';
  });
}
