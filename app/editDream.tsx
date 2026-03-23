import DreamForm from "@/components/dreams/DreamForm";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

export default function EditDreamScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const dreamId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background?.val,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <DreamForm mode="edit" dreamId={dreamId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
