import { Input, YStack } from "tamagui";

import SectionLabel from "../fields/SectionLabel";
import TagInputField from "../fields/TagInputField";
import type { DreamStepProps } from "../types";

export default function StepContext({
  data,
  setField,
  setArrayField,
}: DreamStepProps) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Personnages</SectionLabel>
        <TagInputField
          tags={data.characters}
          setTags={(values) => setArrayField("characters", values)}
          placeholder="Ajouter un personnage"
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Lieu</SectionLabel>
        <Input
          placeholder="Lieu du reve"
          value={data.location}
          onChangeText={(value) => setField("location", value)}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Tags</SectionLabel>
        <TagInputField
          tags={data.tags}
          setTags={(values) => setArrayField("tags", values)}
          placeholder="Ajouter un tag"
        />
      </YStack>
    </YStack>
  );
}
