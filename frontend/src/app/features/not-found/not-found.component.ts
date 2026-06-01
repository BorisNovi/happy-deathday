import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '@core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TuiButton, TranslatePipe],
  styleUrl: './not-found.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="not-found" role="main">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">{{ 'notFound.title' | translate }}</h1>
      <p class="not-found__message">
        {{ 'notFound.message1' | translate }}<br />
        {{ 'notFound.message2' | translate }}
      </p>
      <a tuiButton [routerLink]="['/', lang(), 'public']" size="m" appearance="outline">
        {{ 'notFound.back' | translate }}
      </a>
    </main>
  `,
})
export class NotFoundComponent {
  protected readonly lang = inject(LanguageService).currentLang;
}
