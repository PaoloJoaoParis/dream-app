import DreamForm from "@/components/dreams/DreamForm";
import { StyleSheet, View } from "react-native";
import { useTheme } from "tamagui";

export default function addDream() {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <DreamForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
