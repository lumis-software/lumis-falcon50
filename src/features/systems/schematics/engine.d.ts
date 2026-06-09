import type { ComponentType } from "react";

export interface Scenario {
  id: string;
  label: string;
  desc: string;
}

export interface SwitchOption {
  v: string;
  l: string;
}

export interface SystemSwitch {
  id: string;
  label: string;
  def: string;
  options: SwitchOption[];
}

export interface SystemComponent {
  name: string;
  info: string;
}

export type ComputedState = Record<string, unknown>;

export interface RenderProps {
  state: ComputedState;
  onSelect: (id: string | null) => void;
  selected: string | null;
}

export interface SystemDef {
  scenarios: Scenario[];
  switches?: SystemSwitch[];
  components: Record<string, SystemComponent>;
  compute: (args: {
    scenario: string;
    switches: Record<string, string>;
  }) => ComputedState;
  Render: ComponentType<RenderProps>;
}

export interface InteractiveEntry {
  title: string;
  def: SystemDef;
  handbook: string | null;
}

export interface NarrationSegment {
  text: string;
  hl?: string | string[];
}

export const INTERACTIVE: Record<string, InteractiveEntry>;
export const SYS_NARRATION: Record<string, NarrationSegment[]>;
export const AudioController: ComponentType<{
  segments: NarrationSegment[];
  onHighlight?: (id: string | string[] | null) => void;
  label: string;
}>;
