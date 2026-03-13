import DreamEditForm from "@/components/dreams/DreamEditForm";
import { StyleSheet, View } from "react-native";
import { useTheme } from "tamagui";

export default function EditDreamScreen() {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <DreamEditForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
