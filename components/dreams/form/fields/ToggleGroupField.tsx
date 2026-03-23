import { Button, XStack } from "tamagui";

import type { ToggleOption } from "../types";

type ToggleGroupFieldProps = {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function ToggleGroupField({
  options,
  value,
  onChange,
}: ToggleGroupFieldProps) {
  return (
    <XStack flexWrap="wrap" gap="$2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Button
            key={option.value}
            size="$3"
            borderRadius="$10"
            backgroundColor={selected ? "$color4" : "transparent"}
            borderWidth={1}
            borderColor={selected ? "$color8" : "$color5"}
            color={selected ? "$color12" : "$color9"}
            onPress={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </XStack>
  );
}
