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

    expect(router.url).toBe('/table?tab=overview');
    expect(fixture.nativeElement.textContent).toContain('A headless table controller');
    expect(activeTabLabel(fixture.nativeElement)).toBe('Overview');
  });

  it('redirects legacy table renderer routes into the renders tab', async () => {
    const { router, fixture } = await renderUrl('/table/plain');

    expect(router.url).toBe('/table?tab=renders&renderer=plain');
    expect(fixture.nativeElement.textContent).toContain('Reference semantic renderer');
  });

  it('selects example content from the canonical query params', async () => {
    const { router, fixture } = await renderUrl('/table?tab=examples&example=renderer-swap');

    expect(router.url).toBe('/table?tab=examples&example=renderer-swap');
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

    expect(router.url).toBe('/wizard?tab=examples&example=renderer-integration');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toContain(
      'http://127.0.0.1:4201/wizard/material?lang=en&renderer=material'
    );
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
