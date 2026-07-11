import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AppPalette } from "../../theme/tokens";

type Option<T extends string> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string> = {
  colors: AppPalette;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  colors,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  const styles = createStyles(colors);
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.option, active && styles.active]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    wrap: {
      flexDirection: "row",
      gap: 4,
      padding: 4,
      borderRadius: 8,
      backgroundColor: colors.surfaceSoft,
      borderWidth: 1,
      borderColor: colors.border,
    },
    option: {
      flex: 1,
      minHeight: 36,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
    },
    active: {
      backgroundColor: colors.accent,
    },
    label: {
      color: colors.textSoft,
      fontWeight: "800",
      fontSize: 13,
    },
    activeLabel: {
      color: "#FFFFFF",
    },
  });
