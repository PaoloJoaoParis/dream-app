import DreamForm, { Dream } from "@/components/dreams/DreamForm";
import DreamList from "@/components/dreams/DreamList";
import {
  deleteDream,
  loadDreams,
  saveDream,
} from "@/components/dreams/dreamStorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, Modal, Platform, StyleSheet, View } from "react-native";
import { useTheme } from "tamagui";

export default function HomeScreen() {
  const theme = useTheme();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"edit" | null>(null);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loadDreams();
      setDreams([...data].reverse());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll]),
  );

  const openEdit = (dream: Dream) => {
    setSelectedDream(dream);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedDream(null);
  };

  const handleSubmit = async (dream: Dream) => {
    await saveDream(dream);
    await loadAll();
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      const confirmDelete =
        typeof window !== "undefined" &&
        window.confirm("Supprimer ce rêve ? Action irréversible.");

      if (confirmDelete) {
        deleteDream(id).then(loadAll);
      }
      return;
    }

    Alert.alert("Supprimer", "Action irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteDream(id);
          await loadAll();
        },
      },
    ]);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <DreamList
        dreams={dreams}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal visible={modalMode !== null} animationType="slide">
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.background?.val },
          ]}
        >
          <DreamForm
            initialValues={
              modalMode === "edit" ? (selectedDream ?? undefined) : undefined
            }
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalContainer: { flex: 1 },
});
