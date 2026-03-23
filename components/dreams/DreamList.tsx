import { Pencil, Trash2 } from "@tamagui/lucide-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "tamagui";

type Dream = {
  id: string;
  createdAt: string;
  title: string;
  type: string;
  isLucid: boolean;
  emotionBefore: string;
  tone: string;
  emotionAfter: string;
  intensity: number;
  location: string;
  tags: string[];
  characters: string[];
  clarity: number;
  sleepQuality: number;
  meaning: string;
};

function DreamCard({
  dream,
  onDelete,
  onEdit,
}: {
  dream: Dream;
  onDelete: (id: string) => void;
  onEdit: (dream: Dream) => void;
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
            <View
              style={[styles.badge, { backgroundColor: theme.color3?.val }]}
            >
              <Text fontSize={11} color="$color10">
                Lucide
              </Text>
            </View>
          )}
          {dream.type !== "" && (
            <View
              style={[styles.badge, { backgroundColor: theme.color3?.val }]}
            >
              <Text fontSize={11} color="$color9">
                {dream.type}
              </Text>
            </View>
          )}
        </View>
      </View>

      {dream.title !== "" && (
        <Text fontSize={15} fontWeight="600" color="$color12">
          {dream.title}
        </Text>
      )}

      {dream.location !== "" && (
        <Text fontSize={13} color="$color9">
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
            <View
              key={i}
              style={[styles.badge, { backgroundColor: theme.color4?.val }]}
            >
              <Text fontSize={12} color="$color9">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onEdit(dream)}
        >
          <Pencil size={15} color="$color9" />
          <Text fontSize={13} color="$color9">
            {" "}
            Modifier
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(dream.id)}
        >
          <Trash2 size={15} color="#ef4444" />
          <Text fontSize={13} style={{ color: "#ef4444" }}>
            {" "}
            Supprimer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DreamList({
  dreams,
  loading,
  onEdit,
  onDelete,
}: {
  dreams: Dream[];
  loading: boolean;
  onEdit: (dream: Dream) => void;
  onDelete: (id: string) => void;
}) {
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
            onDelete={onDelete}
            onEdit={onEdit}
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: { flexDirection: "row", gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 4,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
});
