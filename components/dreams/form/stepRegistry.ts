import StepContext from "./steps/StepContext";
import StepEmotion from "./steps/StepEmotion";
import StepMeaning from "./steps/StepMeaning";
import StepTone from "./steps/StepTone";
import StepType from "./steps/StepType";
import type { DreamStepConfig } from "./types";

export const DREAM_FORM_STEPS: DreamStepConfig[] = [
  { key: "type", title: "Type de reve", Component: StepType },
  { key: "context", title: "Contexte", Component: StepContext },
  { key: "emotion", title: "Emotions", Component: StepEmotion },
  { key: "meaning", title: "Sommeil et clarte", Component: StepMeaning },
  { key: "tone", title: "Tonalite", Component: StepTone },
];
