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
      <View style={styles.gridLineTop} />
      <View style={styles.gridLineMid} />
      <View style={styles.gridLineLeft} />
      <View style={styles.gridLineRight} />
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
    gridLineTop: {
      position: 'absolute',
      top: 92,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: colors.border,
    },
    gridLineMid: {
      position: 'absolute',
      top: 218,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: colors.mode === 'dark' ? 'rgba(184, 200, 255, 0.06)' : 'rgba(25, 35, 67, 0.08)',
    },
    gridLineLeft: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '18%',
      width: 1,
      backgroundColor: colors.mode === 'dark' ? 'rgba(184, 200, 255, 0.06)' : 'rgba(25, 35, 67, 0.08)',
    },
    gridLineRight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: '22%',
      width: 1,
      backgroundColor: colors.mode === 'dark' ? 'rgba(184, 200, 255, 0.06)' : 'rgba(25, 35, 67, 0.08)',
    },
  });
