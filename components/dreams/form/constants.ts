import type { ToggleOption } from "./types";

export const DREAM_TYPES: ToggleOption[] = [
  { value: "ordinaire", label: "Ordinaire" },
  { value: "cauchemar", label: "Cauchemar" },
  { value: "recurrent", label: "Recurrent" },
  { value: "premonitoire", label: "Premonitoire" },
  { value: "eveille", label: "Reve eveille" },
];

export const EMOTIONS: ToggleOption[] = [
  { value: "peur", label: "Peur" },
  { value: "tristesse", label: "Tristesse" },
  { value: "joie", label: "Joie" },
];

export const QUALITY_OPTIONS: ToggleOption[] = [
  { value: "mauvaise", label: "Mauvaise" },
  { value: "moyenne", label: "Moyenne" },
  { value: "bonne", label: "Bonne" },
];

export const CLARITY_OPTIONS: ToggleOption[] = [
  { value: "floue", label: "Floue" },
  { value: "partielle", label: "Partielle" },
  { value: "claire", label: "Claire" },
];

export const TONE_OPTIONS: ToggleOption[] = [
  { value: "negative", label: "Negative" },
  { value: "neutral", label: "Neutre" },
  { value: "positive", label: "Positive" },
];
