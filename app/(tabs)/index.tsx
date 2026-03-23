import DreamList from "@/components/dreams/DreamList";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "tamagui";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.subtitle}>JOURNAL</Text>
        <Text style={styles.title}>Mes Reves</Text>
      </View>

      <DreamList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080810",
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: "#7A738C",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#EEE8FF",
    letterSpacing: -0.4,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 100,
    backgroundColor: "#9D7FEA",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9D7FEA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
});
