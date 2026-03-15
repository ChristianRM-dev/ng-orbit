import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
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
      'nav.table': 'Table',
      'nav.wizard': 'Wizard',
      'nav.adapters': 'Adapters',
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
