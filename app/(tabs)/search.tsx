import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input, Text } from "tamagui";

import { getDreams } from "@/components/dreams/data/dreamStorage";

type Dream = {
  id: string;
  createdAt: string;
  type: string;
  emotionBefore: string;
  emotionAfter: string;
  meaning: string;
  location: string;
  tags: string[];
  characters: string[];
};

type Filters = {
  emotion: string;
  type: string;
  character: string;
  tag: string;
};

const EMPTY_FILTERS: Filters = {
  emotion: "",
  type: "",
  character: "",
  tag: "",
};

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function FilterButtons({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <View style={styles.cardShadow}>
      <View style={styles.cardClip}>
        <BlurView intensity={40} tint="dark" style={styles.blurAbsolute} />
        <View style={styles.filterInner}>
          <Text style={styles.filterTitle}>{title}</Text>
          <View style={styles.rowWrap}>
            {options.map((option) => {
              const selected = value === option;
              return (
                <Button
                  key={option}
                  size="$2"
                  variant={selected ? undefined : "outlined"}
                  style={[
                    styles.pillButton,
                    selected ? styles.pillActive : null,
                  ]}
                  onPress={() => onChange(selected ? "" : option)}
                >
                  {option}
                </Button>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0.8)).current;

  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.8,
          duration: 2800,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  const loadDreams = useCallback(() => {
    async function load() {
      setLoading(true);
      try {
        const data = (await getDreams()) as Dream[];
        setDreams(
          [...data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      } catch {
        setDreams([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useFocusEffect(loadDreams);

  const emotionOptions = useMemo(
    () => unique(dreams.flatMap((d) => [d.emotionBefore, d.emotionAfter])),
    [dreams],
  );
  const typeOptions = useMemo(
    () => unique(dreams.map((d) => d.type)),
    [dreams],
  );
  const characterOptions = useMemo(
    () => unique(dreams.flatMap((d) => d.characters ?? [])),
    [dreams],
  );
  const tagOptions = useMemo(
    () => unique(dreams.flatMap((d) => d.tags ?? [])),
    [dreams],
  );

  const filteredDreams = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dreams.filter((dream) => {
      const inSearchScope = [
        dream.meaning,
        dream.location,
        ...(dream.tags ?? []),
        ...(dream.characters ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = query === "" || inSearchScope.includes(query);
      const matchesEmotion =
        filters.emotion === "" ||
        dream.emotionBefore === filters.emotion ||
        dream.emotionAfter === filters.emotion;
      const matchesType = filters.type === "" || dream.type === filters.type;
      const matchesCharacter =
        filters.character === "" ||
        (dream.characters ?? []).includes(filters.character);
      const matchesTag =
        filters.tag === "" || (dream.tags ?? []).includes(filters.tag);

      return (
        matchesSearch &&
        matchesEmotion &&
        matchesType &&
        matchesCharacter &&
        matchesTag
      );
    });
  }, [dreams, search, filters]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.subtitle}>RECHERCHE</Text>
          <Text style={styles.title}>Explorer les Reves</Text>
        </View>

        <Input
          placeholder="Rechercher dans meaning, location, tags, characters"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <View style={styles.filtersHeader}>
          <Text style={styles.filterLabel}>Filtres</Text>
          <Button
            size="$2"
            variant="outlined"
            style={styles.pillButton}
            onPress={() => setFilters(EMPTY_FILTERS)}
          >
            Reinitialiser
          </Button>
        </View>

        <FilterButtons
          title="Emotion"
          options={emotionOptions}
          value={filters.emotion}
          onChange={(emotion) =>
            setFilters((prev) => ({
              ...prev,
              emotion,
            }))
          }
        />

        <FilterButtons
          title="Type"
          options={typeOptions}
          value={filters.type}
          onChange={(type) =>
            setFilters((prev) => ({
              ...prev,
              type,
            }))
          }
        />

        <FilterButtons
          title="Personnage"
          options={characterOptions}
          value={filters.character}
          onChange={(character) =>
            setFilters((prev) => ({
              ...prev,
              character,
            }))
          }
        />

        <FilterButtons
          title="Tag"
          options={tagOptions}
          value={filters.tag}
          onChange={(tag) =>
            setFilters((prev) => ({
              ...prev,
              tag,
            }))
          }
        />

        <Text style={styles.counterText}>
          {loading
            ? "Chargement..."
            : `${filteredDreams.length} reve(s) trouve(s)`}
        </Text>

        {!loading && filteredDreams.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aucun reve correspondant.</Text>
          </View>
        ) : null}

        {!loading
          ? filteredDreams.map((dream) => (
              <View key={dream.id} style={styles.cardShadow}>
                <View style={styles.cardClip}>
                  <BlurView
                    intensity={40}
                    tint="dark"
                    style={styles.blurAbsolute}
                  />
                  <View style={styles.cardInner}>
                    <Text style={styles.dateText}>
                      {new Date(dream.createdAt).toLocaleDateString("fr-FR")}
                    </Text>

                    <Text style={styles.mainText} numberOfLines={3}>
                      {dream.meaning || dream.location || "Aucune description"}
                    </Text>

                    <View style={styles.rowWrap}>
                      {dream.type ? (
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeBadgeText}>{dream.type}</Text>
                        </View>
                      ) : null}
                      {dream.emotionAfter ? (
                        <View style={styles.tagPill}>
                          <Text style={styles.tagText}>
                            {dream.emotionAfter}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            ))
          : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080810",
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  header: {
    marginBottom: 6,
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
  searchInput: {
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderColor: "rgba(157,127,234,0.18)",
    color: "#CCC6E8",
  },
  filterLabel: {
    fontSize: 11,
    color: "#7A738C",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  filterTitle: {
    fontSize: 11,
    color: "#7A738C",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  pillButton: {
    borderRadius: 100,
  },
  pillActive: {
    backgroundColor: "rgba(157,127,234,0.2)",
    borderColor: "rgba(157,127,234,0.25)",
  },
  counterText: {
    fontSize: 11,
    color: "#7A738C",
    fontWeight: "500",
  },
  emptyBox: {
    paddingVertical: 12,
  },
  emptyText: {
    color: "#7A738C",
  },
  cardShadow: {
    borderRadius: 22,
    marginBottom: 12,
    shadowColor: "#9D7FEA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  cardClip: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(157,127,234,0.18)",
    borderTopColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.055)",
  },
  blurAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  filterInner: {
    padding: 18,
  },
  cardInner: {
    padding: 18,
  },
  dateText: {
    fontSize: 11,
    color: "#5A5370",
    fontWeight: "500",
    marginBottom: 8,
  },
  mainText: {
    fontSize: 15,
    color: "#CCC6E8",
    lineHeight: 22,
    marginBottom: 12,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  typeBadgeText: {
    fontSize: 11,
    color: "#7A738C",
    fontWeight: "500",
  },
  tagPill: {
    backgroundColor: "rgba(157,127,234,0.1)",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: "#9D7FEA",
  },
});
