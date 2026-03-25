import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideOrbitNotify } from '@ng-orbit/notify';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from '../../app.component';
import { appRoutes } from '../../app.routes';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> {
    return of({
      'layout.title': 'ng-orbit Docs',
      'layout.subtitle': 'Editorial docs for headless Angular primitives.',
      'layout.brandCaption': 'Editorial Orbit docs host',
      'layout.navigation': 'Main navigation',
      'layout.language': 'Language',
      'layout.openMenu': 'Open menu',
      'layout.closeMenu': 'Close menu',
      'nav.home': 'Home',
      'nav.table': 'Table',
      'nav.wizard': 'Wizard',
      'nav.notify': 'Notify',
      'nav.adapters': 'Adapters',
      'home.hero.eyebrow': 'Start here',
      'home.hero.title': 'Headless Angular primitives for product-owned UI',
      'home.hero.summary':
        'ng-orbit gives teams stable controllers for tables, wizards, and notifications without taking over data flow, forms, or the final interface.',
      'home.hero.tagline':
        'Use the core packages when you want total control, add renderer packages when you want a faster starting point, and rely on adapters to keep the boundary clean across design systems.',
      'home.hero.primaryCta': 'Explore table docs',
      'home.hero.secondaryCta': 'Understand adapters',
      'home.stats.headless.value': '3',
      'home.stats.headless.label': 'Headless packages',
      'home.stats.helpers.value': '1',
      'home.stats.helpers.label': 'Helper kit',
      'home.stats.renderers.value': '6',
      'home.stats.renderers.label': 'Ready renderers',
      'home.packageMap.eyebrow': 'Ready today',
      'home.packageMap.title': 'Package map',
      'home.packageMap.summary':
        'Mix headless controllers, one small helper kit, and renderer packages based on how much UI you want ng-orbit to provide.',
      'home.packageMap.groups.headless': 'Headless controllers',
      'home.packageMap.groups.helpers': 'Helper kit',
      'home.packageMap.groups.renderers': 'Renderer packages',
      'home.pillars.headless.eyebrow': 'Core first',
      'home.pillars.headless.title': 'State without markup',
      'home.pillars.headless.body':
        'OrbitTable, OrbitWizard, and OrbitNotify own normalized state, commands, and signals while your product continues to own how things look and behave.',
      'home.pillars.renderers.eyebrow': 'Fast path',
      'home.pillars.renderers.title': 'Renderers when you want a running start',
      'home.pillars.renderers.body':
        'Plain, Material, and Daisy renderers stay thin on purpose: they read controller state and call commands without swallowing your business logic.',
      'home.pillars.adapters.eyebrow': 'Integration model',
      'home.pillars.adapters.title': 'Adapters keep the seam explicit',
      'home.pillars.adapters.body':
        'An adapter is the narrow layer between ng-orbit state and your UI. That seam lets teams adopt the library inside existing design systems instead of rewriting around it.',
      'home.ownership.eyebrow': 'Ownership model',
      'home.ownership.title': 'What ng-orbit owns and what stays in your app',
      'home.ownership.summary':
        'The quickest way to understand the library is to look at the boundary. ng-orbit centralizes reusable controller logic; your feature keeps everything product-specific.',
      'home.ownership.library.title': 'ng-orbit owns',
      'home.ownership.library.points.state':
        'Controller state for query, selection, navigation, completion, and notification queues.',
      'home.ownership.library.points.commands':
        'Normalized commands, outputs, and template-friendly signals.',
      'home.ownership.library.points.contracts':
        'Stable UI contracts that renderers or custom markup can sit on top of.',
      'home.ownership.app.title': 'Your app owns',
      'home.ownership.app.points.data':
        'Fetching rows, mapping APIs, persistence, and analytics.',
      'home.ownership.app.points.forms': 'Forms, validation rules, and step content.',
      'home.ownership.app.points.rules':
        'Styling, business logic, empty states, side effects, and all product decisions.',
      'home.quickLinks.eyebrow': 'Docs paths',
      'home.quickLinks.title': 'Start where your team needs help',
      'home.quickLinks.summary':
        'Jump into the section that matches the decision you are making today.',
      'home.quickLinks.cards.table.eyebrow': 'Headless table',
      'home.quickLinks.cards.table.title': 'Table',
      'home.quickLinks.cards.table.body':
        'See how OrbitTable handles query intent and selection while your feature keeps control of data loading and row layout.',
      'home.quickLinks.cards.wizard.eyebrow': 'Headless flow',
      'home.quickLinks.cards.wizard.title': 'Wizard',
      'home.quickLinks.cards.wizard.body':
        'Learn how OrbitWizard coordinates navigation and completion while your forms and business rules stay local.',
      'home.quickLinks.cards.notify.eyebrow': 'Headless notifications',
      'home.quickLinks.cards.notify.title': 'Notify',
      'home.quickLinks.cards.notify.body':
        'Explore the app-wide toast and confirm service that keeps timing and queue behavior headless while your feature owns the side effects.',
      'home.quickLinks.cards.adapters.eyebrow': 'Integration seam',
      'home.quickLinks.cards.adapters.title': 'Adapters',
      'home.quickLinks.cards.adapters.body':
        'Understand the thin layer between controller state and product UI, plus when renderers or helper kits fit.',
      'home.quickLinks.cta': 'Open guide',
      'docs.shared.tabNav': 'Documentation tabs',
      'docs.shared.livePreview': 'Live preview',
      'docs.shared.copy': 'Copy',
      'docs.shared.copied': 'Copied',
      'table.columns.id': 'ID',
      'table.columns.fullName': 'Full name',
      'table.columns.email': 'Email',
      'table.columns.role': 'Role',
      'table.columns.country': 'Country',
      'table.controls.search': 'Search',
      'table.controls.select': 'Select',
      'table.states.loading': 'Loading...',
      'table.states.empty': 'No rows',
      'table.pagination.prev': 'Prev',
      'table.pagination.next': 'Next',
      'table.pagination.page': 'Page',
      'table.pagination.pageSize': 'Page size',
      'table.messages.simulatedError': 'Simulated network error for demo.',
      'remote.missingManifest': 'Remote manifest is unavailable.',
      'remote.unavailable': 'Remote app is unreachable.'
    });
  }
}

