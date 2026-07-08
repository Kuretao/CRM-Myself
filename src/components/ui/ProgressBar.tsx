import { StyleSheet, View, type DimensionValue } from 'react-native';
import type { AppPalette } from '../../theme/tokens';

type ProgressBarProps = {
  colors: AppPalette;
  value: DimensionValue;
  tone?: 'accent' | 'green' | 'amber' | 'red' | 'blue';
};

export function ProgressBar({ colors, value, tone = 'accent' }: ProgressBarProps) {
  const styles = createStyles(colors);
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: value, backgroundColor: colors[tone] }]} />
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    track: {
      height: 8,
      borderRadius: 8,
      backgroundColor: colors.surfaceSoft,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    fill: {
      height: 8,
      borderRadius: 8,
    },
  });
