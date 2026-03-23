import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dreamFormDataArray";

export function migrateDream(dream) {
  return {
    title: dream.title ?? "",
    tone: dream.tone ?? "neutre",
    intensity: dream.intensity ?? 3,
    clarity: dream.clarity ?? 3,
    sleepQuality: dream.sleepQuality ?? 3,
    characters: dream.characters ?? [],
    tags: dream.tags ?? [],
    ...dream,
  };
}

export async function loadDreams() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const dreams = raw ? JSON.parse(raw) : [];
  return dreams.map(migrateDream);
}

export async function saveDream(dream) {
  const dreams = await loadDreams();
  const existingIndex = dreams.findIndex((d) => d.id === dream.id);

  if (existingIndex === -1) {
    dreams.push(migrateDream(dream));
  } else {
    dreams[existingIndex] = migrateDream(dream);
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
}

export async function deleteDream(id) {
  const dreams = await loadDreams();
  const updated = dreams.filter((d) => d.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
