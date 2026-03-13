import AsyncStorage from "@react-native-async-storage/async-storage";
import { Check, X } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Checkbox,
  Input,
  Label,
  Slider,
  Text,
  XStack,
  YStack,
} from "tamagui";

/* ── helpers identiques à DreamForm ── */

function TagInput({ tags, setTags, placeholder }) {
  const [text, setText] = useState("");
  const addTag = () => {
    const trimmed = text.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setText("");
    }
  };
  return (
    <YStack gap="$2">
      {tags.length > 0 && (
        <XStack flexWrap="wrap" gap="$2">
          {tags.map((tag, i) => (
            <XStack
              key={i}
              backgroundColor="$color4"
              paddingHorizontal="$3"
              paddingVertical="$1.5"
              borderRadius="$10"
              alignItems="center"
              gap="$2"
            >
              <Text fontSize={13} color="$color11">{tag}</Text>
              <X size={14} color="$color9" onPress={() => setTags(tags.filter((_, j) => j !== i))} />
            </XStack>
          ))}
        </XStack>
      )}
      <Input
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
        onSubmitEditing={addTag}
        returnKeyType="done"
      />
    </YStack>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <XStack flexWrap="wrap" gap="$2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Button
            key={opt.value}
            size="$3"
            borderRadius="$10"
            backgroundColor={selected ? "$color4" : "transparent"}
            borderWidth={1}
            borderColor={selected ? "$color8" : "$color5"}
            color={selected ? "$color12" : "$color9"}
            onPress={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </XStack>
  );
}

function SectionLabel({ children }) {
  return (
    <Text fontSize={13} color="$color9" textTransform="uppercase" letterSpacing={1}>
      {children}
    </Text>
  );
}

/* ── constantes ── */

const DREAM_TYPES = [
  { value: "ordinaire", label: "Ordinaire" },
  { value: "cauchemar", label: "Cauchemar" },
  { value: "recurrent", label: "Récurrent" },
  { value: "premonitoire", label: "Prémonitoire" },
  { value: "eveille", label: "Rêve éveillé" },
];

const EMOTIONS = [
  { value: "peur", label: "Peur" },
  { value: "tristesse", label: "Tristesse" },
  { value: "joie", label: "Joie" },
];

const QUALITY_OPTIONS = [
  { value: "mauvaise", label: "Mauvaise" },
  { value: "moyenne", label: "Moyenne" },
  { value: "bonne", label: "Bonne" },
];

const CLARITY_OPTIONS = [
  { value: "floue", label: "Floue" },
  { value: "partielle", label: "Partielle" },
  { value: "claire", label: "Claire" },
];

const TONE_OPTIONS = [
  { value: "negative", label: "Négative" },
  { value: "neutral", label: "Neutre" },
  { value: "positive", label: "Positive" },
];

/* ── composant principal ── */

export default function DreamEditForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadDream() {
      const raw = await AsyncStorage.getItem("dreamFormDataArray");
      const dreams = raw ? JSON.parse(raw) : [];
      const dream = dreams.find((d: any) => d.id === id);
      if (dream) setFormData(dream);
    }
    loadDream();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const raw = await AsyncStorage.getItem("dreamFormDataArray");
      const dreams = raw ? JSON.parse(raw) : [];
      const updated = dreams.map((d: any) => (d.id === id ? formData : d));
      await AsyncStorage.setItem("dreamFormDataArray", JSON.stringify(updated));
      router.replace("/");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de sauvegarder.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) {
    return (
      <View style={styles.centered}>
        <Text color="$color9">Chargement...</Text>
      </View>
    );
  }

  const set = (key: string, val: any) => setFormData({ ...formData, [key]: val });

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <YStack gap="$5" padding="$4">

        {/* En-tête */}
        <Text fontSize={22} fontWeight="700" color="$color12">
          Modifier le rêve
        </Text>

        {/* Type */}
        <YStack gap="$3">
          <SectionLabel>Type de rêve</SectionLabel>
          <ToggleGroup options={DREAM_TYPES} value={formData.type} onChange={(v) => set("type", v)} />
          <XStack alignItems="center" gap="$3">
            <Checkbox
              id="lucid-edit"
              checked={formData.isLucid}
              onCheckedChange={(v) => set("isLucid", !!v)}
              size="$4"
            >
              <Checkbox.Indicator>
                <Check size={16} />
              </Checkbox.Indicator>
            </Checkbox>
            <Label htmlFor="lucid-edit" fontSize={15}>Rêve lucide</Label>
          </XStack>
        </YStack>

        <View style={styles.divider} />

        {/* Contexte */}
        <YStack gap="$3">
          <SectionLabel>Lieu</SectionLabel>
          <Input
            placeholder="Lieu du rêve"
            value={formData.location}
            onChangeText={(v) => set("location", v)}
          />
          <SectionLabel>Personnages</SectionLabel>
          <TagInput
            tags={formData.characters}
            setTags={(v) => set("characters", v)}
            placeholder="Ajouter un personnage + Entrée"
          />
          <SectionLabel>Tags</SectionLabel>
          <TagInput
            tags={formData.tags}
            setTags={(v) => set("tags", v)}
            placeholder="Ajouter un tag + Entrée"
          />
        </YStack>

        <View style={styles.divider} />

        {/* Émotions */}
        <YStack gap="$3">
          <SectionLabel>Émotion avant le rêve</SectionLabel>
          <ToggleGroup options={EMOTIONS} value={formData.emotionBefore} onChange={(v) => set("emotionBefore", v)} />
          <SectionLabel>Émotion après le rêve</SectionLabel>
          <ToggleGroup options={EMOTIONS} value={formData.emotionAfter} onChange={(v) => set("emotionAfter", v)} />
          <SectionLabel>Intensité émotionnelle ({formData.intensity}/10)</SectionLabel>
          <Slider
            value={[formData.intensity]}
            onValueChange={(v) => set("intensity", v[0])}
            min={1}
            max={10}
            step={1}
            size="$3"
          >
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb index={0} circular size="$1.5" />
          </Slider>
        </YStack>

        <View style={styles.divider} />

        {/* Sommeil & Clarté */}
        <YStack gap="$3">
          <SectionLabel>Qualité du sommeil</SectionLabel>
          <ToggleGroup options={QUALITY_OPTIONS} value={formData.sleepQuality} onChange={(v) => set("sleepQuality", v)} />
          <SectionLabel>Clarté du rêve</SectionLabel>
          <ToggleGroup options={CLARITY_OPTIONS} value={formData.clarity} onChange={(v) => set("clarity", v)} />
        </YStack>

        <View style={styles.divider} />

        {/* Tonalité & Signification */}
        <YStack gap="$3">
          <SectionLabel>Tonalité du rêve</SectionLabel>
          <ToggleGroup options={TONE_OPTIONS} value={formData.tone} onChange={(v) => set("tone", v)} />
          <SectionLabel>Signification personnelle</SectionLabel>
          <Input
            placeholder="Ce que ce rêve signifie pour toi..."
            value={formData.meaning}
            onChangeText={(v) => set("meaning", v)}
          />
        </YStack>

        {/* Boutons */}
        <XStack gap="$3">
          <Button flex={1} variant="outlined" onPress={() => router.back()}>
            Annuler
          </Button>
          <Button
            flex={1}
            onPress={handleSave}
            disabled={isSaving}
            opacity={isSaving ? 0.6 : 1}
          >
            {isSaving ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        </XStack>

      </YStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  divider: { height: 1, backgroundColor: "#e0e0e0" },
});
