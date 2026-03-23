import DreamForm, { Dream } from "@/components/dreams/DreamForm";
import { loadDreams, saveDream } from "@/components/dreams/dreamStorage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "tamagui";

export default function EditDreamScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [dream, setDream] = useState<Dream | null>(null);

  useEffect(() => {
    async function loadOne() {
      const dreams = (await loadDreams()) as Dream[];
      const found = dreams.find((item: Dream) => item.id === id) ?? null;
      setDream(found);
    }
    loadOne();
  }, [id]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      {dream && (
        <DreamForm
          initialValues={dream}
          onSubmit={async (updatedDream) => {
            await saveDream(updatedDream);
            router.back();
          }}
          onCancel={() => router.back()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
