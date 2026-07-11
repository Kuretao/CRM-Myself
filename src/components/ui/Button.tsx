import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { AppPalette } from "../../theme/tokens";

type ButtonProps = {
  colors: AppPalette;
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: "primary" | "ghost" | "soft";
};

export function Button({
  colors,
  label,
  onPress,
  icon,
  variant = "primary",
}: ButtonProps) {
  const styles = createStyles(colors);
  return (
    <Pressable style={[styles.button, styles[variant]]} onPress={onPress}>
      {icon}
      <Text style={[styles.label, variant !== "primary" && styles.labelSoft]}>
        {label}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    button: {
      minHeight: 40,
      borderRadius: 8,
      paddingHorizontal: 14,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      borderWidth: 1,
    },
    primary: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: colors.border,
    },
    soft: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.border,
    },
    label: {
      color: "#17130D",
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0,
    },
    labelSoft: {
      color: colors.text,
    },
  });
