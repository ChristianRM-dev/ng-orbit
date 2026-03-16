# @ng-orbit/wizard-render-daisy

DaisyUI renderer for `@ng-orbit/wizard`.

## What it is

`@ng-orbit/wizard-render-daisy` packages a DaisyUI/Tailwind-flavored wizard shell around the
headless wizard controller.

## Install

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-daisy
```

This package expects Tailwind and DaisyUI to already exist in the consuming app.

## Use this when

- your product already uses DaisyUI or Tailwind utility classes
- you want a fast first wizard renderer
- you still want forms and submission behavior to stay in the feature layer

## Do not use this when

- you expect the renderer to create forms or validations automatically
- you want renderer-owned submission or backend logic
- your host app does not provide Tailwind and DaisyUI

## Library owns

- DaisyUI/Tailwind-flavored wizard navigation shell
- mapping UI events into `orbitWizard` commands

## Consumer owns

- step content and forms
- validity rules and submission side effects
- analytics, persistence, and app-specific layout choices

## Smallest working example

```html
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <orbit-wizard-render-daisy [wizard]="wizard">
    <form
      [formGroup]="detailsForm"
      [orbitWizardStepFormSync]="wizard"
      orbitWizardStepId="details"
      [orbitWizardStepForm]="detailsForm"
    >
      <!-- consumer-owned fields -->
    </form>
  </orbit-wizard-render-daisy>
</section>
```

## Related packages

- `@ng-orbit/wizard`
- `@ng-orbit/wizard-kit`
- `@ng-orbit/wizard-render-material`

## Docs host

Run `pnpm demo` and open `http://127.0.0.1:4200/wizard/renders/daisy`.
