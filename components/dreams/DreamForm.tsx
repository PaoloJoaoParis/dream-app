import { Check, ChevronLeft, ChevronRight, X } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Checkbox,
  Input,
  Label,
  Slider,
  Text,
  useTheme,
} from "tamagui";

import { createDream, getDreamById, updateDream } from "./data/dreamStorage";

type DreamFormMode = "add" | "edit";

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

type DreamFormData = Omit<Dream, "id" | "createdAt">;

type DreamFormProps = {
  mode: DreamFormMode;
  initialData?: Dream;
  dreamId?: string;
};

const INITIAL_FORM_DATA: DreamFormData = {
  type: "",
  isLucid: false,
  tone: "neutral",
  emotionBefore: "",
  emotionAfter: "",
  intensity: 5,
  location: "",
  tags: [],
  characters: [],
  clarity: "",
  sleepQuality: "",
  meaning: "",
};

const DREAM_TYPES = [
  { value: "ordinaire", label: "Ordinaire" },
  { value: "cauchemar", label: "Cauchemar" },
  { value: "recurrent", label: "Recurrent" },
  { value: "premonitoire", label: "Premonitoire" },
  { value: "eveille", label: "Reve eveille" },
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
  { value: "negative", label: "Negative" },
  { value: "neutral", label: "Neutre" },
  { value: "positive", label: "Positive" },
];

const STEP_TITLES = [
  "Type de reve",
  "Contexte",
  "Emotions",
  "Sommeil et clarte",
  "Tonalite",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontSize={12}
      color="$color9"
      textTransform="uppercase"
      letterSpacing={1}
    >
      {children}
    </Text>
  );
}

function ChoiceButtons({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.wrapRow}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Button
            key={opt.value}
            size="$3"
            variant={selected ? undefined : "outlined"}
            style={[
              styles.pillButton,
              selected ? { backgroundColor: theme.color8?.val } : null,
            ]}
            onPress={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </View>
  );
}

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (nextTags: string[]) => void;
  placeholder: string;
}) {
  const theme = useTheme();
  const [text, setText] = useState("");

  const addTag = () => {
    const trimmed = text.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setText("");
  };

  return (
    <View style={styles.stack}>
      {tags.length > 0 ? (
        <View style={styles.wrapRow}>
          {tags.map((tag, index) => (
            <View
              key={`${tag}-${index}`}
              style={[styles.tagPill, { backgroundColor: theme.color5?.val }]}
            >
              <Text fontSize={12}>{tag}</Text>
              <X
                size={14}
                color="$color10"
                onPress={() => onChange(tags.filter((_, i) => i !== index))}
              />
            </View>
          ))}
        </View>
      ) : null}

      <Input
        placeholder={placeholder}
        value={text}
        onChangeText={setText}
        onSubmitEditing={addTag}
        returnKeyType="done"
      />
    </View>
  );
}

function toFormData(dream: any): DreamFormData {
  return {
    type: dream?.type ?? "",
    isLucid: !!dream?.isLucid,
    tone: dream?.tone ?? "neutral",
    emotionBefore: dream?.emotionBefore ?? "",
    emotionAfter: dream?.emotionAfter ?? "",
    intensity: dream?.intensity ?? 5,
    location: dream?.location ?? "",
    tags: Array.isArray(dream?.tags) ? dream.tags : [],
    characters: Array.isArray(dream?.characters) ? dream.characters : [],
    clarity: dream?.clarity ?? "",
    sleepQuality: dream?.sleepQuality ?? "",
    meaning: dream?.meaning ?? "",
  };
}

