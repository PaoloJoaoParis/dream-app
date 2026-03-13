import AsyncStorage from "@react-native-async-storage/async-storage";
import { Check, ChevronLeft, ChevronRight, X } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import uuid from "react-native-uuid";
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

/* ───────── TAG INPUT ───────── */

function TagInput({ tags, setTags, placeholder }) {
  const [text, setText] = useState("");

  const addTag = () => {
    const trimmed = text.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setText("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
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
              <Text fontSize={13} color="$color11">
                {tag}
              </Text>
              <X size={14} color="$color9" onPress={() => removeTag(i)} />
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

/* ───────── TOGGLE GROUP ───────── */

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

/* ───────── SECTION LABEL ───────── */

function SectionLabel({ children }) {
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

/* ───────── STEP 1 : TYPE ───────── */

const DREAM_TYPES = [
  { value: "ordinaire", label: "Ordinaire" },
  { value: "cauchemar", label: "Cauchemar" },
  { value: "recurrent", label: "Récurrent" },
  { value: "premonitoire", label: "Prémonitoire" },
  { value: "eveille", label: "Rêve éveillé" },
];

function StepType({ data, setData }) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Type de rêve</SectionLabel>
        <ToggleGroup
          options={DREAM_TYPES}
          value={data.type}
          onChange={(val) => setData({ ...data, type: val })}
        />
      </YStack>

      <XStack alignItems="center" gap="$3">
        <Checkbox
          id="lucid"
          checked={data.isLucid}
          onCheckedChange={(val) => setData({ ...data, isLucid: !!val })}
          size="$4"
        >
          <Checkbox.Indicator>
            <Check size={16} />
          </Checkbox.Indicator>
        </Checkbox>
        <Label htmlFor="lucid" fontSize={15}>
          Rêve lucide
        </Label>
      </XStack>
    </YStack>
  );
}

/* ───────── STEP 2 : CONTEXTE ───────── */

function StepContext({ data, setData }) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Personnages</SectionLabel>
        <TagInput
          tags={data.characters}
          setTags={(val) => setData({ ...data, characters: val })}
          placeholder="Ajouter un personnage + Entrée"
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Lieu</SectionLabel>
        <Input
          placeholder="Lieu du rêve"
          value={data.location}
          onChangeText={(val) => setData({ ...data, location: val })}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Tags</SectionLabel>
        <TagInput
          tags={data.tags}
          setTags={(val) => setData({ ...data, tags: val })}
          placeholder="Ajouter un tag + Entrée"
        />
      </YStack>
    </YStack>
  );
}

/* ───────── STEP 3 : ÉMOTIONS ───────── */

const EMOTIONS = [
  { value: "peur", label: "Peur" },
  { value: "tristesse", label: "Tristesse" },
  { value: "joie", label: "Joie" },
];

function StepEmotion({ data, setData }) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Émotion avant le rêve</SectionLabel>
        <ToggleGroup
          options={EMOTIONS}
          value={data.emotionBefore}
          onChange={(val) => setData({ ...data, emotionBefore: val })}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Émotion après le rêve</SectionLabel>
        <ToggleGroup
          options={EMOTIONS}
          value={data.emotionAfter}
          onChange={(val) => setData({ ...data, emotionAfter: val })}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>
          Intensité émotionnelle ({data.intensity}/10)
        </SectionLabel>
        <Slider
          value={[data.intensity]}
          onValueChange={(val) => setData({ ...data, intensity: val[0] })}
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
    </YStack>
  );
}

/* ───────── STEP 4 : SOMMEIL & CLARTÉ ───────── */

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

function StepMeaning({ data, setData }) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Qualité du sommeil</SectionLabel>
        <ToggleGroup
          options={QUALITY_OPTIONS}
          value={data.sleepQuality}
          onChange={(val) => setData({ ...data, sleepQuality: val })}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Clarté du rêve</SectionLabel>
        <ToggleGroup
          options={CLARITY_OPTIONS}
          value={data.clarity}
          onChange={(val) => setData({ ...data, clarity: val })}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Signification personnelle</SectionLabel>
        <Input
          placeholder="Ce que ce rêve signifie pour toi..."
          value={data.meaning}
          onChangeText={(val) => setData({ ...data, meaning: val })}
        />
      </YStack>
    </YStack>
  );
}

