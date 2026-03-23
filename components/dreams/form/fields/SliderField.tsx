import { Slider, YStack } from "tamagui";

import SectionLabel from "./SectionLabel";

type SliderFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export default function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: SliderFieldProps) {
  return (
    <YStack gap="$2">
      <SectionLabel>{label}</SectionLabel>
      <Slider
        value={[value]}
        onValueChange={(next) => onChange(next[0])}
        min={min}
        max={max}
        step={step}
        size="$3"
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb index={0} circular size="$1.5" />
      </Slider>
    </YStack>
  );
}
