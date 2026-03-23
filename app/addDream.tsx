import DreamForm from "@/components/dreams/DreamForm";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "tamagui";

export default function addDream() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
      <DreamForm mode="add" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
