import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DemoI18nService } from '../../core/i18n/demo-i18n.service';
import { RemoteIframePageComponent } from '../remote/remote-iframe-page.component';
import { WizardPlaceholderPageComponent } from '../wizard/wizard-placeholder-page.component';

type WizardRenderer = 'core' | 'material' | 'daisy';

interface RendererTab {
  readonly id: WizardRenderer;
  readonly labelKey: string;
}

const WIZARD_RENDERERS: readonly WizardRenderer[] = ['core', 'material', 'daisy'];

@Component({
  selector: 'ng-orbit-wizard-hub-page',
  standalone: true,
  imports: [TranslatePipe, RemoteIframePageComponent, WizardPlaceholderPageComponent],
  templateUrl: './wizard-hub-page.component.html',
  styleUrl: './wizard-hub-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardHubPageComponent {
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
    { id: 'material', labelKey: 'renderers.material' },
    { id: 'daisy', labelKey: 'renderers.daisy' }
  ];

  protected readonly activeLanguage = this.i18nService.language;
  protected readonly renderer = computed<WizardRenderer>(() =>
    this.resolveRenderer(this.queryParamMap().get('renderer'))
  );

  constructor() {
    effect(() => {
      this.ensureCanonicalRoute();
    });
  }

  protected selectRenderer(renderer: WizardRenderer): void {
    void this.router.navigate(['/wizard'], {
      queryParams: { renderer },
      queryParamsHandling: 'merge'
    });
  }

  private resolveRenderer(value: string | null): WizardRenderer {
    if (value && WIZARD_RENDERERS.includes(value as WizardRenderer)) {
      return value as WizardRenderer;
    }

    const fallbackFromRoute = this.routeData()['renderer'] as string | undefined;
    if (
      fallbackFromRoute &&
      WIZARD_RENDERERS.includes(fallbackFromRoute as WizardRenderer)
    ) {
      return fallbackFromRoute as WizardRenderer;
    }

    return 'core';
  }

  private ensureCanonicalRoute(): void {
    const currentPath = this.route.snapshot.routeConfig?.path ?? '';
    const currentQueryRenderer = this.queryParamMap().get('renderer');
    const resolvedRenderer = this.renderer();

    if (currentPath !== 'wizard' || currentQueryRenderer !== resolvedRenderer) {
      void this.router.navigate(['/wizard'], {
        queryParams: { renderer: resolvedRenderer },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }
}
