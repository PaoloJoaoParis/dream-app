import { YStack } from "tamagui";

import { TONE_OPTIONS } from "../constants";
import SectionLabel from "../fields/SectionLabel";
import ToggleGroupField from "../fields/ToggleGroupField";
import type { DreamStepProps } from "../types";

export default function StepTone({ data, setField }: DreamStepProps) {
  return (
    <YStack gap="$2">
      <SectionLabel>Tonalite du reve</SectionLabel>
      <ToggleGroupField
        options={TONE_OPTIONS}
        value={data.tone}
        onChange={(value) => setField("tone", value)}
      />
    </YStack>
  );
}
