import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import type { AppPalette } from '../../theme/tokens';

type ScreenProps = {
  colors: AppPalette;
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
};

export function Screen({ colors, children, scroll = true, padded = true }: ScreenProps) {
  const styles = createStyles(colors);
  const content = <View style={[styles.content, !padded && styles.flush]}>{children}</View>;

  return (
    <LinearGradient
      colors={[colors.bg, colors.bgDeep, colors.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.glowPrimary} />
      <View style={styles.glowSecondary} />
      <SafeAreaView style={styles.safe}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    safe: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 30,
    },
    flush: {
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    glowPrimary: {
      position: 'absolute',
      top: -90,
      right: -90,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: colors.glow,
      opacity: colors.mode === 'dark' ? 0.7 : 0.32,
    },
    glowSecondary: {
      position: 'absolute',
      top: 150,
      left: -130,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: colors.accentSoft,
      opacity: 0.72,
    },
  });
