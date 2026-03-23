import { Check } from "@tamagui/lucide-icons";
import { Checkbox, Label, XStack, YStack } from "tamagui";

import { DREAM_TYPES } from "../constants";
import SectionLabel from "../fields/SectionLabel";
import ToggleGroupField from "../fields/ToggleGroupField";
import type { DreamStepProps } from "../types";

export default function StepType({ data, setField }: DreamStepProps) {
  return (
    <YStack gap="$4">
      <YStack gap="$2">
        <SectionLabel>Type de reve</SectionLabel>
        <ToggleGroupField
          options={DREAM_TYPES}
          value={data.type}
          onChange={(value) => setField("type", value)}
        />
      </YStack>

      <XStack alignItems="center" gap="$3">
        <Checkbox
          id="lucid"
          checked={data.isLucid}
          onCheckedChange={(value) => setField("isLucid", Boolean(value))}
          size="$4"
        >
          <Checkbox.Indicator>
            <Check size={16} />
          </Checkbox.Indicator>
        </Checkbox>
        <Label htmlFor="lucid" fontSize={15}>
          Reve lucide
        </Label>
      </XStack>
    </YStack>
  );
}
