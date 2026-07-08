import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { AppPalette } from '../../theme/tokens';

type SurfaceProps = {
  colors: AppPalette;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
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
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
      ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' } as ViewStyle) : {}),
    },
    muted: {
      backgroundColor: colors.surfaceSoft,
    },
  });
