import { Injectable, signal } from '@angular/core';

export interface ICardFormState {
  recipientName: string;
  birthDate: Date;
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
