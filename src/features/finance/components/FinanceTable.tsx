import { StyleSheet, Text, View } from 'react-native';
import { Surface } from '../../../components/ui/Surface';
import type { AppPalette } from '../../../theme/tokens';
import type { Transaction } from '../../../types/domain';
import { formatRub } from '../../../utils/format';

type FinanceTableProps = {
  colors: AppPalette;
  items: Transaction[];
};

export function FinanceTable({ colors, items }: FinanceTableProps) {
  const styles = createStyles(colors);
  return (
    <Surface colors={colors} style={styles.table}>
      <View style={styles.head}>
        <Text style={[styles.cell, styles.headText]}>Статья</Text>
        <Text style={[styles.type, styles.headText]}>Тип</Text>
        <Text style={[styles.amount, styles.headText]}>Сумма</Text>
      </View>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>{item.date} · {item.category}</Text>
          </View>
          <Text style={[styles.type, item.type === 'income' ? styles.income : styles.expense]}>
            {item.type === 'income' ? 'доход' : 'расход'}
          </Text>
          <Text style={styles.amount}>{formatRub(item.amount)}</Text>
        </View>
      ))}
    </Surface>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    table: {
      overflow: 'hidden',
    },
    head: {
      minHeight: 42,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSoft,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    row: {
      minHeight: 58,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cell: {
      flex: 1.25,
      paddingRight: 8,
    },
    type: {
      flex: 0.5,
      fontSize: 12,
      fontWeight: '800',
      color: colors.textSoft,
    },
    amount: {
      flex: 0.75,
      textAlign: 'right',
      fontSize: 13,
      fontWeight: '900',
      color: colors.text,
    },
    headText: {
      color: colors.textFaint,
      textTransform: 'uppercase',
      fontSize: 11,
      letterSpacing: 0,
    },
    title: {
      color: colors.text,
      fontWeight: '800',
      fontSize: 14,
    },
    meta: {
      color: colors.textFaint,
      fontSize: 12,
      marginTop: 2,
    },
    income: {
      color: colors.green,
    },
    expense: {
      color: colors.red,
    },
  });
