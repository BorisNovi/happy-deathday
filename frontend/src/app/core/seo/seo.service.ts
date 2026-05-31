import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoMeta {
  title: string;
  description: string;
  url?: string;
  locale?: string;
}

const CARD_OG = {
  ru: {
    title: (name: string) => `С Днём Рождения, ${name}!`,
    description: 'Посмотри, сколько времени осталось до конца — честное поздравление с обратным отсчётом.',
  },
  en: {
    title: (name: string) => `Happy Birthday, ${name}!`,
    description: 'See how much time is left — an honest birthday greeting with a countdown timer.',
  },
} as const;

@Injectable({ providedIn: 'root' })
export class SeoService {
  readonly #meta = inject(Meta);
  readonly #title = inject(Title);

  set(data: SeoMeta): void {
    this.#title.setTitle(data.title);
    this.#meta.updateTag({ name: 'description', content: data.description });
    this.#meta.updateTag({ property: 'og:title', content: data.title });
    this.#meta.updateTag({ property: 'og:description', content: data.description });
    this.#meta.updateTag({ property: 'og:type', content: 'website' });
    this.#meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.#meta.updateTag({ name: 'twitter:title', content: data.title });
    this.#meta.updateTag({ name: 'twitter:description', content: data.description });
    if (data.url)
      this.#meta.updateTag({ property: 'og:url', content: data.url });
    if (data.locale)
      this.#meta.updateTag({ property: 'og:locale', content: data.locale });
  }

  setCardMeta(card: { recipientName: string; lang: string; id: string | number }, origin: string): void {
    const lang = card.lang === 'en' ? 'en' : 'ru';
    const texts = CARD_OG[lang];
    this.set({
      title: texts.title(card.recipientName),
      description: texts.description,
      url: `${origin}/card/${card.id}`,
      locale: lang === 'en' ? 'en_US' : 'ru_RU',
    });
  }
}
