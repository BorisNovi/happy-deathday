import { Injectable, signal } from '@angular/core';
import type { CardStyle } from '../../shared/interfaces/card-style.enum';

export interface ICardFormState {
  recipientName: string;
  birthDate: Date;
  lang: string;
  gender: 'male' | 'female';
  style: CardStyle;
}

@Injectable({ providedIn: 'root' })
export class CardStateService {
  readonly formData = signal<ICardFormState | null>(null);

  set(data: ICardFormState): void {
    this.formData.set(data);
  }

  clear(): void {
    this.formData.set(null);
  }
}
