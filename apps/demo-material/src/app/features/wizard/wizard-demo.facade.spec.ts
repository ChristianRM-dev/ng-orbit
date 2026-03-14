import { importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { WizardDemoFacade } from './wizard-demo.facade';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> {
    return of({
      'wizard.steps.account.title': 'Account',
      'wizard.steps.company.title': 'Company',
      'wizard.steps.details.title': 'Details',
      'wizard.steps.summary.title': 'Summary',
      'wizard.steps.single.title': 'Single form',
      'wizard.messages.completed': 'Wizard completed successfully.'
    });
  }
}

describe('WizardDemoFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WizardDemoFacade,
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

  it('starts in multi mode with summary step', () => {
    const facade = TestBed.inject(WizardDemoFacade);

    expect(facade.mode()).toBe('multi');
    expect(facade.steps().map((step) => step.id)).toEqual(['account', 'details', 'summary']);
  });

  it('adds conditional company step for business accounts', () => {
    const facade = TestBed.inject(WizardDemoFacade);

    facade.accountForm.controls.accountType.setValue('business');

    expect(facade.steps().map((step) => step.id)).toEqual([
      'account',
      'company',
      'details',
      'summary'
    ]);
  });

  it('switches to single mode with one step', () => {
    const facade = TestBed.inject(WizardDemoFacade);

    facade.setMode('single');

    expect(facade.steps().map((step) => step.id)).toEqual(['single']);
  });
});
