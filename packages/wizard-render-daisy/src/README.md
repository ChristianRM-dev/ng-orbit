# @ng-orbit/wizard-render-daisy

DaisyUI renderer for `@ng-orbit/wizard`.

## Install

```bash
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-daisy
```

This renderer expects Tailwind + DaisyUI to exist in the consuming app.

## When to use it

- Your product already uses DaisyUI or Tailwind utility classes
- You want a fast renderer for multi-step flows
- You want the renderer to stay presentation-only while forms remain yours

## Notes

- Uses Tailwind + Daisy classes from the host app
- Talks only to the headless wizard controller
- Expects consumer-owned form content
- No business logic or data fetching

## Local docs

Run `pnpm demo` and open `http://127.0.0.1:4200/wizard?tab=renders&renderer=daisy`.
