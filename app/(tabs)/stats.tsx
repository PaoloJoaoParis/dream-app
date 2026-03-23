import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "tamagui";

import { getDreams } from "@/components/dreams/data/dreamStorage";

type Dream = {
  id: string;
  createdAt: string;
  type: string;
  emotion?: string;
  emotionBefore?: string;
  emotionAfter?: string;
  meaning: string;
  tags: string[];
  characters: string[];
  isLucid: boolean;
};


const CHART_COLORS = ["#9D7FEA", "#F0A070", "#B89FF5", "#7A738C", "#CCC6E8", "#5A5370"];

function countBy(items: string[]) {
  const map: Record<string, number> = {};

  items.forEach((item) => {
    const key = item.trim();
    if (!key) return;
    map[key] = (map[key] ?? 0) + 1;
  });

  return map;
}

function toTopEntries(map: Record<string, number>, limit = 6) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function GlassCard({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <View style={[styles.cardShadow, compact ? styles.miniShadow : null]}>
      <View style={[styles.cardClip, compact ? styles.miniClip : null]}>
        <BlurView intensity={40} tint="dark" style={styles.blurAbsolute} />
        <View style={[styles.cardInner, compact ? styles.miniInner : null]}>{children}</View>
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0.8)).current;
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

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
        setDreams(data);
      } catch {
        setDreams([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useFocusEffect(loadDreams);

  const stats = useMemo(() => {
    const total = dreams.length;

    const emotions = dreams
      .flatMap((d) => [d.emotion, d.emotionBefore, d.emotionAfter])
      .filter(Boolean) as string[];
    const emotionCounts = countBy(emotions);
    const topEmotions = toTopEntries(emotionCounts, 6);

    const types = dreams.map((d) => d.type ?? "");
    const typeCounts = countBy(types);
    const topTypes = toTopEntries(typeCounts, 6);

    const tags = dreams.flatMap((d) => d.tags ?? []);
    const tagCounts = countBy(tags);
    const topTags = toTopEntries(tagCounts, 5);

    const lucidCount = dreams.filter((d) => d.isLucid).length;
    const lucidPercent = total === 0 ? 0 : Math.round((lucidCount / total) * 100);

    return {
      total,
      lucidCount,
      lucidPercent,
      topTags,
      mostCommonEmotion: topEmotions[0]?.[0] ?? "-",
      mostCommonType: topTypes[0]?.[0] ?? "-",
      emotionBarData: topEmotions.map(([label, value], index) => ({
        value,
        label: label.length > 8 ? `${label.slice(0, 8)}...` : label,
        frontColor: CHART_COLORS[index % CHART_COLORS.length],
      })),
      typePieData: topTypes.map(([label, value], index) => ({
        value,
        text: label,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })),
    };
  }, [dreams]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.subtitle}>STATISTIQUES</Text>
          <Text style={styles.title}>Vue d Ensemble</Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : stats.total === 0 ? (
          <Text style={styles.loadingText}>Ajoute des reves pour voir les statistiques.</Text>
        ) : (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statsCol}>
                <GlassCard compact>
                  <Text style={styles.valuePrimary}>{stats.total}</Text>
                  <Text style={styles.valueLabel}>Reves enregistres</Text>
                </GlassCard>
              </View>

              <View style={styles.statsCol}>
                <GlassCard compact>
                  <Text style={styles.valueAccent}>{stats.lucidPercent}%</Text>
                  <Text style={styles.valueLabel}>Lucides</Text>
                </GlassCard>
              </View>
            </View>

            <GlassCard>
              <Text style={styles.sectionTitle}>Frequence des emotions</Text>
              {stats.emotionBarData.length === 0 ? (
                <Text style={styles.loadingText}>Aucune emotion.</Text>
              ) : (
                <BarChart
                  data={stats.emotionBarData}
                  barWidth={22}
                  spacing={20}
                  noOfSections={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules
                  isAnimated
                />
              )}
              <Text style={styles.metaText}>Emotion dominante: {stats.mostCommonEmotion}</Text>
            </GlassCard>

            <GlassCard>
              <Text style={styles.sectionTitle}>Types de reve</Text>
              {stats.typePieData.length === 0 ? (
                <Text style={styles.loadingText}>Aucun type.</Text>
              ) : (
                <PieChart
                  data={stats.typePieData}
                  donut
                  radius={90}
                  innerRadius={52}
                  innerCircleColor="#080810"
                  centerLabelComponent={() => <Text style={styles.metaText}>Types</Text>}
                />
              )}
              <Text style={styles.metaText}>Type dominant: {stats.mostCommonType}</Text>
            </GlassCard>

            <GlassCard>
              <Text style={styles.sectionTitle}>Tags frequents</Text>
              {stats.topTags.length === 0 ? (
                <Text style={styles.loadingText}>Aucun tag.</Text>
              ) : (
                stats.topTags.map(([tag, count]) => (
                  <Text key={tag} style={styles.metaText}>
                    {tag}: {count}
                  </Text>
                ))
              )}
            </GlassCard>
          </>
        )}
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
    letterSpacing: -0.4,
  },
  statsGrid: {
    flexDirection: "row",
    marginBottom: 2,
    gap: 10,
  },
  statsCol: {
    flex: 1,
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
  miniShadow: {
    borderRadius: 16,
  },
  cardClip: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(157,127,234,0.18)",
    borderTopColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.055)",
  },
  miniClip: {
    borderRadius: 16,
  },
  blurAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardInner: {
    padding: 18,
  },
  miniInner: {
    padding: 14,
  },
  sectionTitle: {
    fontSize: 15,
    color: "#CCC6E8",
    lineHeight: 22,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 11,
    color: "#7A738C",
    fontWeight: "500",
  },
  metaText: {
    fontSize: 11,
    color: "#7A738C",
    fontWeight: "500",
  },
  valuePrimary: {
    fontSize: 24,
    fontWeight: "800",
    color: "#9D7FEA",
  },
  valueAccent: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F0A070",
  },
  valueLabel: {
    fontSize: 11,
    color: "#7A738C",
    fontWeight: "500",
  },
});