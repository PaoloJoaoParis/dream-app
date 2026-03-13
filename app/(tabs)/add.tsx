import { Plus } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { View } from "react-native";
import { Button, useTheme } from "tamagui";

export default function AddScreen() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background?.val,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        size="$5"
        borderRadius="$10"
        themeInverse
        icon={Plus}
        onPress={() => router.push("/addDream")}
      >
        Ajouter un rêve
      </Button>
    </View>
  );
}
