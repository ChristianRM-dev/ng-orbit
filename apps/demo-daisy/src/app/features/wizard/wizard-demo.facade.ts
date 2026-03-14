import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import type { OrbitWizardStepDef } from '@ng-orbit/wizard';
import { TranslateService } from '@ngx-translate/core';
import { DemoI18nService } from '../../core/i18n/demo-i18n.service';

export type WizardDemoMode = 'multi' | 'single';

@Injectable()
export class WizardDemoFacade {
  private readonly formBuilder = inject(FormBuilder);
  private readonly translateService = inject(TranslateService);
  private readonly i18nService = inject(DemoI18nService);

  readonly mode = signal<WizardDemoMode>('multi');
  readonly completionCount = signal(0);
  readonly completionMessage = signal<string | null>(null);

  readonly accountForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    accountType: ['personal' as 'personal' | 'business', Validators.required]
  });

  readonly companyForm = this.formBuilder.nonNullable.group({
    companyName: ['', [Validators.required, Validators.minLength(2)]]
  });

  readonly detailsForm = this.formBuilder.nonNullable.group({
    country: ['', Validators.required],
    city: ['', Validators.required]
  });

  readonly singleForm = this.formBuilder.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  private readonly accountType = toSignal(this.accountForm.controls.accountType.valueChanges, {
    initialValue: this.accountForm.controls.accountType.value
  });

  readonly showCompanyStep = computed(() => this.accountType() === 'business');

  readonly multiSteps = computed<readonly OrbitWizardStepDef[]>(() => {
    this.i18nService.language();

    const steps: OrbitWizardStepDef[] = [
      {
        id: 'account',
        title: this.translateService.instant('wizard.steps.account.title')
      }
    ];

    if (this.showCompanyStep()) {
      steps.push({
        id: 'company',
        title: this.translateService.instant('wizard.steps.company.title')
      });
    }

    steps.push(
      {
        id: 'details',
        title: this.translateService.instant('wizard.steps.details.title')
      },
      {
        id: 'summary',
        title: this.translateService.instant('wizard.steps.summary.title'),
        kind: 'summary'
      }
    );

    return steps;
  });

  readonly singleSteps = computed<readonly OrbitWizardStepDef[]>(() => {
    this.i18nService.language();

    return [
      {
        id: 'single',
        title: this.translateService.instant('wizard.steps.single.title')
      }
    ];
  });

  readonly steps = computed<readonly OrbitWizardStepDef[]>(() =>
    this.mode() === 'single' ? this.singleSteps() : this.multiSteps()
  );

  readonly isSingleMode = computed(() => this.mode() === 'single');

  setMode(mode: WizardDemoMode): void {
    if (this.mode() === mode) {
      return;
    }

    this.mode.set(mode);
    this.completionMessage.set(null);
  }

  onStepChange(): void {
    this.completionMessage.set(null);
  }

  onCompleted(): void {
    this.completionCount.update((value) => value + 1);
    this.completionMessage.set(this.translateService.instant('wizard.messages.completed'));
  }
}
