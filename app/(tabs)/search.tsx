import type { Dream } from "@/components/dreams/DreamForm";
import { loadDreams, migrateDream } from "@/components/dreams/dreamStorage";
import { useFocusEffect } from "@react-navigation/native";
import { Check, SlidersHorizontal } from "@tamagui/lucide-icons";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, View } from "react-native";
import { Button, Input, Text, XStack, YStack, useTheme } from "tamagui";

const TYPE_OPTIONS = [
  "lucide",
  "ordinaire",
  "cauchemar",
  "récurrent",
  "prophétique",
];

const TONE_OPTIONS = ["positive", "négative", "neutre"];

const SORT_OPTIONS = [
  { key: "recent", label: "Plus récent" },
  { key: "oldest", label: "Plus ancien" },
  { key: "az", label: "A → Z" },
  { key: "za", label: "Z → A" },
  { key: "intensity_asc", label: "Intensité ↑" },
  { key: "intensity_desc", label: "Intensité ↓" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

function filterDreams(
  dreams: Dream[],
  {
    query,
    type,
    tone,
    emotion,
    tag,
  }: {
    query: string;
    type: string;
    tone: string;
    emotion: string;
    tag: string;
  },
) {
  return dreams.map(migrateDream).filter((d) => {
    if (query) {
      const q = query.toLowerCase();
      const pool = [
        d.title,
        d.meaning,
        d.location,
        ...(d.tags ?? []),
        ...(d.characters ?? []),
      ];
      if (!pool.some((v) => v?.toLowerCase().includes(q))) return false;
    }
    if (type && d.type !== type) return false;
    if (tone && d.tone !== tone) return false;
    if (emotion && d.emotionAfter !== emotion) return false;
    if (tag && !d.tags?.includes(tag)) return false;
    return true;
  });
}

function sortDreams(dreams: Dream[], sortKey: SortKey) {
  const sorted = [...dreams];
  switch (sortKey) {
    case "recent":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case "az":
      return sorted.sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? ""),
      );
    case "za":
      return sorted.sort((a, b) =>
        (b.title ?? "").localeCompare(a.title ?? ""),
      );
    case "intensity_asc":
      return sorted.sort((a, b) => (a.intensity ?? 0) - (b.intensity ?? 0));
    case "intensity_desc":
      return sorted.sort((a, b) => (b.intensity ?? 0) - (a.intensity ?? 0));
    default:
      return sorted;
  }
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      fontSize={13}
      color="$color9"
      textTransform="uppercase"
      letterSpacing={1}
    >
      {children}
    </Text>
  );
}

function OptionChips({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (next: string) => void;
}) {
  const theme = useTheme();

  if (options.length === 0) {
    return <Text color="$color9">Aucune option</Text>;
  }

  return (
    <XStack style={styles.wrapRow}>
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <Button
            key={opt}
            size="$3"
            style={{
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? theme.color8?.val : theme.color5?.val,
              backgroundColor: active ? theme.color4?.val : "transparent",
            }}
            onPress={() => onChange(active ? "" : opt)}
          >
            {opt}
          </Button>
        );
      })}
    </XStack>
  );
}

function ResultCard({
  dream,
  theme,
}: {
  dream: Dream;
  theme: ReturnType<typeof useTheme>;
}) {
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
      <Text fontSize={15} fontWeight="600" color="$color12">
        {dream.title || "Sans titre"}
      </Text>

      {dream.location ? (
        <Text fontSize={13} color="$color9">
          {dream.location}
        </Text>
      ) : null}

      {dream.meaning ? (
        <Text fontSize={13} color="$color10" numberOfLines={2}>
          {dream.meaning}
        </Text>
      ) : null}

      <XStack style={styles.wrapRow}>
        {!!dream.type && (
          <View style={[styles.badge, { backgroundColor: theme.color3?.val }]}>
            <Text fontSize={12} color="$color10">
              {dream.type}
            </Text>
          </View>
        )}
        {!!dream.tone && (
          <View style={[styles.badge, { backgroundColor: theme.color3?.val }]}>
            <Text fontSize={12} color="$color10">
              {dream.tone}
            </Text>
          </View>
        )}
        {!!dream.emotionAfter && (
          <View style={[styles.badge, { backgroundColor: theme.color3?.val }]}>
            <Text fontSize={12} color="$color10">
              {dream.emotionAfter}
            </Text>
          </View>
        )}
      </XStack>
    </View>
  );
}

