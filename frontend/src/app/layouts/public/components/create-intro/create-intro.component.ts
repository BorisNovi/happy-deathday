import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { CardStateService } from '@core';

@Component({
  selector: 'app-create-intro',
  imports: [TuiButton, TuiIcon, TranslatePipe],
  templateUrl: './create-intro.component.html',
  styleUrl: './create-intro.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateIntroComponent {
  readonly #router = inject(Router);
  readonly #state = inject(CardStateService);

  constructor() {
    this.#state.clear();
    this.#router.navigate(['/public/create/intro'], { replaceUrl: true });
  }

  protected start(): void {
    this.#router.navigate(['/public/create/form']);
  }
}
