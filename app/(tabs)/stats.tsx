import type { Dream } from "@/components/dreams/DreamForm";
import { loadDreams, migrateDream } from "@/components/dreams/dreamStorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import { Card, H4, Separator, Text, XStack, YStack, useTheme } from "tamagui";

type LinePoint = {
  value: number;
  dataPointText: string;
};

type BarPoint = {
  value: number;
  label: string;
  frontColor: string;
  topLabelComponent?: () => JSX.Element;
};

type PiePoint = {
  value: number;
  color: string;
  text: string;
  label: string;
};

export default function StatsScreen() {
  const theme = useTheme();
  const [dreams, setDreams] = useState<Dream[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadDreams().then((data) => setDreams(data.map(migrateDream)));
    }, []),
  );

  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 48;
  const isTablet = screenWidth >= 600;

  const total = dreams.length;

  const lucidCount = dreams.filter((d) => d.isLucid).length;
  const lucidPct = total ? Math.round((lucidCount / total) * 100) : 0;

  const avgIntensity = total
    ? Math.round((dreams.reduce((s, d) => s + (d.intensity ?? 3), 0) / total) * 10) / 10
    : 0;

  const avgDelta = total
    ? Math.round(
        (dreams.reduce((s, d) => s + ((d.intensity ?? 3) - (d.sleepQuality ?? 3)), 0) /
          total) *
          10,
      ) / 10
    : 0;

  const last20 = [...dreams]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-20);

  const dataBefore: LinePoint[] = last20.map((d) => ({
    value: d.sleepQuality ?? 3,
    dataPointText: "",
  }));

  const dataAfter: LinePoint[] = last20.map((d) => ({
    value: d.intensity ?? 3,
    dataPointText: "",
  }));

  const emotionCounts = dreams
    .map((d) => d.emotionAfter)
    .filter(Boolean)
    .reduce(
      (acc, e) => ({ ...acc, [e as string]: ((acc[e as string] as number) ?? 0) + 1 }),
      {} as Record<string, number>,
    );

  const top5emotions: BarPoint[] = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], i) => ({
      value,
      label: label.length > 7 ? `${label.slice(0, 6)}…` : label,
      frontColor: `rgba(157,127,234,${1 - i * 0.15})`,
      topLabelComponent: () => (
        <Text style={{ color: "#7A738C", fontSize: 10, marginBottom: 2 }}>{value}</Text>
      ),
    }));

  const allTags = dreams.flatMap((d) => d.tags ?? []);
  const tagCounts = allTags.reduce(
    (acc, t) => ({ ...acc, [t]: (acc[t] ?? 0) + 1 }),
    {} as Record<string, number>,
  );

  const top5tags: BarPoint[] = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], i) => ({
      value,
      label: label.length > 10 ? `${label.slice(0, 9)}…` : label,
      frontColor: `rgba(157,127,234,${1 - i * 0.15})`,
    }));

  const nonLucidCount = dreams.length - lucidCount;

  const pieData: PiePoint[] = [
    { value: lucidCount, color: "#9D7FEA", text: `${lucidPct}%`, label: "Lucides" },
    {
      value: nonLucidCount,
      color: "#F0A070",
      text: `${100 - lucidPct}%`,
      label: "Non lucides",
    },
  ];

  const kpiItems = useMemo(
    () => [
      { value: `${total}`, label: "Rêves", color: "$color12" },
      { value: `${lucidPct}%`, label: "Lucides", color: "$color12" },
      { value: `${avgIntensity}`, label: "Intensité moy.", color: "$color12" },
      {
        value: `${avgDelta > 0 ? "+" : ""}${avgDelta}`,
        label: "Variation émo.",
        color:
          avgDelta > 0
            ? "$green10"
            : avgDelta < 0
              ? "$red10"
              : "$color12",
      },
    ],
    [total, lucidPct, avgIntensity, avgDelta],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background?.val }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.sectionCard}>
          <Card.Header padded>
            <H4>KPI</H4>
          </Card.Header>
          <Card.Footer padded>
            <View
              style={styles.kpiGrid}
            >
              {kpiItems.map((item) => (
                <Card
                  key={item.label}
                  style={[styles.kpiItemCard, { width: isTablet ? "23.5%" : "48%" }]}
                >
                  <Card.Header padded>
                    <Text fontSize={26} fontWeight="700" color={item.color as never}>
                      {item.value}
                    </Text>
                    <Text color="$color9">{item.label}</Text>
                  </Card.Header>
                </Card>
              ))}
            </View>
          </Card.Footer>
        </Card>

        <Separator />

        <Card style={styles.sectionCard}>
          <Card.Header padded>
            <H4>Avant vs Après</H4>
          </Card.Header>
          <Card.Footer padded>
            {last20.length === 0 ? (
              <Text color="$color9">Aucune donnée.</Text>
            ) : (
              <LineChart
                data={dataBefore}
                data2={dataAfter}
                width={chartWidth}
                height={180}
                spacing={chartWidth / (last20.length || 1)}
                color1="#9D7FEA"
                color2="#F0A070"
                dataPointsColor1="#9D7FEA"
                dataPointsColor2="#F0A070"
                dataPointsRadius={4}
                thickness1={2}
                thickness2={2}
                curved
                hideDataPoints={last20.length > 10}
                yAxisTextStyle={{ color: "#7A738C", fontSize: 11 }}
                xAxisColor="transparent"
                yAxisColor="transparent"
                rulesColor="rgba(255,255,255,0.05)"
                rulesType="solid"
                maxValue={5}
                noOfSections={4}
                backgroundColor="transparent"
                hideYAxisText={false}
                showReferenceLine1
                referenceLine1Position={3}
                referenceLine1Config={{
                  color: "rgba(255,255,255,0.08)",
                  dashWidth: 4,
                  dashGap: 4,
                }}
                legend={[
                  { label: "Avant sommeil", color: "#9D7FEA" },
                  { label: "Après rêve", color: "#F0A070" },
                ]}
              />
            )}
          </Card.Footer>
        </Card>

        <Separator />

        <Card style={styles.sectionCard}>
          <Card.Header padded>
            <H4>Top 5 émotions</H4>
          </Card.Header>
          <Card.Footer padded>
            {top5emotions.length === 0 ? (
              <Text color="$color9">Aucune donnée.</Text>
            ) : (
              <BarChart
                data={top5emotions}
                width={chartWidth}
                height={160}
                barWidth={Math.min(40, chartWidth / 7)}
                spacing={chartWidth / (top5emotions.length * 2.5 || 1)}
                roundedTop
                hideRules
                xAxisColor="transparent"
                yAxisColor="transparent"
                yAxisTextStyle={{ color: "#7A738C", fontSize: 11 }}
                xAxisLabelTextStyle={{ color: "#7A738C", fontSize: 11 }}
                noOfSections={4}
                backgroundColor="transparent"
                isAnimated
              />
            )}
          </Card.Footer>
        </Card>

        <Separator />

        <Card style={styles.sectionCard}>
          <Card.Header padded>
            <H4>Top 5 tags</H4>
          </Card.Header>
          <Card.Footer padded>
            {top5tags.length === 0 ? (
              <Text color="$color9">Aucune donnée.</Text>
            ) : (
              <BarChart
                data={top5tags}
                width={chartWidth}
                height={160}
                horizontal
                barWidth={18}
                spacing={10}
                roundedTop
                hideRules
                xAxisColor="transparent"
                yAxisColor="transparent"
                yAxisTextStyle={{ color: "#7A738C", fontSize: 11 }}
                xAxisLabelTextStyle={{ color: "#7A738C", fontSize: 11 }}
                backgroundColor="transparent"
                isAnimated
              />
            )}
          </Card.Footer>
        </Card>

        <Separator />

        <Card style={styles.sectionCard}>
          <Card.Header padded>
            <H4>Lucides vs Non lucides</H4>
          </Card.Header>
          <Card.Footer padded>
            <YStack style={styles.pieWrap}>
              <PieChart
                data={pieData}
                donut
                radius={70}
                innerRadius={46}
                innerCircleColor="transparent"
                centerLabelComponent={() => (
                  <YStack alignItems="center">
                    <Text style={{ color: "#EEE8FF", fontSize: 20, fontWeight: "700" }}>
                      {lucidPct}%
                    </Text>
                    <Text style={{ color: "#7A738C", fontSize: 11 }}>lucides</Text>
                  </YStack>
                )}
                textSize={12}
                textColor="#EEE8FF"
                isAnimated
              />

              <XStack style={styles.legendRow}>
                {pieData.map((item) => (
                  <XStack key={item.label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text color="$color10">
                      {item.label} ({item.value} rêves)
                    </Text>
                  </XStack>
                ))}
              </XStack>
            </YStack>
          </Card.Footer>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  sectionCard: {
    marginBottom: 12,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  kpiItemCard: {
    flexBasis: "48%",
    flexGrow: 1,
  },
  pieWrap: {
    alignItems: "center",
    gap: 12,
  },
  legendRow: {
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  legendItem: {
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});