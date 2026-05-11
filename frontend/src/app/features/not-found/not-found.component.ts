import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TuiButton],
  styleUrl: './not-found.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="not-found" role="main">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">Страница мертва</h1>
      <p class="not-found__message">
        Она существовала, но время взяло своё.<br />
        Или её никогда не было — кто знает.
      </p>
      <a tuiButton routerLink="/public" size="m" appearance="outline">
        ← Вернуться к началу
      </a>
    </main>
  `,
})
export class NotFoundComponent {}
