# @ng-orbit/wizard-render-material

Angular Material renderer for `@ng-orbit/wizard`.

## Install

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-material
```

This renderer expects Angular Material to be installed in the consuming app.

## When to use it

- You already use Angular Material
- You want a ready-made stepper-like experience
- You still want forms, validity, and submission behavior to stay in the feature layer

## Notes

- Uses Angular Material components
- Talks only to the headless wizard controller
- Expects consumer-owned form content
- No business logic or data fetching

## Local docs

Run `pnpm demo` and open `http://127.0.0.1:4200/wizard?tab=renders&renderer=material`.
