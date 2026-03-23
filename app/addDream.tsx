import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useTheme } from "tamagui";
import DreamForm, { Dream } from "../components/dreams/DreamForm";
import { saveDream } from "../components/dreams/dreamStorage";

export default function addDream() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <DreamForm
        onSubmit={async (dream: Dream) => {
          await saveDream(dream);
          router.back();
        }}
        onCancel={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
