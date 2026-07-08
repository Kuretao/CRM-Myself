import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { AppPalette } from '../../theme/tokens';

type SurfaceProps = {
  colors: AppPalette;
  children: ReactNode;
  style?: ViewStyle;
  muted?: boolean;
};

export function Surface({ colors, children, style, muted }: SurfaceProps) {
  const styles = createStyles(colors);
  return <View style={[styles.surface, muted && styles.muted, style]}>{children}</View>;
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    surface: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOpacity: 1,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 4,
    },
    muted: {
      backgroundColor: colors.surfaceSoft,
    },
  });
