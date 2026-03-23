import AsyncStorage from "@react-native-async-storage/async-storage";

export const DREAM_STORAGE_KEY = "dreamFormDataArray";

function normalizeDream(input = {}) {
  return {
    id: input.id ?? String(Date.now()),
    createdAt: input.createdAt ?? new Date().toISOString(),
    type: input.type ?? "",
    isLucid: input.isLucid ?? false,
    tone: input.tone ?? "neutral",
    emotionBefore: input.emotionBefore ?? "",
    emotionAfter: input.emotionAfter ?? "",
    intensity: input.intensity ?? 5,
    location: input.location ?? "",
    tags: Array.isArray(input.tags) ? input.tags : [],
    characters: Array.isArray(input.characters) ? input.characters : [],
    clarity: input.clarity ?? "",
    sleepQuality: input.sleepQuality ?? "",
    meaning: input.meaning ?? "",
  };
}

export async function getDreams() {
  try {
    const raw = await AsyncStorage.getItem(DREAM_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((dream) => normalizeDream(dream));
  } catch {
    return [];
  }
}

export async function getDreamById(id) {
  const dreams = await getDreams();
  return dreams.find((dream) => dream.id === id) ?? null;
}

export async function createDream(formData) {
  const dreams = await getDreams();
  const newDream = normalizeDream({
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    ...formData,
  });

  await AsyncStorage.setItem(
    DREAM_STORAGE_KEY,
    JSON.stringify([...dreams, newDream]),
  );

  return newDream;
}

export async function updateDream(updatedDream) {
  const dreams = await getDreams();
  const nextDreams = dreams.map((dream) =>
    dream.id === updatedDream.id ? normalizeDream(updatedDream) : dream,
  );

  await AsyncStorage.setItem(DREAM_STORAGE_KEY, JSON.stringify(nextDreams));
  return normalizeDream(updatedDream);
}

export async function deleteDream(id) {
  const dreams = await getDreams();
  const filtered = dreams.filter((dream) => dream.id !== id);
  await AsyncStorage.setItem(DREAM_STORAGE_KEY, JSON.stringify(filtered));
}
