import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface } from '../../../components/ui/Surface';
import { Kicker, Title } from '../../../components/ui/Typography';
import type { AppPalette } from '../../../theme/tokens';

type MetricCardProps = {
  colors: AppPalette;
  label: string;
  value: string;
  icon: ReactNode;
};

export function MetricCard({ colors, label, value, icon }: MetricCardProps) {
  const styles = createStyles();
  return (
    <Surface colors={colors} style={styles.card}>
      <View style={styles.icon}>{icon}</View>
      <Kicker colors={colors}>{label}</Kicker>
      <Title colors={colors} style={styles.value}>{value}</Title>
    </Surface>
  );
}

const createStyles = () =>
  StyleSheet.create({
    card: {
      flex: 1,
      minHeight: 116,
      padding: 12,
      justifyContent: 'space-between',
    },
    icon: {
      alignSelf: 'flex-start',
    },
    value: {
      fontSize: 16,
      lineHeight: 21,
    },
  });
