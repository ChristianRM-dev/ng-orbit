# Wizard (headless) specification

Package: `@ng-orbit/wizard`

## Goal
Provide a headless wizard controller that manages step navigation and exposes
signals-based state. The consumer owns:
- step components/forms
- validation logic and UI layout
- optional summary step implementation

Wizard only manages:
- current step pointer
- visited/completed
- navigation rules (canNext/canPrev/canGoTo)
- step validity state (consumer informs the wizard)

No CSS. No form ownership.

---

## Public API (contract)

### Step model
```ts
export type OrbitWizardStepKind = 'step' | 'summary';

export interface OrbitWizardStepDef {
  id: string;
  title?: string;
  kind?: OrbitWizardStepKind; // default: 'step'
  optional?: boolean;         // default: false
  disabled?: boolean;         // default: false
  showInNav?: boolean;        // default: true
}
```

### Controller / template API
Wizard is exposed via `exportAs="orbitWizard"`.

Signals (read):
- `steps(): readonly OrbitWizardStepDef[]`
- `index(): number`
- `current(): OrbitWizardStepDef`
- `isFirst(): boolean`
- `isLast(): boolean`
- `visited(): ReadonlySet<string>`
- `validity(): Readonly<Record<string, boolean>>`
- `progress(): { total: number; visited: number; valid: number; completed: number; percent: number }`
- `canPrev(): boolean`
- `canNext(): boolean`
- `canGoTo(stepId: string): boolean`

Commands (write):
- `next(): void`
- `prev(): void`
- `goTo(stepId: string): void`
- `goToIndex(index: number): void`
- `reset(): void`
- `setValid(stepId: string, valid: boolean): void`

Inputs:
- `steps: OrbitWizardStepDef[]` (required)
- `initialStepId?: string` (default: first enabled step)
- `linear?: boolean` (default: true)

Events (optional outputs):
- `stepChange` (fromId, toId)
- `completed`

---

## Navigation rules

### Step availability
A step is enabled if `disabled !== true`.

Initial step selection:
- use `initialStepId` if enabled, else first enabled step
- if no enabled steps: throw a clear error in dev-mode and keep stable state

### next()
- If current is last enabled step:
  - emit `completed` (optional) and remain on last step
- Else move to next enabled step

### prev()
- move to previous enabled step if exists, else no-op

### canNext
True when:
- current step is optional, OR
- current step validity is true, OR
- current step kind === 'summary' (UI can show Finish)

### canGoTo(stepId)
- disabled => false
- if `linear === false`: true (unless disabled)
- if `linear === true`:
  - can go to visited steps
  - can go to current step
  - future jumps are disallowed by default (v1)

---

## Optional package: `@ng-orbit/wizard-kit`

Kits are template-first primitives. They must not ship CSS.

### Components (proposed)
1) `<orbit-wizard-nav [wizard]="w">`
- Exposes nav items: `{ step, index, isCurrent, isVisited, isValid, isDisabled, canGoTo }`
- Template outlets for full markup control

2) `<orbit-wizard-progress [wizard]="w">`
- Exposes `progress()` signal for percent + counts
- Template outlet for custom progress UI

3) `<orbit-wizard-footer [wizard]="w">`
- Exposes `canPrev`, `canNext`, `isFirst`, `isLast`
- Template outlet for custom buttons

---

## Optional renderers
Renderers are not required, but if present:

- `wizard-render-plain`: semantic HTML (no CSS), reference implementation
- `wizard-render-daisy`: DaisyUI classes only (no CSS), requires Tailwind+Daisy in host
- `wizard-render-material`: maps wizard state to `mat-stepper`, Material as peer deps
