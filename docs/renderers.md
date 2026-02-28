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

## Rule of thumb
- If consumers frequently want different layouts: ship a kit, not a renderer.
- If you want fast adoption + demos: ship at least plain renderer as reference.
