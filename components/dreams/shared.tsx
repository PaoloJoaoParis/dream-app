import { X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, Input, Text, XStack, YStack } from "tamagui";

export function TagInput({ tags, setTags, placeholder }) {
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
              <Text fontSize={13} color="$color11">
                {tag}
              </Text>
              <X
                size={14}
                color="$color9"
                onPress={() => setTags(tags.filter((_, j) => j !== i))}
              />
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

export function ToggleGroup({ options, value, onChange }) {
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

export function SectionLabel({ children }) {
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

export const DREAM_TYPES = [
  { value: "ordinaire", label: "Ordinaire" },
  { value: "cauchemar", label: "Cauchemar" },
  { value: "recurrent", label: "Récurrent" },
  { value: "premonitoire", label: "Prémonitoire" },
  { value: "eveille", label: "Rêve éveillé" },
];

export const EMOTIONS = [
  { value: "peur", label: "Peur" },
  { value: "tristesse", label: "Tristesse" },
  { value: "joie", label: "Joie" },
];

export const QUALITY_OPTIONS = [
  { value: "mauvaise", label: "Mauvaise" },
  { value: "moyenne", label: "Moyenne" },
  { value: "bonne", label: "Bonne" },
];

export const CLARITY_OPTIONS = [
  { value: "floue", label: "Floue" },
  { value: "partielle", label: "Partielle" },
  { value: "claire", label: "Claire" },
];

export const TONE_OPTIONS = [
  { value: "negative", label: "Négative" },
  { value: "neutral", label: "Neutre" },
  { value: "positive", label: "Positive" },
];
