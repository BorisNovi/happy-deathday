import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LanguageService } from '@core';
import { ILanguageOption } from '@shared';
import { TUI_DARK_MODE, TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-topbar',
  imports: [TuiButton, TuiDataList, TuiDropdown, TuiIcon],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  protected readonly darkMode = inject(TUI_DARK_MODE);
  readonly #langService = inject(LanguageService);

  protected readonly langOptions = this.#langService.languageOptions;
  protected readonly currentLang = this.#langService.currentLanguageOption;
  protected readonly dropdownOpen = signal(false);

  protected toggleTheme(): void {
    this.darkMode.update(v => !v);
  }

  protected changeLang(opt: ILanguageOption): void {
    this.#langService.changeLanguage(opt.value);
    this.dropdownOpen.set(false);
  }
}
