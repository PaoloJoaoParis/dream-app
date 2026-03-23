import type { ComponentType } from "react";

export interface Dream {
  id: string;
  createdAt: string;
  type?: string;
  isLucid?: boolean;
  tone?: string;
  emotionBefore?: string;
  emotionAfter?: string;
  intensity?: number;
  clarity?: string;
  sleepQuality?: string;
  location?: string;
  meaning?: string;
  tags: string[];
  characters: string[];
}

export interface DreamFormData {
  type: string;
  isLucid: boolean;
  tone: string;
  emotionBefore: string;
  emotionAfter: string;
  intensity: number;
  clarity: string;
  sleepQuality: string;
  location: string;
  meaning: string;
  tags: string[];
  characters: string[];
}

export type DreamFormMode = "add" | "edit";

export interface ToggleOption {
  value: string;
  label: string;
}

export interface DreamStepProps {
  data: DreamFormData;
  setField: <K extends keyof DreamFormData>(
    key: K,
    value: DreamFormData[K],
  ) => void;
  setArrayField: (key: "tags" | "characters", values: string[]) => void;
}

export interface DreamStepConfig {
  key: string;
  title: string;
  Component: ComponentType<DreamStepProps>;
}
