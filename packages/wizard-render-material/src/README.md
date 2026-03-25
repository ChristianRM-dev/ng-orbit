# @ng-orbit/wizard-render-material

Angular Material renderer for `@ng-orbit/wizard`.

## AI Quick Map

- Role: ready Angular Material renderer that maps `orbitWizard` state into a Material stepper shell
- Install: `pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-material @angular/material @angular/cdk @angular/animations`
- Pair with: `@ng-orbit/wizard` and `@ng-orbit/wizard-kit`
- Package owns: Material-based wizard navigation shell and UI-to-command wiring
- Consumer owns: step content, forms, validation rules, routing, persistence, and submission side effects
- Recommended path: use this when your app already uses Angular Material and you want the fastest first wizard UI

## What it is

`@ng-orbit/wizard-render-material` packages a Material-based wizard shell around the headless
wizard controller.

## Install

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-material @angular/material @angular/cdk @angular/animations
```

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
- a ready-to-install first wizard shell for Material teams

## Consumer owns

- step content and forms
- validity rules and submission side effects
- analytics, persistence, and route-level integration

## Primary exports

- `OrbitWizardRenderMaterialComponent` for the ready Angular Material wizard renderer

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

- `@ng-orbit/wizard` for the headless controller
- `@ng-orbit/wizard-kit` for Angular forms validity sync
- `@ng-orbit/wizard-render-daisy` for DaisyUI and Tailwind apps

## Docs links

- Local renderer docs: `http://127.0.0.1:4200/wizard/renders/material`
- Local overview: `http://127.0.0.1:4200/wizard/overview`
- Online renderer docs: `https://christianrm-dev.github.io/ng-orbit/wizard/renders/material`
- Online overview: `https://christianrm-dev.github.io/ng-orbit/wizard/overview`
