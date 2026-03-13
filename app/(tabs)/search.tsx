import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "tamagui";

export default function SearchScreen() {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <Text color="$color">Recherche</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
