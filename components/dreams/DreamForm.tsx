import { X } from "@tamagui/lucide-icons";
import type { ReactNode } from "react";
import { useState } from "react";
import { ScrollView } from "react-native";
import { Button, Input, Slider, Text, TextArea, XStack, YStack } from "tamagui";

export type Dream = {
  id: string;
  createdAt: string;
  title: string;
  meaning: string;
  type: string;
  isLucid: boolean;
  emotionBefore: string;
  emotionAfter: string;
  tone: string;
  intensity: number;
  clarity: number;
  sleepQuality: number;
  location: string;
  characters: string[];
  tags: string[];
};

type DreamFormProps = {
  initialValues?: Dream;
  onSubmit: (dream: Dream) => void;
  onCancel: () => void;
};

function SectionLabel({ children }: { children: ReactNode }) {
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

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <XStack flexWrap="wrap" gap="$2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Button
            key={opt.value}
            size="$3"
            background={selected ? "$color4" : "transparent"}
            style={{
              borderRadius: 999,
              borderWidth: 1,
              borderColor: selected ? "$color8" : "$color5",
            }}
            onPress={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </XStack>
  );
}

function ScaleSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <YStack gap="$2">
      <Slider
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        min={1}
        max={5}
        step={1}
        size="$3"
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb index={0} circular size="$1.5" />
      </Slider>
      <Text fontSize={12} color="$color9">
        {value}/5
      </Text>
    </YStack>
  );
}

function ListInput({
  values,
  setValues,
  placeholder,
}: {
  values: string[];
  setValues: (values: string[]) => void;
  placeholder: string;
}) {
  const [text, setText] = useState("");

  const addValue = () => {
    const trimmed = text.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values, trimmed]);
      setText("");
    }
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <YStack gap="$2">
      {values.length > 0 && (
        <XStack flexWrap="wrap" gap="$2">
          {values.map((value, i) => (
            <XStack
              key={`${value}-${i}`}
              gap="$2"
              style={{
                backgroundColor: "$color4",
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 6,
                alignItems: "center",
              }}
            >
              <Text fontSize={13} color="$color11">
                {value}
              </Text>
              <X size={14} color="$color9" onPress={() => removeValue(i)} />
            </XStack>
          ))}
        </XStack>
      )}
      <XStack gap="$2">
        <Input
          flex={1}
          placeholder={placeholder}
          value={text}
          onChangeText={setText}
          onSubmitEditing={addValue}
          returnKeyType="done"
        />
        <Button onPress={addValue}>Ajouter</Button>
      </XStack>
    </YStack>
  );
}

const DREAM_TYPES = [
  { value: "lucide", label: "Lucide" },
  { value: "ordinaire", label: "Ordinaire" },
  { value: "cauchemar", label: "Cauchemar" },
  { value: "récurrent", label: "Récurrent" },
  { value: "prophétique", label: "Prophétique" },
];

const TONE_OPTIONS = [
  { value: "positive", label: "Positive" },
  { value: "négative", label: "Négative" },
  { value: "neutre", label: "Neutre" },
];

const STEP_TITLES = [
  "Quand & Quoi",
  "Ressenti",
  "Décor & Personnages",
  "Signification",
];

