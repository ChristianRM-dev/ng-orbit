import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { afterEach, vi } from 'vitest';
import { TableDemoFacade } from './table-demo.facade';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> {
    return of({
      'table.columns.id': 'ID',
      'table.columns.fullName': 'Full name',
      'table.columns.email': 'Email',
      'table.columns.role': 'Role',
      'table.columns.country': 'Country',
      'table.messages.simulatedError': 'Simulated network error for demo.'
    });
  }
}

describe('TableDemoFacade', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        TableDemoFacade,
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

  it('loads initial rows', async () => {
    vi.useFakeTimers();
    const facade = TestBed.inject(TableDemoFacade);

    expect(facade.loading()).toBe(true);
    await vi.advanceTimersByTimeAsync(400);

    expect(facade.loading()).toBe(false);
    expect(facade.total()).toBeGreaterThan(0);
    expect(facade.rows().length).toBeGreaterThan(0);
  });

  it('handles empty and error scenarios from query changes', async () => {
    vi.useFakeTimers();
    const facade = TestBed.inject(TableDemoFacade);
    await vi.advanceTimersByTimeAsync(400);

    facade.onQueryChange({
      ...facade.query(),
      page: 1,
      search: 'empty'
    });
    await vi.advanceTimersByTimeAsync(400);

    expect(facade.total()).toBe(0);
    expect(facade.rows().length).toBe(0);
    expect(facade.error()).toBeNull();

    facade.onQueryChange({
      ...facade.query(),
      page: 1,
      search: 'error'
    });
    await vi.advanceTimersByTimeAsync(400);

    expect(facade.rows().length).toBe(0);
    expect(facade.error()).toBe('Simulated network error for demo.');
  });
});
