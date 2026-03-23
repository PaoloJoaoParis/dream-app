import { YStack } from "tamagui";

import { EMOTIONS } from "../constants";
import SectionLabel from "../fields/SectionLabel";
import SliderField from "../fields/SliderField";
import ToggleGroupField from "../fields/ToggleGroupField";
import type { DreamStepProps } from "../types";

export default function StepEmotion({ data, setField }: DreamStepProps) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Emotion avant le reve</SectionLabel>
        <ToggleGroupField
          options={EMOTIONS}
          value={data.emotionBefore}
          onChange={(value) => setField("emotionBefore", value)}
        />
      </YStack>

      <YStack gap="$2">
        <SectionLabel>Emotion apres le reve</SectionLabel>
        <ToggleGroupField
          options={EMOTIONS}
          value={data.emotionAfter}
          onChange={(value) => setField("emotionAfter", value)}
        />
      </YStack>

      <SliderField
        label={`Intensite emotionnelle (${data.intensity}/10)`}
        value={data.intensity}
        min={1}
        max={10}
        step={1}
        onChange={(value) => setField("intensity", value)}
      />
    </YStack>
  );
}
