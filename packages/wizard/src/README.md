# @ng-orbit/wizard

Headless wizard controller for ng-orbit.

## Install

```bash
pnpm add @ng-orbit/wizard
```

Add `@ng-orbit/wizard-kit` if you want the `OrbitWizardStepFormSyncDirective` bridge for Angular forms:

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit
```

## What the package owns

- Current step pointer
- Navigation rules
- Visited/completed state
- Validity state that the consumer can push into the controller

## What the consumer still owns

- Step forms and components
- Validation rules
- Submission and autosave side effects
- Final layout and visual design

## Quickstart

```html
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <form
    [formGroup]="accountForm"
    [orbitWizardStepFormSync]="wizard"
    orbitWizardStepId="account"
    [orbitWizardStepForm]="accountForm"
  >
    <!-- consumer-owned fields -->
  </form>

  <button type="button" [disabled]="!wizard.canNext()" (click)="wizard.next()">
    {{ wizard.isLast() ? 'Finish' : 'Next' }}
  </button>
</section>
```

## Local consumer docs

Run:

```bash
pnpm demo
```

Then open `http://127.0.0.1:4200/wizard`.
