import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core';
import { ILanguageOption } from '@shared';
import { TUI_DARK_MODE, TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-topbar',
  imports: [TuiButton, TuiDataList, TuiDropdown, TuiIcon, TranslatePipe],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  protected readonly darkMode = inject(TUI_DARK_MODE);
  readonly #langService = inject(LanguageService);
  readonly #router = inject(Router);

  protected readonly langOptions = this.#langService.languageOptions;
  protected readonly currentLang = this.#langService.currentLanguageOption;
  protected readonly dropdownOpen = signal(false);

  protected toggleTheme(): void {
    this.darkMode.update(v => !v);
  }

  protected changeLang(opt: ILanguageOption): void {
    const langPattern = this.#langService.availableLanguages.join('|');
    const newUrl = this.#router.url.replace(new RegExp(`^/(${langPattern})`), `/${opt.value}`);
    this.#router.navigateByUrl(newUrl);
    this.dropdownOpen.set(false);
  }
}