export default function SearchScreen() {
  const theme = useTheme();

  const [dreams, setDreams] = useState<Dream[]>([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [modalVisible, setModal] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const [filterType, setType] = useState("");
  const [filterTone, setTone] = useState("");
  const [filterEmotion, setEmotion] = useState("");
  const [filterTag, setTag] = useState("");

  const [draftType, setDraftType] = useState("");
  const [draftTone, setDraftTone] = useState("");
  const [draftEmotion, setDraftEmotion] = useState("");
  const [draftTag, setDraftTag] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadDreams().then((data) => setDreams(data.map(migrateDream)));
    }, []),
  );

  const emotions = useMemo(
    () => [...new Set(dreams.map((d) => d.emotionAfter).filter(Boolean))],
    [dreams],
  );

  const allTags = useMemo(
    () => [...new Set(dreams.flatMap((d) => d.tags ?? []))],
    [dreams],
  );

  const activeFilterCount = [
    filterType,
    filterTone,
    filterEmotion,
    filterTag,
  ].filter(Boolean).length;

  const hasFilter = !!(query || activeFilterCount);

  const resetAll = () => {
    setQuery("");
    setType("");
    setTone("");
    setEmotion("");
    setTag("");
    setDraftType("");
    setDraftTone("");
    setDraftEmotion("");
    setDraftTag("");
  };

  const resetFilters = () => {
    setType("");
    setTone("");
    setEmotion("");
    setTag("");
    setDraftType("");
    setDraftTone("");
    setDraftEmotion("");
    setDraftTag("");
  };

  const openFilters = () => {
    setDraftType(filterType);
    setDraftTone(filterTone);
    setDraftEmotion(filterEmotion);
    setDraftTag(filterTag);
    setModal(true);
  };

  const applyFilters = () => {
    setType(draftType);
    setTone(draftTone);
    setEmotion(draftEmotion);
    setTag(draftTag);
    setModal(false);
  };

  const results = useMemo(
    () =>
      sortDreams(
        filterDreams(dreams, {
          query,
          type: filterType,
          tone: filterTone,
          emotion: filterEmotion,
          tag: filterTag,
        }),
        sortKey,
      ),
    [dreams, query, filterType, filterTone, filterEmotion, filterTag, sortKey],
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background?.val }]}
    >
      <YStack style={styles.screenContent}>
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un rêve"
        />

        <XStack style={styles.actionsRow}>
          <Button
            icon={SlidersHorizontal}
            onPress={openFilters}
            style={styles.filtersButton}
          >
            Filtres
            {activeFilterCount > 0 ? (
              <View
                style={[
                  styles.countBadge,
                  { backgroundColor: theme.color10?.val },
                ]}
              >
                <Text fontSize={11} color="$color1" fontWeight="700">
                  {activeFilterCount}
                </Text>
              </View>
            ) : null}
          </Button>

          <Button
            style={styles.sortButton}
            onPress={() => setSortModalVisible(true)}
          >
            {SORT_OPTIONS.find((s) => s.key === sortKey)?.label ?? "Tri"}
          </Button>
        </XStack>

        <XStack style={styles.summaryRow}>
          <Text color="$color9">{results.length} rêve(s)</Text>
          {hasFilter ? (
            <Button onPress={resetAll}>
              <Text color="$color10">Réinitialiser</Text>
            </Button>
          ) : null}
        </XStack>

        {results.length === 0 ? (
          <YStack style={styles.emptyState}>
            <Text fontSize={32}>🌙</Text>
            <Text color="$color9">Aucun rêve ne correspond</Text>
            {hasFilter ? (
              <Button onPress={resetAll}>
                <Text color="$color10">Effacer les filtres</Text>
              </Button>
            ) : null}
          </YStack>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <ResultCard dream={item} theme={theme} />}
          />
        )}
      </YStack>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModal(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.background?.val },
          ]}
        >
          <YStack style={styles.filterModalContent}>
            <Text fontSize={20} fontWeight="700" color="$color12">
              Filtres
            </Text>

            <YStack style={styles.sectionStack}>
              <SectionLabel>Type de rêve</SectionLabel>
              <OptionChips
                options={TYPE_OPTIONS}
                selected={draftType}
                onChange={setDraftType}
              />
            </YStack>

            <YStack style={styles.sectionStack}>
              <SectionLabel>Tonalité</SectionLabel>
              <OptionChips
                options={TONE_OPTIONS}
                selected={draftTone}
                onChange={setDraftTone}
              />
            </YStack>

            <YStack style={styles.sectionStack}>
              <SectionLabel>Émotion ressentie</SectionLabel>
              <OptionChips
                options={emotions}
                selected={draftEmotion}
                onChange={setDraftEmotion}
              />
            </YStack>

            <YStack style={styles.sectionStack}>
              <SectionLabel>Tag</SectionLabel>
              <OptionChips
                options={allTags}
                selected={draftTag}
                onChange={setDraftTag}
              />
            </YStack>

            <XStack style={styles.modalFooterRow}>
              <Button
                style={styles.flexButton}
                variant="outlined"
                onPress={resetFilters}
              >
                Réinitialiser
              </Button>
              <Button style={styles.flexButton} onPress={applyFilters}>
                Appliquer
              </Button>
            </XStack>
          </YStack>
        </View>
      </Modal>

      <Modal
        visible={sortModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.sortModalCard,
              {
                backgroundColor: theme.background?.val,
                borderColor: theme.color4?.val,
              },
            ]}
          >
            <YStack style={styles.sectionStack}>
              <Text fontSize={16} fontWeight="700" color="$color12">
                Trier par
              </Text>
              {SORT_OPTIONS.map((opt) => {
                const active = sortKey === opt.key;
                return (
                  <Button
                    key={opt.key}
                    onPress={() => {
                      setSortKey(opt.key);
                      setSortModalVisible(false);
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: active
                        ? theme.color8?.val
                        : theme.color5?.val,
                      backgroundColor: active
                        ? theme.color4?.val
                        : "transparent",
                    }}
                  >
                    <XStack style={styles.sortOptionRow}>
                      <Text color="$color12">{opt.label}</Text>
                      {active ? <Check size={16} color="$color10" /> : null}
                    </XStack>
                  </Button>
                );
              })}
              <Button onPress={() => setSortModalVisible(false)}>Fermer</Button>
            </YStack>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    gap: 10,
    paddingBottom: 20,
  },
  screenContent: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  actionsRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  summaryRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  filterModalContent: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  sectionStack: {
    gap: 8,
  },
  modalFooterRow: {
    gap: 8,
    marginTop: "auto",
  },
  flexButton: {
    flex: 1,
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sortOptionRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 12,
    padding: 12,
    gap: 6,
    borderWidth: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  filtersButton: {
    borderRadius: 10,
    position: "relative",
  },
  sortButton: {
    borderRadius: 10,
    minWidth: 170,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
  },
  sortModalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
});
