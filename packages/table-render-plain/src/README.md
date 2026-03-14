# @ng-orbit/table-render-plain

Reference plain renderer for `@ng-orbit/table`.

## Install

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-plain
```

## When to use it

- You want the fastest possible reference integration
- You want semantic HTML without a UI framework dependency
- You plan to fork the markup later but need a clean baseline today

## Notes

- Semantic HTML table
- No CSS shipped
- Calls only `orbitTable` controller commands
- Still expects the parent to own fetching, errors, and query handling

## Local docs

Run `pnpm demo` and open `http://127.0.0.1:4200/table?tab=renders&renderer=plain`.