describe('docs host', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideOrbitNotify(),
        provideRouter(appRoutes),
        provideZonelessChangeDetection(),
        importProvidersFrom(
          TranslateModule.forRoot({
            fallbackLang: 'en',
            loader: {
              provide: TranslateLoader,
              useClass: StaticTranslateLoader
            }
          })
        )
      ]
    });
  });

  it('canonicalizes /table to the overview tab', async () => {
    const { router, fixture } = await renderUrl('/table');

    expect(router.url).toBe('/table/overview');
    expect(fixture.nativeElement.textContent).toContain('A headless table controller');
    expect(activeTabLabel(fixture.nativeElement)).toBe('Overview');
  });

  it('redirects legacy table renderer routes into the renders tab', async () => {
    const { router, fixture } = await renderUrl('/table/plain');

    expect(router.url).toBe('/table/renders/plain');
    expect(fixture.nativeElement.textContent).toContain('Reference semantic renderer');
  });

  it('selects example content from the canonical query params', async () => {
    const { router, fixture } = await renderUrl('/table?tab=examples&example=renderer-swap');

    expect(router.url).toBe('/table/examples/renderer-swap');
    expect(fixture.nativeElement.textContent).toContain(
      'Swap renderers without rewriting the feature contract'
    );
    expect(activeTabLabel(fixture.nativeElement)).toBe('Examples');
  });

  it('renders the material table iframe preview from canonical query params', async () => {
    const { fixture } = await renderUrl('/table?tab=renders&renderer=material');
    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;

    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toContain(
      'http://127.0.0.1:4201/table/material?lang=en&renderer=material'
    );
  });

  it('renders the renderer integration example iframe for wizard docs', async () => {
    const { router, fixture } = await renderUrl(
      '/wizard?tab=examples&example=renderer-integration'
    );
    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement | null;

    expect(router.url).toBe('/wizard/examples/renderer-integration');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toContain(
      'http://127.0.0.1:4201/wizard/material?lang=en&renderer=material'
    );
  });

  it('canonicalizes /adapters and renders the concept hero blocks', async () => {
    const { router, fixture } = await renderUrl('/adapters');

    expect(router.url).toBe('/adapters/overview');
    expect(fixture.nativeElement.textContent).toContain('Adapters are the thin integration layer');
    expect(fixture.nativeElement.textContent).toContain('Principles');
    expect(fixture.nativeElement.textContent).toContain('Package map');
    expect(fixture.nativeElement.textContent).toContain('Table + Material');
    expect(fixture.nativeElement.textContent).toContain('Table + Daisy');
    expect(fixture.nativeElement.textContent).toContain('Wizard + Material');
    expect(fixture.nativeElement.textContent).toContain('Wizard + Daisy');
    expect(activeTabLabel(fixture.nativeElement)).toBe('Overview');
  });

  it('canonicalizes /notify and renders the notify overview docs', async () => {
    const { router, fixture } = await renderUrl('/notify');

    expect(router.url).toBe('/notify/overview');
    expect(fixture.nativeElement.textContent).toContain(
      'A headless notification service for Angular apps'
    );
    expect(activeTabLabel(fixture.nativeElement)).toBe('Overview');
  });

  it('renders the notify plain renderer docs preview', async () => {
    const { router, fixture } = await renderUrl('/notify/plain');

    expect(router.url).toBe('/notify/renders/plain');
    expect(fixture.nativeElement.textContent).toContain('Global notify preview');
    expect(fixture.nativeElement.textContent).toContain('Renderer mounted globally');
  });

  it('renames the renders tab to patterns for the adapters guide', async () => {
    const { router, fixture } = await renderUrl('/adapters/patterns/kit-composition');

    expect(router.url).toBe('/adapters/patterns/kit-composition');
    expect(activeTabLabel(fixture.nativeElement)).toBe('Patterns');
    expect(fixture.nativeElement.textContent).toContain('Kit-assisted composition');
    expect(fixture.nativeElement.textContent).toContain('Optional helper');
  });

  it('renders highlighted code tokens for shared docs snippets', async () => {
    const { fixture } = await renderUrl('/table');
    const highlightedToken = fixture.nativeElement.querySelector(
      '.ng-orbit-code__body .token.keyword'
    ) as HTMLElement | null;

    expect(highlightedToken).not.toBeNull();
  });

  it('redirects the root url to the new home page', async () => {
    const { router, fixture } = await renderUrl('/');

    expect(router.url).toBe('/home');
    expect(fixture.nativeElement.textContent).toContain(
      'Headless Angular primitives for product-owned UI'
    );
    expect(fixture.nativeElement.textContent).toContain(
      'What ng-orbit owns and what stays in your app'
    );
    expect(fixture.nativeElement.textContent).toContain('Notify');
  });
});

async function renderUrl(url: string): Promise<{
  readonly fixture: ComponentFixture<AppComponent>;
  readonly router: Router;
}> {
  const router = TestBed.inject(Router);
  const fixture = TestBed.createComponent(AppComponent);

  await router.navigateByUrl(url);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return { fixture, router };
}

function activeTabLabel(root: HTMLElement): string | null {
  return root.querySelector('.ng-orbit-docs__tab--active')?.textContent?.trim() ?? null;
}
