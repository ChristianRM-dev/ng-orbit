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

`@ng-orbit/wizard-kit` is the current public helper package.

Available today:
- `OrbitWizardStepFormSyncDirective`
  - syncs Angular form validity into `orbitWizard`
  - ships no CSS
  - does not own layout or submission behavior

Possible future helpers may exist later, but they are not part of the current public package
contract.

---

## Optional renderers
Renderers are not required, but if present:

- `wizard-render-material`: ready today, maps wizard state to Angular Material UI
- `wizard-render-daisy`: ready today, maps wizard state to DaisyUI/Tailwind UI
- `wizard-render-plain`: planned placeholder in the repo, not consumer-ready today
