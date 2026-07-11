import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AppPalette } from "../../theme/tokens";

export type SelectOption<T extends string> = {
  label: string;
  value: T;
  color?: string;
};

export function SelectField<T extends string>({
  colors,
  label,
  value,
  options,
  onChange,
}: {
  colors: AppPalette;
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const styles = createStyles(colors);
  const selected = options.find((option) => option.value === value);
  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.trigger}
        onPress={() => setOpen((current) => !current)}
      >
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{selected?.label || "Выбрать"}</Text>
        </View>
        <ChevronDown size={15} color={colors.textFaint} />
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.color && (
                <View style={[styles.dot, { backgroundColor: option.color }]} />
              )}
              <Text style={styles.optionText}>{option.label}</Text>
              {option.value === value && (
                <Check size={14} color={colors.accent} />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    wrap: { position: "relative", zIndex: 30, minWidth: 130 },
    trigger: {
      minHeight: 46,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      paddingHorizontal: 11,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    label: { color: colors.textFaint, fontSize: 8, fontWeight: "700" },
    value: {
      color: colors.text,
      fontSize: 11,
      fontWeight: "700",
      marginTop: 3,
    },
    menu: {
      position: "absolute",
      top: 52,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.mode === "dark" ? "#071326" : "#F7FAFF",
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    option: {
      minHeight: 36,
      borderRadius: 6,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    dot: { width: 7, height: 7, borderRadius: 4 },
    optionText: {
      flex: 1,
      color: colors.textSoft,
      fontSize: 10,
      fontWeight: "700",
    },
  });
