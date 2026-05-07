import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './public-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent implements OnDestroy {

  ngOnDestroy(): void {
    
  }
}