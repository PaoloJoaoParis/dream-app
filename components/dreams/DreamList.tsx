import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pencil, Trash2 } from "@tamagui/lucide-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "tamagui";

type Dream = {
  id: string;
  createdAt: string;
  type: string;
  isLucid: boolean;
  tone: string;
  emotionAfter: string;
  intensity: number;
  location: string;
  tags: string[];
  characters: string[];
  clarity: string;
  sleepQuality: string;
  meaning: string;
};

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
        {
          backgroundColor: theme.color2?.val,
          borderColor: theme.color4?.val,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text fontSize={13} color="$color9">
          {date}
        </Text>
        <View style={styles.row}>
          {dream.isLucid && (
            <View style={[styles.badge, { backgroundColor: theme.color3?.val }]}>
              <Text fontSize={11} color="$color10">Lucide</Text>
            </View>
          )}
          {dream.type !== "" && (
            <View style={[styles.badge, { backgroundColor: theme.color3?.val }]}>
              <Text fontSize={11} color="$color9">{dream.type}</Text>
            </View>
          )}
        </View>
      </View>

      {dream.location !== "" && (
        <Text fontSize={15} fontWeight="600" color="$color12">
          {dream.location}
        </Text>
      )}

      {dream.emotionAfter !== "" && (
        <Text fontSize={13} color="$color10">
          {dream.emotionAfter} · intensité {dream.intensity}/10
        </Text>
      )}

      {dream.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {dream.tags.map((tag, i) => (
            <View key={i} style={[styles.badge, { backgroundColor: theme.color4?.val }]}>
              <Text fontSize={12} color="$color9">{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Pencil size={15} color={theme.color9?.val} />
          <Text fontSize={13} color="$color9"> Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
          <Trash2 size={15} color="#ef4444" />
          <Text fontSize={13} style={{ color: "#ef4444" }}> Supprimer</Text>
        </TouchableOpacity>
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
        const raw = await AsyncStorage.getItem("dreamFormDataArray");
        const data = raw ? JSON.parse(raw) : [];
        setDreams(data.reverse());
      } catch (e) {
        console.error("Erreur chargement rêves:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDreams();
  }, []);

  useFocusEffect(load);

  const handleDelete = (id: string) => {
    Alert.alert("Supprimer", "Supprimer ce rêve ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const raw = await AsyncStorage.getItem("dreamFormDataArray");
          const data = raw ? JSON.parse(raw) : [];
          const updated = data.filter((d: Dream) => d.id !== id);
          await AsyncStorage.setItem("dreamFormDataArray", JSON.stringify(updated));
          setDreams((prev) => prev.filter((d) => d.id !== id));
        },
      },
    ]);
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
        <Text fontSize={32}>🌙</Text>
        <Text color="$color9">Aucun rêve enregistré</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.list}>
        {dreams.map((dream) => (
          <DreamCard
            key={dream.id}
            dream={dream}
            onDelete={() => handleDelete(dream.id)}
            onEdit={() => router.push({ pathname: "/editDream", params: { id: dream.id } })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  list: { padding: 16, gap: 12 },
  card: { borderRadius: 12, padding: 16, gap: 8, borderWidth: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  row: { flexDirection: "row", gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 16, marginTop: 4 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
});
