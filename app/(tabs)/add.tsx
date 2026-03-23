import { Plus } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, useTheme, YStack } from "tamagui";

export default function AddScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isPhone = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <YStack
        flex={1}
        style={[
          styles.inner,
          {
            width: "100%",
            maxWidth: isDesktop ? 800 : isTablet ? 680 : undefined,
            alignSelf: isDesktop || isTablet ? "center" : undefined,
            paddingTop: insets.top + 8,
          },
        ]}
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
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
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
