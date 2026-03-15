import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  readonly path: string;
  readonly labelKey: string;
}

@Component({
  selector: 'ng-orbit-demo-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './demo-shell.component.html',
  styleUrl: './demo-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoShellComponent {
  protected readonly navItems: readonly NavItem[] = [
    { path: '/table', labelKey: 'Table' },
    { path: '/wizard', labelKey: 'Wizard' },
    { path: '/adapters', labelKey: 'Adapters' }
  ];

  private readonly sidebarOpen = signal(false);
  protected readonly isSidebarOpen = computed(() => this.sidebarOpen());

  protected toggleSidebar(): void {
    this.sidebarOpen.update((value) => !value);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
