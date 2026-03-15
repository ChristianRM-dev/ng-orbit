/**
 * Step kind used by the headless wizard controller.
 */
export type OrbitWizardStepKind = 'step' | 'summary';

/**
 * Consumer-provided step definition accepted by {@link OrbitWizardDirective}.
 *
 * @remarks
 * Missing optional flags are normalized by the controller:
 * - `kind` defaults to `'step'`
 * - `optional` defaults to `false`
 * - `disabled` defaults to `false`
 * - `showInNav` defaults to `true`
 */
export interface OrbitWizardStepDef {
  /**
   * Stable step id used for navigation and validity tracking.
   */
  id: string;
  /**
   * Optional label shown by adapters and renderer packages.
   */
  title?: string;
  /**
   * Distinguishes regular steps from summary-style steps.
   */
  kind?: OrbitWizardStepKind;
  /**
   * Optional steps can proceed even when validity is not explicitly `true`.
   */
  optional?: boolean;
  /**
   * Disabled steps remain in the definition array but are skipped by navigation helpers.
   */
  disabled?: boolean;
  /**
   * Whether the step should appear in navigation UI.
   */
  showInNav?: boolean;
}

/**
 * Normalized step model stored inside the controller.
 */
export interface OrbitWizardStep {
  /**
   * Stable step id.
   */
  id: string;
  /**
   * Optional step label.
   */
  title?: string;
  /**
   * Normalized step kind.
   */
  kind: OrbitWizardStepKind;
  /**
   * Normalized optional flag.
   */
  optional: boolean;
  /**
   * Normalized disabled flag.
   */
  disabled: boolean;
  /**
   * Normalized navigation visibility flag.
   */
  showInNav: boolean;
}

/**
 * Derived progress snapshot exposed by `wizard.progress()`.
 */
export interface OrbitWizardProgress {
  /**
   * Number of enabled steps.
   */
  total: number;
  /**
   * Number of enabled steps visited so far.
   */
  visited: number;
  /**
   * Number of enabled steps currently marked valid.
   */
  valid: number;
  /**
   * Number of enabled steps completed before the current step.
   */
  completed: number;
  /**
   * Rounded completion percentage based on completed enabled steps.
   */
  percent: number;
}

/**
 * Payload emitted by the wizard `stepChange` output.
 */
export interface OrbitWizardStepChangeEvent {
  /**
   * Previous step id.
   */
  fromId: string;
  /**
   * New current step id.
   */
  toId: string;
}

/**
 * Consumer-controlled validity map keyed by step id.
 */
export type OrbitWizardValidityMap = Readonly<Record<string, boolean>>;
