import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, skip } from 'rxjs';

declare function ym(id: number, action: string, ...args: unknown[]): void;

const METRIKA_ID = 109656704;

@Injectable({ providedIn: 'root' })
export class MetrikaService {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID)))
      return;

    inject(Router).events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      skip(1),
    ).subscribe(e => {
      ym(METRIKA_ID, 'hit', e.urlAfterRedirects);
    });
  }
}
