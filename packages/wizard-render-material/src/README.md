# @ng-orbit/wizard-render-material

Angular Material renderer for `@ng-orbit/wizard`.

## What it is

`@ng-orbit/wizard-render-material` packages a Material-based wizard shell around the headless
wizard controller.

## Install

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-material
```

This package expects Angular Material to already exist in the consuming app.

## Use this when

- your product already uses Angular Material
- you want a ready-made first wizard UI
- you still want forms, validity, and submission behavior to stay in the feature layer

## Do not use this when

- you expect the renderer to create forms or validations automatically
- you want the renderer to own submission or persistence
- your product does not use Angular Material

## Library owns

- Material-based wizard navigation shell
- mapping UI events into `orbitWizard` commands

## Consumer owns

- step content and forms
- validity rules and submission side effects
- analytics, persistence, and route-level integration

## Smallest working example

```html
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <orbit-wizard-render-material [wizard]="wizard">
    <form
      [formGroup]="accountForm"
      [orbitWizardStepFormSync]="wizard"
      orbitWizardStepId="account"
      [orbitWizardStepForm]="accountForm"
    >
      <!-- consumer-owned fields -->
    </form>
  </orbit-wizard-render-material>
</section>
```

## Related packages

- `@ng-orbit/wizard`
- `@ng-orbit/wizard-kit`
- `@ng-orbit/wizard-render-daisy`

## Docs host

Run `pnpm demo` and open `http://127.0.0.1:4200/wizard/renders/material`.
