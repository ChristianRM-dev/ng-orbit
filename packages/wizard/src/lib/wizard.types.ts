export type OrbitWizardStepKind = 'step' | 'summary';

export interface OrbitWizardStepDef {
  id: string;
  title?: string;
  kind?: OrbitWizardStepKind;
  optional?: boolean;
  disabled?: boolean;
  showInNav?: boolean;
}

export interface OrbitWizardStep {
  id: string;
  title?: string;
  kind: OrbitWizardStepKind;
  optional: boolean;
  disabled: boolean;
  showInNav: boolean;
}

export interface OrbitWizardProgress {
  total: number;
  visited: number;
  valid: number;
  completed: number;
  percent: number;
}

export interface OrbitWizardStepChangeEvent {
  fromId: string;
  toId: string;
}

export type OrbitWizardValidityMap = Readonly<Record<string, boolean>>;
