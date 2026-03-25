import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DemoI18nService, type DemoLanguage } from '../core/i18n/demo-i18n.service';
import { BrandMarkComponent } from './brand-mark.component';

interface NavItem {
  readonly path: string;
  readonly labelKey: string;
}

@Component({
  selector: 'ng-orbit-demo-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe, BrandMarkComponent],
  templateUrl: './demo-shell.component.html',
  styleUrl: './demo-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoShellComponent {
  private readonly i18nService = inject(DemoI18nService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly navItems: readonly NavItem[] = [
    { path: '/home', labelKey: 'nav.home' },
    { path: '/table', labelKey: 'nav.table' },
    { path: '/wizard', labelKey: 'nav.wizard' },
    { path: '/notify', labelKey: 'nav.notify' },
    { path: '/adapters', labelKey: 'nav.adapters' }
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

  protected async setLanguage(language: DemoLanguage): Promise<void> {
    await this.i18nService.setLanguage(language);

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        lang: language === 'es' ? 'es' : null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