export default function DreamForm({
  mode,
  initialData,
  dreamId,
}: DreamFormProps) {
  const router = useRouter();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<DreamFormData>(INITIAL_FORM_DATA);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentCreatedAt, setCurrentCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "add") {
      setFormData(INITIAL_FORM_DATA);
      setCurrentId(null);
      setCurrentCreatedAt(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function hydrate() {
      setLoading(true);
      setError("");
      try {
        const source =
          initialData ?? (dreamId ? await getDreamById(dreamId) : null);
        if (!source) {
          if (mounted) setError("Reve introuvable.");
          return;
        }
        if (!mounted) return;
        setFormData(toFormData(source));
        setCurrentId(source.id);
        setCurrentCreatedAt(source.createdAt);
      } catch {
        if (mounted) setError("Erreur lors du chargement du reve.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, [mode, dreamId, initialData]);

  const setField = (key: keyof DreamFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isLastStep = step === STEP_TITLES.length - 1;

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      if (mode === "add") {
        await createDream(formData);
      } else {
        if (!currentId) {
          setError("Impossible de modifier ce reve (id manquant).");
          return false;
        }

        await updateDream({
          id: currentId,
          createdAt: currentCreatedAt ?? new Date().toISOString(),
          ...formData,
        });
      }

      router.replace("/");
      return true;
    } catch {
      setError("Impossible de sauvegarder le reve.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    <View key="type" style={styles.stepBlock}>
      <SectionLabel>Type de reve</SectionLabel>
      <ChoiceButtons
        options={DREAM_TYPES}
        value={formData.type}
        onChange={(value) => setField("type", value)}
      />

      <View style={styles.switchRow}>
        <Checkbox
          id="lucid"
          checked={formData.isLucid}
          onCheckedChange={(value) => setField("isLucid", !!value)}
          size="$4"
        >
          <Checkbox.Indicator>
            <Check size={16} />
          </Checkbox.Indicator>
        </Checkbox>
        <Label htmlFor="lucid" fontSize={15}>
          Reve lucide
        </Label>
      </View>
    </View>,

    <View key="context" style={styles.stepBlock}>
      <SectionLabel>Personnages</SectionLabel>
      <TagInput
        tags={formData.characters}
        onChange={(next) => setField("characters", next)}
        placeholder="Ajouter un personnage"
      />

      <SectionLabel>Lieu</SectionLabel>
      <Input
        placeholder="Lieu du reve"
        value={formData.location}
        onChangeText={(value) => setField("location", value)}
      />

      <SectionLabel>Tags</SectionLabel>
      <TagInput
        tags={formData.tags}
        onChange={(next) => setField("tags", next)}
        placeholder="Ajouter un tag"
      />
    </View>,

    <View key="emotion" style={styles.stepBlock}>
      <SectionLabel>Emotion avant le reve</SectionLabel>
      <ChoiceButtons
        options={EMOTIONS}
        value={formData.emotionBefore}
        onChange={(value) => setField("emotionBefore", value)}
      />

      <SectionLabel>Emotion apres le reve</SectionLabel>
      <ChoiceButtons
        options={EMOTIONS}
        value={formData.emotionAfter}
        onChange={(value) => setField("emotionAfter", value)}
      />

      <SectionLabel>
        Intensite emotionnelle ({formData.intensity}/10)
      </SectionLabel>
      <Slider
        value={[formData.intensity]}
        onValueChange={(value) => setField("intensity", value[0])}
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
    </View>,

    <View key="meaning" style={styles.stepBlock}>
      <SectionLabel>Qualite du sommeil</SectionLabel>
      <ChoiceButtons
        options={QUALITY_OPTIONS}
        value={formData.sleepQuality}
        onChange={(value) => setField("sleepQuality", value)}
      />

      <SectionLabel>Clarte du reve</SectionLabel>
      <ChoiceButtons
        options={CLARITY_OPTIONS}
        value={formData.clarity}
        onChange={(value) => setField("clarity", value)}
      />

      <SectionLabel>Signification personnelle</SectionLabel>
      <Input
        placeholder="Ce que ce reve signifie pour toi..."
        value={formData.meaning}
        onChangeText={(value) => setField("meaning", value)}
      />
    </View>,

    <View key="tone" style={styles.stepBlock}>
      <SectionLabel>Tonalite du reve</SectionLabel>
      <ChoiceButtons
        options={TONE_OPTIONS}
        value={formData.tone}
        onChange={(value) => setField("tone", value)}
      />
    </View>,
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text color="$color9">Chargement...</Text>
      </View>
    );
  }

  if (mode === "edit" && !currentId && error) {
    return (
      <View style={styles.centered}>
        <Text color="$red10">{error}</Text>
        <Button variant="outlined" onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text fontSize={26} fontWeight="700" color="$color12">
        {STEP_TITLES[step]}
      </Text>
      <Text fontSize={12} color="$color9">
        Etape {step + 1}/{STEP_TITLES.length}
      </Text>

      {error ? <Text color="$red10">{error}</Text> : null}

      <View style={styles.glassShadow}>
        <View style={[styles.glassClip, { borderColor: theme.color5?.val }]}>
          <BlurView intensity={28} tint="dark" style={styles.glassBody}>
            {steps[step]}
          </BlurView>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {step > 0 ? (
          <Button
            variant="outlined"
            icon={ChevronLeft}
            style={styles.pillButton}
            onPress={() => setStep((prev) => prev - 1)}
          >
            Retour
          </Button>
        ) : (
          <View />
        )}

        <Button
          iconAfter={isLastStep ? undefined : ChevronRight}
          style={styles.pillButton}
          onPress={
            isLastStep
              ? async () => {
                  const ok = await submit();
                  if (!ok) {
                    Alert.alert("Erreur", "Impossible de sauvegarder le reve.");
                  }
                }
              : () => setStep((prev) => prev + 1)
          }
          disabled={saving}
        >
          {isLastStep
            ? saving
              ? "Sauvegarde..."
              : mode === "add"
                ? "Enregistrer"
                : "Mettre a jour"
            : "Suivant"}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  stepBlock: {
    gap: 12,
  },
  glassShadow: {
    borderRadius: 22,
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  glassClip: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
  },
  glassBody: {
    backgroundColor: "rgba(11, 12, 22, 0.4)",
    padding: 16,
  },
  stack: {
    gap: 8,
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillButton: {
    borderRadius: 100,
  },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
});
