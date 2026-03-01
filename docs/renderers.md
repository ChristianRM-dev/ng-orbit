# Renderers and Kits

## Kits (recommended)
Kits are primitives designed for composition:
- They provide computed UI data and template outlets.
- Consumers decide layout, styling, and which pieces to show.

Examples:
- Wizard kit: nav, progress, footer buttons
- Table kit: header builder, sorting helpers, selection helpers

Kits must not ship CSS.

## Renderers (optional)
Renderers are full UI implementations:
- Plain: semantic HTML
- DaisyUI: class-based styling (requires DaisyUI in the host app)
- Material: uses Angular Material components (requires Material in host app)

Renderers should:
- Be optional dependencies
- Stay thin: mostly mapping core state to framework UI
- Not fetch data directly
- Not own business filtering/sorting rules

## Renderer interaction contract
Renderers must talk to the headless controller only through commands.

Flow:
1) renderer calls controller command (`toggleSort`, `setSearch`, `setPage`, etc.)
2) core controller emits `orbitTableQueryChange`
3) parent/consumer fetches and updates inputs (`rows`, `total`, `loading`, `error`, `query`)
4) renderer reflects updated state

For table renderers:
- `@ng-orbit/table-render-plain` is the reference implementation
- it renders semantic HTML only
- it ships no CSS
- it emits no parent outputs directly (events leave via core controller outputs)

## Rule of thumb
- If consumers frequently want different layouts: ship a kit, not a renderer.
- If you want fast adoption + demos: ship at least plain renderer as reference.
