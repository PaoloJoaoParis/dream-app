import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Haptics from "expo-haptics";
import { withLayoutContext } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    icon: "stats-chart-outline" as IoniconName,
    iconFocused: "stats-chart" as IoniconName,
  },
];

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenListeners={{ tabPress: haptic, swipeStart: haptic }}
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name)!;
        return {
          tabBarShowLabel: false,
          tabBarIndicatorStyle: { height: 0 },
          tabBarActiveTintColor: "#9D7FEA",
          tabBarInactiveTintColor: "#7A738C",
          tabBarStyle: {
            backgroundColor: "#10101E",
            borderTopColor: "rgba(157,127,234,0.15)",
            borderTopWidth: 0.5,
            paddingBottom: insets.bottom + 4,
            paddingTop: 8,
            height: 56 + insets.bottom,
          },
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? tab.iconFocused : tab.icon}
              size={26}
              color={focused ? "#9D7FEA" : "#7A738C"}
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
