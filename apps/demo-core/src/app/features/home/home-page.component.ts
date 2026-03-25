import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BrandMarkComponent } from '../../layout/brand-mark.component';

type HomeStatId = 'headless' | 'helpers' | 'renderers';
type HomePillarId = 'headless' | 'renderers' | 'adapters';
type OwnershipSideId = 'library' | 'app';
type HomeLinkId = 'table' | 'wizard' | 'notify' | 'adapters';

interface HomeStat {
  readonly id: HomeStatId;
}

interface PackageGroup {
  readonly id: 'headless' | 'helpers' | 'renderers';
  readonly titleKey: string;
  readonly packages: readonly string[];
}

interface QuickLink {
  readonly id: HomeLinkId;
  readonly path: string;
}

@Component({
  selector: 'ng-orbit-home-page',
  standalone: true,
  imports: [RouterLink, TranslatePipe, BrandMarkComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  protected readonly stats: readonly HomeStat[] = [
    { id: 'headless' },
    { id: 'helpers' },
    { id: 'renderers' }
  ];

  protected readonly packageGroups: readonly PackageGroup[] = [
    {
      id: 'headless',
      titleKey: 'home.packageMap.groups.headless',
      packages: ['@ng-orbit/table', '@ng-orbit/wizard', '@ng-orbit/notify']
    },
    {
      id: 'helpers',
      titleKey: 'home.packageMap.groups.helpers',
      packages: ['@ng-orbit/wizard-kit']
    },
    {
      id: 'renderers',
      titleKey: 'home.packageMap.groups.renderers',
      packages: [
        '@ng-orbit/table-render-plain',
        '@ng-orbit/table-render-material',
        '@ng-orbit/table-render-daisy',
        '@ng-orbit/wizard-render-material',
        '@ng-orbit/wizard-render-daisy',
        '@ng-orbit/notify-render-plain'
      ]
    }
  ];

  protected readonly pillars: readonly HomePillarId[] = ['headless', 'renderers', 'adapters'];
  protected readonly ownershipSides: readonly OwnershipSideId[] = ['library', 'app'];
  protected readonly ownershipPointKeys: Readonly<Record<OwnershipSideId, readonly string[]>> = {
    library: ['state', 'commands', 'contracts'],
    app: ['data', 'forms', 'rules']
  };
  protected readonly quickLinks: readonly QuickLink[] = [
    {
      id: 'table',
      path: '/table'
    },
    {
      id: 'wizard',
      path: '/wizard'
    },
    {
      id: 'notify',
      path: '/notify'
    },
    {
      id: 'adapters',
      path: '/adapters'
    }
  ] as const;
}
