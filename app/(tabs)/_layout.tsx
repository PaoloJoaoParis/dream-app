import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Haptics from "expo-haptics";
import { withLayoutContext } from "expo-router";
import { Platform } from "react-native";
import { useTheme } from "tamagui";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS = [
  {
    name: "index",
    icon: "home-outline" as IoniconName,
    iconFocused: "home" as IoniconName,
  },
  {
    name: "add",
    icon: "add-circle-outline" as IoniconName,
    iconFocused: "add-circle" as IoniconName,
  },
  {
    name: "search",
    icon: "search-outline" as IoniconName,
    iconFocused: "search" as IoniconName,
  },
  {
    name: "stats",
    icon: "bar-chart-outline" as IoniconName,
    iconFocused: "bar-chart" as IoniconName,
  },
  {
    name: "settings",
    icon: "settings-outline" as IoniconName,
    iconFocused: "settings" as IoniconName,
  },
];

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

export default function TabLayout() {
  const theme = useTheme();

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenListeners={{ tabPress: haptic, swipeStart: haptic }}
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name)!;
        return {
          tabBarShowLabel: false,
          tabBarIndicatorStyle: { height: 0 },
          tabBarStyle: {
            backgroundColor: theme.background?.val,
            height: Platform.select({ ios: 84, android: 64, default: 64 }),
            paddingBottom: Platform.select({ ios: 24, android: 8, default: 8 }),
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? tab.iconFocused : tab.icon}
              size={26}
              color={focused ? theme.color?.val : theme.colorPress?.val}
            />
          ),
        };
      }}
    >
      {TABS.map((tab) => (
        <MaterialTopTabs.Screen key={tab.name} name={tab.name} />
      ))}
    </MaterialTopTabs>
  );
}