export default function DreamForm({
  initialValues,
  onSubmit,
  onCancel,
}: DreamFormProps) {
  const now = new Date();
  const [step, setStep] = useState(0);

  const [date, setDate] = useState(
    initialValues
      ? new Date(initialValues.createdAt).toISOString().slice(0, 10)
      : now.toISOString().slice(0, 10),
  );
  const [time, setTime] = useState(
    initialValues
      ? new Date(initialValues.createdAt).toTimeString().slice(0, 5)
      : now.toTimeString().slice(0, 5),
  );
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [meaning, setMeaning] = useState(initialValues?.meaning ?? "");
  const [type, setType] = useState(initialValues?.type ?? "ordinaire");
  const [tone, setTone] = useState(initialValues?.tone ?? "neutre");
  const [emotionBefore, setEmotionBefore] = useState(
    initialValues?.emotionBefore ?? "",
  );
  const [emotionAfter, setEmotionAfter] = useState(
    initialValues?.emotionAfter ?? "",
  );
  const [intensity, setIntensity] = useState(initialValues?.intensity ?? 3);
  const [clarity, setClarity] = useState(initialValues?.clarity ?? 3);
  const [sleepQuality, setSleepQuality] = useState(
    initialValues?.sleepQuality ?? 3,
  );
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [characters, setCharacters] = useState<string[]>(
    initialValues?.characters ?? [],
  );
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);

  const handleSubmit = () => {
    const createdAt = (() => {
      try {
        return new Date(`${date}T${time}:00`).toISOString();
      } catch {
        return new Date().toISOString();
      }
    })();

    onSubmit({
      id: initialValues?.id ?? Date.now().toString(),
      isLucid: type === "lucide",
      createdAt,
      title,
      meaning,
      type,
      tone,
      emotionBefore,
      emotionAfter,
      intensity,
      clarity,
      sleepQuality,
      location,
      characters,
      tags,
    });
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <YStack gap="$4">
          <YStack gap="$2">
            <SectionLabel>Date et heure</SectionLabel>
            <XStack gap="$2">
              <Input
                flex={2}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
              />
              <Input
                flex={1}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
              />
            </XStack>
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Titre</SectionLabel>
            <Input
              placeholder="Titre court"
              value={title}
              onChangeText={setTitle}
            />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Type</SectionLabel>
            <ToggleGroup
              options={DREAM_TYPES}
              value={type}
              onChange={setType}
            />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Tonalité</SectionLabel>
            <ToggleGroup
              options={TONE_OPTIONS}
              value={tone}
              onChange={setTone}
            />
          </YStack>
        </YStack>
      );
    }

    if (step === 1) {
      return (
        <YStack gap="$4">
          <YStack gap="$2">
            <SectionLabel>Émotion avant</SectionLabel>
            <Input value={emotionBefore} onChangeText={setEmotionBefore} />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Émotion après</SectionLabel>
            <Input value={emotionAfter} onChangeText={setEmotionAfter} />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Intensité 1→5</SectionLabel>
            <ScaleSelector value={intensity} onChange={setIntensity} />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Clarté 1→5</SectionLabel>
            <ScaleSelector value={clarity} onChange={setClarity} />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Qualité du sommeil 1→5</SectionLabel>
            <ScaleSelector value={sleepQuality} onChange={setSleepQuality} />
          </YStack>
        </YStack>
      );
    }

    if (step === 2) {
      return (
        <YStack gap="$4">
          <YStack gap="$2">
            <SectionLabel>Lieu</SectionLabel>
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="Lieu"
            />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Personnages</SectionLabel>
            <ListInput
              values={characters}
              setValues={setCharacters}
              placeholder="Ajouter un personnage"
            />
          </YStack>

          <YStack gap="$2">
            <SectionLabel>Tags</SectionLabel>
            <ListInput
              values={tags}
              setValues={setTags}
              placeholder="Ajouter un tag"
            />
          </YStack>
        </YStack>
      );
    }

    return (
      <YStack gap="$4">
        <YStack gap="$2">
          <SectionLabel>Signification personnelle</SectionLabel>
          <TextArea
            numberOfLines={6}
            value={meaning}
            onChangeText={setMeaning}
            placeholder="Signification personnelle"
          />
        </YStack>
      </YStack>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <YStack flex={1} gap="$5" style={{ padding: 16 }}>
        <YStack gap="$3">
          <Text fontSize={22} fontWeight="700" color="$color12">
            {STEP_TITLES[step]}
          </Text>
          <XStack gap="$2" style={{ justifyContent: "center" }}>
            {[0, 1, 2, 3].map((i) => (
              <YStack
                key={i}
                width={i === step ? 20 : 6}
                height={6}
                style={{
                  borderRadius: 999,
                  backgroundColor: i === step ? "$purple8" : "$borderColor",
                }}
              />
            ))}
          </XStack>
        </YStack>

        <YStack flex={1}>{renderStep()}</YStack>

        <XStack gap="$3" style={{ paddingTop: 16 }}>
          <Button
            flex={1}
            variant="outlined"
            disabled={step === 0}
            onPress={() => setStep((s) => s - 1)}
          >
            Retour
          </Button>
          <Button
            flex={1}
            onPress={step === 3 ? handleSubmit : () => setStep((s) => s + 1)}
          >
            {step === 3
              ? initialValues
                ? "Modifier"
                : "Sauvegarder"
              : "Suivant"}
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
