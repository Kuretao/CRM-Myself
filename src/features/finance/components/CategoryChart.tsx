import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Surface } from '../../../components/ui/Surface';
import type { AppPalette } from '../../../theme/tokens';
import { formatRub, percent } from '../../../utils/format';

type CategoryChartProps = {
  colors: AppPalette;
  items: { category: string; amount: number }[];
};

const tones = ['accent', 'green', 'amber', 'blue', 'red'] as const;

export function CategoryChart({ colors, items }: CategoryChartProps) {
  const styles = createStyles(colors);
  const max = Math.max(...items.map((item) => item.amount), 1);

  return (
    <Surface colors={colors} style={styles.chart}>
      {items.map((item, index) => (
        <View key={item.category} style={styles.row}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{item.category}</Text>
            <Text style={styles.amount}>{formatRub(item.amount)}</Text>
          </View>
          <ProgressBar colors={colors} value={percent(item.amount, max)} tone={tones[index % tones.length]} />
        </View>
      ))}
    </Surface>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    chart: {
      padding: 12,
      gap: 12,
    },
    row: {
      gap: 7,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    label: {
      color: colors.text,
      fontWeight: '800',
      fontSize: 13,
    },
    amount: {
      color: colors.textSoft,
      fontWeight: '800',
      fontSize: 12,
    },
  });
