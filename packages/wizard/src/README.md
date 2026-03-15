# @ng-orbit/wizard

Headless wizard controller for Angular applications that want consumer-owned forms, layout,
validation, and submission behavior.

## What it is

`@ng-orbit/wizard` exposes a standalone directive, step types, progress state, and a command
surface for moving through multi-step flows. It does not generate forms, fields, or final UI.

## Install

Core only:

```bash
pnpm add @ng-orbit/wizard
```

Recommended form-backed setup:

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit
```

## Use this when

- your feature layer owns the step forms and final submission flow
- you want reusable navigation state without coupling it to one UI library
- you need linear-by-default step rules with custom rendering

## Do not use this when

- you want a package that creates forms or validations automatically
- you expect submission side effects, autosave, or route guards to be built in
- you want a final UI without building markup or installing a renderer

## Library owns

- current step pointer
- visited and validity state
- derived progress and navigation guards
- completion event semantics

## Consumer owns

- step definitions and content
- forms and validation rules
- persistence, analytics, routing, and submission side effects
- final layout and styling

## Smallest working example

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrbitWizardDirective, type OrbitWizardStepDef } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, OrbitWizardDirective, OrbitWizardStepFormSyncDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
      <form
        [formGroup]="accountForm"
        [orbitWizardStepFormSync]="wizard"
        orbitWizardStepId="account"
        [orbitWizardStepForm]="accountForm"
      >
        <input type="text" formControlName="fullName" />
      </form>

      <button type="button" [disabled]="!wizard.canNext()" (click)="wizard.next()">
        {{ wizard.isLast() ? 'Finish' : 'Next' }}
      </button>
    </section>
  `
})
export class SignupWizardComponent {
  constructor(private readonly formBuilder: FormBuilder) {}

  readonly steps: readonly OrbitWizardStepDef[] = [
    { id: 'account', title: 'Account' },
    { id: 'summary', title: 'Summary', kind: 'summary' }
  ];

  readonly accountForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]]
  });

  submit(): void {
    // The controller only emits completion. Persist data here.
  }
}
```

## Related packages

- `@ng-orbit/wizard-kit` for Angular forms validity sync
- `@ng-orbit/wizard-render-material` for Angular Material apps
- `@ng-orbit/wizard-render-daisy` for DaisyUI/Tailwind apps

## Docs host

Run `pnpm demo` and open:
- `http://127.0.0.1:4200/wizard`
- `http://127.0.0.1:4200/adapters`
