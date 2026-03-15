# @ng-orbit/wizard-kit

Small composition helpers for `@ng-orbit/wizard`.

## What it is

`@ng-orbit/wizard-kit` is not a renderer package. It currently ships
`OrbitWizardStepFormSyncDirective`, a small Angular forms bridge that keeps a wizard step's
validity aligned with the headless controller.

## Install

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit
```

## Use this when

- your wizard steps are backed by Angular forms
- you want validity updates to flow into `orbitWizard` automatically
- you still want to own the final layout and visual design

## Do not use this when

- you are not using Angular forms
- you want a complete ready-made wizard UI
- you expect the package to create steps, forms, or validation rules for you

## Library owns

- wiring Angular form validity into the wizard controller
- cleanup of the `statusChanges` subscription

## Consumer owns

- the form or control instance
- the step id
- all field UI, validation rules, persistence, and navigation layout

## Smallest working example

```html
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
    Continue
  </button>
</section>
```

## Related packages

- `@ng-orbit/wizard` for the headless controller
- `@ng-orbit/wizard-render-material` for a ready-made Material UI layer
- `@ng-orbit/wizard-render-daisy` for a ready-made DaisyUI/Tailwind UI layer

## Docs host

Run `pnpm demo` and open:
- `http://127.0.0.1:4200/wizard`
- `http://127.0.0.1:4200/adapters`
