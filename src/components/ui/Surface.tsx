import type { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { AppPalette } from "../../theme/tokens";

type SurfaceProps = {
  colors: AppPalette;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  muted?: boolean;
};

export function Surface({ colors, children, style, muted }: SurfaceProps) {
  const styles = createStyles(colors);
  return (
    <View style={[styles.surface, muted && styles.muted, style]}>
      {children}
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    surface: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(7, 17, 38, 0.54)"
          : "rgba(255,255,255,0.66)",
      shadowColor: colors.shadow,
      shadowOpacity: 1,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
      ...(Platform.OS === "web"
        ? ({
            backdropFilter: "blur(28px) saturate(135%)",
            WebkitBackdropFilter: "blur(28px) saturate(135%)",
          } as ViewStyle)
        : {}),
    },
    muted: {
      backgroundColor: colors.surfaceSoft,
    },
  });
