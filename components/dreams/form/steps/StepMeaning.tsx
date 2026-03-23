import { Input, YStack } from "tamagui";

import { CLARITY_OPTIONS, QUALITY_OPTIONS } from "../constants";
import SectionLabel from "../fields/SectionLabel";
import ToggleGroupField from "../fields/ToggleGroupField";
import type { DreamStepProps } from "../types";

export default function StepMeaning({ data, setField }: DreamStepProps) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Qualite du sommeil</SectionLabel>
        <ToggleGroupField
          options={QUALITY_OPTIONS}
          value={data.sleepQuality}
          onChange={(value) => setField("sleepQuality", value)}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Clarte du reve</SectionLabel>
        <ToggleGroupField
          options={CLARITY_OPTIONS}
          value={data.clarity}
          onChange={(value) => setField("clarity", value)}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Signification personnelle</SectionLabel>
        <Input
          placeholder="Ce que ce reve signifie pour toi..."
          value={data.meaning}
          onChangeText={(value) => setField("meaning", value)}
        />
      </YStack>
    </YStack>
  );
}
