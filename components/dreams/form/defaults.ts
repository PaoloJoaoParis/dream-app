import type { Dream, DreamFormData } from "./types";

export const INITIAL_DREAM_FORM_DATA: DreamFormData = {
  type: "",
  isLucid: false,
  tone: "neutral",
  emotionBefore: "",
  emotionAfter: "",
  intensity: 5,
  clarity: "",
  sleepQuality: "",
  location: "",
  meaning: "",
  tags: [],
  characters: [],
};

export function toFormData(input?: Partial<Dream> | null): DreamFormData {
  return {
    ...INITIAL_DREAM_FORM_DATA,
    type: input?.type ?? INITIAL_DREAM_FORM_DATA.type,
    isLucid: input?.isLucid ?? INITIAL_DREAM_FORM_DATA.isLucid,
    tone: input?.tone ?? INITIAL_DREAM_FORM_DATA.tone,
    emotionBefore:
      input?.emotionBefore ?? INITIAL_DREAM_FORM_DATA.emotionBefore,
    emotionAfter: input?.emotionAfter ?? INITIAL_DREAM_FORM_DATA.emotionAfter,
    intensity: input?.intensity ?? INITIAL_DREAM_FORM_DATA.intensity,
    clarity: input?.clarity ?? INITIAL_DREAM_FORM_DATA.clarity,
    sleepQuality: input?.sleepQuality ?? INITIAL_DREAM_FORM_DATA.sleepQuality,
    location: input?.location ?? INITIAL_DREAM_FORM_DATA.location,
    meaning: input?.meaning ?? INITIAL_DREAM_FORM_DATA.meaning,
    tags: input?.tags ?? INITIAL_DREAM_FORM_DATA.tags,
    characters: input?.characters ?? INITIAL_DREAM_FORM_DATA.characters,
  };
}
