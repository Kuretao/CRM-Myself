import { StyleSheet, Text, View } from 'react-native';
import { Surface } from '../../../components/ui/Surface';
import type { AppPalette } from '../../../theme/tokens';
import { formatRub } from '../../../utils/format';

type Scenario = {
  title: string;
  description: string;
  value: number;
  tone: 'accent' | 'green' | 'amber';
};

type ScenarioCardsProps = {
  colors: AppPalette;
  items: Scenario[];
};

export function ScenarioCards({ colors, items }: ScenarioCardsProps) {
  const styles = createStyles(colors);
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Surface key={item.title} colors={colors} style={styles.card}>
          <View style={[styles.marker, { backgroundColor: colors[item.tone] }]} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.value}>{formatRub(item.value)}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Surface>
      ))}
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    grid: {
      gap: 10,
    },
    card: {
      padding: 14,
      gap: 7,
    },
    marker: {
      width: 26,
      height: 4,
      borderRadius: 4,
      marginBottom: 4,
    },
    title: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 15,
    },
    value: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 24,
      lineHeight: 30,
    },
    description: {
      color: colors.textSoft,
      fontSize: 13,
      lineHeight: 18,
    },
  });
