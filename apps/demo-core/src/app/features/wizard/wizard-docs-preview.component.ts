import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrbitWizardDirective, type OrbitWizardStepDef } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';

export type WizardDocsPreviewVariant =
  | 'custom-render'
  | 'multi-step'
  | 'conditional'
  | 'single-step';

@Component({
  selector: 'ng-orbit-wizard-docs-preview',
  standalone: true,
  imports: [ReactiveFormsModule, OrbitWizardDirective, OrbitWizardStepFormSyncDirective],
  templateUrl: './wizard-docs-preview.component.html',
  styleUrl: './wizard-docs-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardDocsPreviewComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly variant = input<WizardDocsPreviewVariant>('multi-step');

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

  protected readonly includesConditionalCompany = computed(
    () => this.variant() === 'conditional'
  );
  protected readonly isSingleMode = computed(() => this.variant() === 'single-step');
  protected readonly showsCompanyStep = computed(
    () => this.includesConditionalCompany() && this.accountType() === 'business'
  );

  protected readonly title = computed(() => {
    switch (this.variant()) {
      case 'custom-render':
        return 'Build your own layout';
      case 'conditional':
        return 'Conditional business flow';
      case 'single-step':
        return 'Single-step onboarding';
      default:
        return 'Multi-step wizard';
    }
  });

  protected readonly subtitle = computed(() => {
    switch (this.variant()) {
      case 'custom-render':
        return 'A consumer-owned layout wired directly to orbitWizard without any renderer package.';
      case 'conditional':
        return 'Change account type to business and the company step appears without leaving the controller contract.';
      case 'single-step':
        return 'A one-step flow still benefits from the same navigation and completion events.';
      default:
        return 'A linear flow with custom markup, reactive forms, and summary state driven by the controller.';
    }
  });

  protected readonly steps = computed<readonly OrbitWizardStepDef[]>(() => {
    if (this.isSingleMode()) {
      return [
        {
          id: 'single',
          title: 'Profile'
        }
      ];
    }

    const steps: OrbitWizardStepDef[] = [
      {
        id: 'account',
        title: this.includesConditionalCompany() ? 'Account type' : 'Account'
      }
    ];

    if (this.showsCompanyStep()) {
      steps.push({
        id: 'company',
        title: 'Company'
      });
    }

    steps.push(
      {
        id: 'details',
        title: 'Details'
      },
      {
        id: 'summary',
        title: 'Summary',
        kind: 'summary'
      }
    );

    return steps;
  });

  protected onStepChange(): void {
    this.completionMessage.set(null);
  }

  protected onCompleted(): void {
    this.completionMessage.set('Completed. Submission side effects still belong to the consumer.');
  }

  protected nextLabel(wizard: OrbitWizardDirective): string {
    return wizard.isLast() ? 'Finish' : 'Next';
  }
}
