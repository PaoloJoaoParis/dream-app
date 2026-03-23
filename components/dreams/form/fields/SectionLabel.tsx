import { Text } from "tamagui";

type SectionLabelProps = {
  children: React.ReactNode;
};

export default function SectionLabel({ children }: SectionLabelProps) {
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