/* ───────── STEP 5 : TONALITÉ ───────── */

const TONE_OPTIONS = [
  { value: "negative", label: "Négative" },
  { value: "neutral", label: "Neutre" },
  { value: "positive", label: "Positive" },
];

function StepTone({ data, setData }) {
  return (
    <YStack gap="$2">
      <SectionLabel>Tonalité du rêve</SectionLabel>
      <ToggleGroup
        options={TONE_OPTIONS}
        value={data.tone}
        onChange={(val) => setData({ ...data, tone: val })}
      />
    </YStack>
  );
}

/* ───────── PROGRESS DOTS ───────── */

function ProgressDots({ current, total }) {
  return (
    <XStack gap="$2" justifyContent="center">
      {Array.from({ length: total }).map((_, i) => (
        <YStack
          key={i}
          width={i === current ? 24 : 8}
          height={8}
          borderRadius={4}
          backgroundColor={i === current ? "$color10" : "$color5"}
        />
      ))}
    </XStack>
  );
}

/* ───────── TITRES DES ÉTAPES ───────── */

const STEP_TITLES = [
  "Type de rêve",
  "Contexte",
  "Émotions",
  "Sommeil & Clarté",
  "Tonalité",
];

const INITIAL_FORM_DATA = {
  type: "",
  isLucid: false,
  emotionBefore: "",
  emotionAfter: "",
  characters: [],
  location: "",
  intensity: 5,
  clarity: "",
  tags: [],
  sleepQuality: "",
  meaning: "",
  tone: "neutral",
};

/* ───────── FORMULAIRE PRINCIPAL ───────── */

export default function DreamForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const steps = [StepType, StepContext, StepEmotion, StepMeaning, StepTone];
  const CurrentStep = steps[step];
  const isLast = step === steps.length - 1;

  const next = () => {
    if (!isLast) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Récupérer le tableau actuel depuis AsyncStorage
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      // Créer l'objet du rêve avec toutes les données du formulaire
      const dreamEntry = {
        id: uuid.v4(),
        createdAt: new Date().toISOString(),
        ...formData,
      };

      // Ajouter au tableau et sauvegarder
      formDataArray.push(dreamEntry);
      await AsyncStorage.setItem(
        "dreamFormDataArray",
        JSON.stringify(formDataArray),
      );

      console.log("Rêve sauvegardé:", dreamEntry);

      // Réinitialiser le formulaire et quitter
      setFormData(INITIAL_FORM_DATA);
      setStep(0);
      router.replace("/");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder le rêve.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <YStack flex={1} padding="$4" gap="$5">
        {/* En-tête */}
        <YStack gap="$3">
          <Text fontSize={22} fontWeight="700" color="$color12">
            {STEP_TITLES[step]}
          </Text>
          <ProgressDots current={step} total={steps.length} />
        </YStack>

        {/* Contenu de l'étape */}
        <YStack flex={1}>
          <CurrentStep data={formData} setData={setFormData} />
        </YStack>

        {/* Navigation */}
        <XStack gap="$3" justifyContent="space-between">
          {step > 0 ? (
            <Button
              flex={1}
              variant="outlined"
              icon={ChevronLeft}
              onPress={back}
            >
              Retour
            </Button>
          ) : (
            <YStack flex={1} />
          )}

          <Button
            flex={1}
            iconAfter={isLast ? undefined : ChevronRight}
            onPress={isLast ? handleSubmit : next}
            disabled={isSaving}
            opacity={isSaving ? 0.6 : 1}
          >
            {isLast ? (isSaving ? "Sauvegarde..." : "Enregistrer") : "Suivant"}
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
