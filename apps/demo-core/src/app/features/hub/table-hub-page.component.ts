import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DemoI18nService } from '../../core/i18n/demo-i18n.service';
import { RemoteIframePageComponent } from '../remote/remote-iframe-page.component';
import { TableCorePageComponent } from '../table/table-core-page.component';
import { TablePlainPageComponent } from '../table/table-plain-page.component';

type TableRenderer = 'core' | 'plain' | 'material' | 'daisy';

interface RendererTab {
  readonly id: TableRenderer;
  readonly labelKey: string;
}

const TABLE_RENDERERS: readonly TableRenderer[] = ['core', 'plain', 'material', 'daisy'];

@Component({
  selector: 'ng-orbit-table-hub-page',
  standalone: true,
  imports: [
    TranslatePipe,
    RemoteIframePageComponent,
    TableCorePageComponent,
    TablePlainPageComponent
  ],
  templateUrl: './table-hub-page.component.html',
  styleUrl: './table-hub-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableHubPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly i18nService = inject(DemoI18nService);
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap
  });
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });

  protected readonly tabs: readonly RendererTab[] = [
    { id: 'core', labelKey: 'renderers.core' },
    { id: 'plain', labelKey: 'renderers.plain' },
    { id: 'material', labelKey: 'renderers.material' },
    { id: 'daisy', labelKey: 'renderers.daisy' }
  ];

  protected readonly activeLanguage = this.i18nService.language;
  protected readonly renderer = computed<TableRenderer>(() =>
    this.resolveRenderer(this.queryParamMap().get('renderer'))
  );

  constructor() {
    effect(() => {
      this.ensureCanonicalRoute();
    });
  }

  protected selectRenderer(renderer: TableRenderer): void {
    void this.router.navigate(['/table'], {
      queryParams: { renderer },
      queryParamsHandling: 'merge'
    });
  }

  private resolveRenderer(value: string | null): TableRenderer {
    if (value && TABLE_RENDERERS.includes(value as TableRenderer)) {
      return value as TableRenderer;
    }

    const fallbackFromRoute = this.routeData()['renderer'] as string | undefined;
    if (
      fallbackFromRoute &&
      TABLE_RENDERERS.includes(fallbackFromRoute as TableRenderer)
    ) {
      return fallbackFromRoute as TableRenderer;
    }

    return 'plain';
  }

  private ensureCanonicalRoute(): void {
    const currentPath = this.route.snapshot.routeConfig?.path ?? '';
    const currentQueryRenderer = this.queryParamMap().get('renderer');
    const resolvedRenderer = this.renderer();

    if (currentPath !== 'table' || currentQueryRenderer !== resolvedRenderer) {
      void this.router.navigate(['/table'], {
        queryParams: { renderer: resolvedRenderer },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }
}
