import { X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Input, Text, XStack, YStack } from "tamagui";

type TagInputFieldProps = {
  tags: string[];
  setTags: (values: string[]) => void;
  placeholder: string;
};

export default function TagInputField({
  tags,
  setTags,
  placeholder,
}: TagInputFieldProps) {
  const [text, setText] = useState("");

  const addTag = () => {
    const trimmed = text.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setText("");
  };

  return (
    <YStack gap="$2">
      {tags.length > 0 && (
        <XStack flexWrap="wrap" gap="$2">
          {tags.map((tag, index) => (
            <XStack
              key={`${tag}-${index}`}
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
                onPress={() => setTags(tags.filter((_, i) => i !== index))}
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
