# @ng-orbit/table-render-material

Angular Material renderer for `@ng-orbit/table`.

## Install

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-material
```

This renderer expects Angular Material to be installed in the consuming app.

## When to use it

- Your product already uses Angular Material
- You want a fast adoption path without inventing table markup on day one
- You still want the feature layer to own backend interaction and query mapping

## Notes

- Uses Angular Material components
- Calls only core controller commands
- No data fetching logic
- No business sorting or filtering logic

## Local docs

Run `pnpm demo` and open `http://127.0.0.1:4200/table?tab=renders&renderer=material`.
