# @ng-orbit/table-render-daisy

DaisyUI renderer for `@ng-orbit/table`.

## Install

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-daisy
```

This renderer expects Tailwind + DaisyUI to exist in the consuming app.

## When to use it

- Your team already ships DaisyUI or Tailwind utility classes
- You want a quick renderer without locking data flow into the UI layer
- You prefer class-based styling over a component framework

## Notes

- Uses Tailwind + Daisy classes from the host app
- Calls only core controller commands
- No data fetching logic
- No business sorting or filtering logic

## Local docs

Run `pnpm demo` and open `http://127.0.0.1:4200/table?tab=renders&renderer=daisy`.
