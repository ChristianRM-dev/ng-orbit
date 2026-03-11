import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DemoI18nService, type DemoLanguage } from '../core/i18n/demo-i18n.service';

interface NavItem {
  readonly path: string;
  readonly labelKey: string;
}

@Component({
  selector: 'ng-orbit-daisy-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  templateUrl: './demo-shell.component.html',
  styleUrl: './demo-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoShellComponent {
  private readonly i18nService = inject(DemoI18nService);

  protected readonly navItems: readonly NavItem[] = [
    { path: '/table/daisy', labelKey: 'nav.tableDaisy' },
    { path: '/wizard/daisy', labelKey: 'nav.wizardDaisy' }
  ];

  private readonly sidebarOpen = signal(false);
  protected readonly isSidebarOpen = computed(() => this.sidebarOpen());
  protected readonly activeLanguage = this.i18nService.language;

  protected toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected setLanguage(language: DemoLanguage): void {
    this.i18nService.setLanguage(language);
  }
}
