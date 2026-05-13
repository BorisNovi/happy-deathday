import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  getItem<T>(key: string): T | null {
    if (!this.#isBrowser)
      return null;
    const raw = localStorage.getItem(key);
    if (raw === null)
      return null;
    try {
      return JSON.parse(raw) as T;
    }
    catch {
      return raw as unknown as T;
    }
  }

  setItem(key: string, value: unknown): void {
    if (!this.#isBrowser)
      return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    if (!this.#isBrowser)
      return;
    localStorage.removeItem(key);
  }
}
