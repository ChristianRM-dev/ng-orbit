# @ng-orbit/wizard-render-daisy

DaisyUI renderer for `@ng-orbit/wizard`.

## AI Quick Map

- Role: ready DaisyUI and Tailwind renderer that maps `orbitWizard` state into a utility-class wizard shell
- Install: `pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-daisy`
- Pair with: `@ng-orbit/wizard` and `@ng-orbit/wizard-kit`
- Package owns: DaisyUI-flavored wizard navigation shell and UI-to-command wiring
- Consumer owns: Tailwind and DaisyUI setup, step content, forms, validation rules, and submission side effects
- Recommended path: use this when your app already has Tailwind and DaisyUI and you want a quick first wizard renderer

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

- DaisyUI and Tailwind-flavored wizard navigation shell
- mapping UI events into `orbitWizard` commands
- a ready-to-install first shell for utility-class-based design systems

## Consumer owns

- step content and forms
- validity rules and submission side effects
- analytics, persistence, and app-specific layout choices

## Primary exports

- `OrbitWizardRenderDaisyComponent` for the ready DaisyUI and Tailwind wizard renderer

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

- `@ng-orbit/wizard` for the headless controller
- `@ng-orbit/wizard-kit` for Angular forms validity sync
- `@ng-orbit/wizard-render-material` for Angular Material apps

## Docs links

- Local renderer docs: `http://127.0.0.1:4200/wizard/renders/daisy`
- Local overview: `http://127.0.0.1:4200/wizard/overview`
- Online renderer docs: `https://christianrm-dev.github.io/ng-orbit/wizard/renders/daisy`
- Online overview: `https://christianrm-dev.github.io/ng-orbit/wizard/overview`
