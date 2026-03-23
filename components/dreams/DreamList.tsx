import { useFocusEffect } from "@react-navigation/native";
import { Pencil, Trash2 } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, useTheme } from "tamagui";
import { deleteDream, getDreams } from "./data/dreamStorage";

type Dream = {
  id: string;
  createdAt: string;
  type: string;
  isLucid: boolean;
  tone: string;
  emotionBefore: string;
  emotionAfter: string;
  intensity: number;
  location: string;
  tags: string[];
  characters: string[];
  clarity: string;
  sleepQuality: string;
  meaning: string;
};

function Badge({
  label,
  highlight = false,
}: {
  label: string;
  highlight?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: theme.color4?.val }]}>
      {highlight ? (
        <Text fontSize={11} color="$color10">
          {label}
        </Text>
      ) : (
        <Text fontSize={11} color="$color9">
          {label}
        </Text>
      )}
    </View>
  );
}

function DreamCard({
  dream,
  onDelete,
  onEdit,
}: {
  dream: Dream;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const theme = useTheme();
  const date = new Date(dream.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.color2?.val, borderColor: theme.color4?.val },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text fontSize={12} color="$color9">
          {date}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={onEdit}>
            <Pencil size={16} color={theme.color9?.val as any} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {dream.location !== "" && (
        <Text fontSize={17} fontWeight="600" color="$color12">
          {dream.location}
        </Text>
      )}

      {dream.emotionAfter !== "" && (
        <Text fontSize={13} color="$color10">
          {dream.emotionAfter} · intensité {dream.intensity}/10
        </Text>
      )}

      <View style={styles.tagsRow}>
        {dream.type !== "" && <Badge label={dream.type} />}
        {dream.isLucid && <Badge label="Lucide" highlight />}
        {dream.tags.map((tag, i) => (
          <Badge key={i} label={tag} />
        ))}
      </View>
    </View>
  );
}

export default function DreamList() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    async function fetchDreams() {
      setLoading(true);
      try {
        const data = (await getDreams()) as Dream[];
        setDreams([...data].reverse());
      } catch (e) {
        console.error("Erreur chargement rêves:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDreams();
  }, []);

  useFocusEffect(load);

  const doDelete = async (id: string) => {
    await deleteDream(id);
    setDreams((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (window.confirm("Supprimer ce rêve ?")) doDelete(id);
    } else {
      Alert.alert("Supprimer", "Supprimer ce rêve ?", [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => doDelete(id),
        },
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text color="$color9">Chargement...</Text>
      </View>
    );
  }

  if (dreams.length === 0) {
    return (
      <View style={styles.centered}>
        <Text fontSize={17} fontWeight="600" color="$color12">
          Aucun rêve
        </Text>
        <Text fontSize={14} color="$color9">
          Tes rêves apparaîtront ici
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.list}>
        <Text
          fontSize={28}
          fontWeight="700"
          color="$color12"
          style={{ paddingBottom: 4 }}
        >
          Mes rêves
        </Text>
        {dreams.map((dream) => (
          <DreamCard
            key={dream.id}
            dream={dream}
            onDelete={() => handleDelete(dream.id)}
            onEdit={() =>
              router.push({ pathname: "/editDream", params: { id: dream.id } })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  list: { padding: 20, gap: 12 },
  card: { borderRadius: 16, padding: 18, gap: 10, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: { flexDirection: "row", gap: 16, alignItems: "center" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
});
