import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TopbarComponent } from "@shared";

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {}