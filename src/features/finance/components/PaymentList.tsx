import { StyleSheet, Text, View } from 'react-native';
import { Surface } from '../../../components/ui/Surface';
import { Body, Muted } from '../../../components/ui/Typography';
import type { AppPalette } from '../../../theme/tokens';
import type { PlannedPayment } from '../../../types/domain';
import { formatRange } from '../../../utils/format';

type PaymentListProps = {
  colors: AppPalette;
  items: PlannedPayment[];
};

export function PaymentList({ colors, items }: PaymentListProps) {
  const styles = createStyles(colors);
  return (
    <Surface colors={colors}>
      {items.map((item, index) => (
        <View key={item.id} style={[styles.row, index < items.length - 1 && styles.divider]}>
          <View style={styles.dot} />
          <View style={styles.copy}>
            <Body colors={colors} style={styles.title}>{item.title}</Body>
            <Muted colors={colors}>{item.due} · {item.category}</Muted>
          </View>
          <Text style={styles.amount}>{formatRange(item.amountMin, item.amountMax)}</Text>
        </View>
      ))}
    </Surface>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    row: {
      minHeight: 54,
      paddingHorizontal: 13,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },
    copy: {
      flex: 1,
    },
    title: {
      fontWeight: '800',
    },
    amount: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '900',
      maxWidth: 136,
      textAlign: 'right',
    },
  });
