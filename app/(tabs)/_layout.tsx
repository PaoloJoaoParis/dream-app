import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Haptics from "expo-haptics";
import { withLayoutContext } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
];

const FALLBACK_TAB = {
  icon: "ellipse-outline" as IoniconName,
  iconFocused: "ellipse" as IoniconName,
};

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

export default function TabLayout() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isPhone = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;

  void isPhone;
  void isTablet;
  void isDesktop;

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenListeners={{ tabPress: haptic, swipeStart: haptic }}
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name) ?? FALLBACK_TAB;
        return {
          tabBarShowLabel: false,
          tabBarIndicatorStyle: { height: 0 },
          tabBarStyle: {
            backgroundColor: theme.background?.val,
            height: 52 + insets.bottom,
            paddingBottom: insets.bottom + 4,
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
