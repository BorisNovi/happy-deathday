import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TuiButton } from "@taiga-ui/core";
import { TUI_DARK_MODE } from "@taiga-ui/core/tokens";

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, TuiButton],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {
  protected readonly darkMode = inject(TUI_DARK_MODE);

  protected toggle(): void {
    this.darkMode.update(v => !v);
  }
}