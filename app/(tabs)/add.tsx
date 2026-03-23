import { Plus } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "tamagui";

export default function AddScreen() {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <Text
        fontSize={22}
        fontWeight="700"
        color="$color12"
        style={styles.title}
      >
        Nouveau rêve
      </Text>
      <Button
        size="$5"
        icon={Plus}
        onPress={() => router.push("/addDream")}
        style={styles.btn}
      >
        Commencer
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  emoji: { marginBottom: 8 },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 8 },
  btn: { width: "100%", marginTop: 8 } as any,
});
