import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={dark ? "dark" : "light"}
    >
      <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="addDream"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="editDream"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
