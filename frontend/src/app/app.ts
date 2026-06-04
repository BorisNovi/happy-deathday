import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetrikaService } from '@core';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  constructor() {
    inject(MetrikaService);
  }
}
