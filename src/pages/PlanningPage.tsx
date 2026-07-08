import { Alert, StyleSheet, Text, View } from 'react-native';
import { CalendarPlus, Plus } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { Surface } from '../components/ui/Surface';
import { TextField } from '../components/ui/TextField';
import { Body, Muted } from '../components/ui/Typography';
import type { AppPalette } from '../theme/tokens';
import type { MoneyType, PlannedItem } from '../types/domain';
import { formatRange } from '../utils/format';

type PlanningPageProps = {
  colors: AppPalette;
  plannedItems: PlannedItem[];
  title: string;
  amount: string;
  due: string;
  type: MoneyType;
  onChangeTitle: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeDue: (value: string) => void;
  onChangeType: (value: MoneyType) => void;
  onAddPlannedItem: () => void;
  onMarkPlannedItemPaid: (id: string) => void;
};

export function PlanningPage({
  colors,
  plannedItems,
  title,
  amount,
  due,
  type,
  onChangeTitle,
  onChangeAmount,
  onChangeDue,
  onChangeType,
  onAddPlannedItem,
  onMarkPlannedItemPaid,
}: PlanningPageProps) {
  const styles = createStyles(colors);
  const activeItems = plannedItems.filter((item) => item.status === 'planned');

  return (
    <>
      <SectionHeader colors={colors} title="Планирование" subtitle={`${activeItems.length} активных операций`} />
      <Surface colors={colors} style={styles.form}>
        <View style={styles.formHead}>
          <CalendarPlus color={colors.accent} size={20} />
          <Body colors={colors} style={styles.formTitle}>Новая плановая операция</Body>
        </View>
        <TextField colors={colors} value={title} onChangeText={onChangeTitle} placeholder="Название" />
        <View style={styles.row}>
          <View style={styles.flex}>
            <TextField colors={colors} value={amount} onChangeText={onChangeAmount} placeholder="Сумма" keyboardType="decimal-pad" />
          </View>
          <View style={styles.flex}>
            <TextField colors={colors} value={due} onChangeText={onChangeDue} placeholder="Когда" />
          </View>
        </View>
        <SegmentedControl
          colors={colors}
          value={type}
          onChange={onChangeType}
          options={[
            { label: 'Доход', value: 'income' },
            { label: 'Расход', value: 'expense' },
          ]}
        />
        <Button
          colors={colors}
          label="Добавить в план"
          icon={<Plus color="#FFFFFF" size={18} />}
          onPress={() => {
            if (!title.trim() || Number(amount.replace(',', '.')) <= 0) {
              Alert.alert('Проверь план', 'Нужно название и сумма больше нуля.');
              return;
            }
            onAddPlannedItem();
          }}
        />
      </Surface>

      <SectionHeader colors={colors} title="План / факт" subtitle="future cashflow" />
      <Surface colors={colors}>
        {plannedItems.map((item, index) => (
          <View key={item.id} style={[styles.item, index < plannedItems.length - 1 && styles.divider]}>
            <View style={styles.copy}>
              <Body colors={colors} style={styles.itemTitle}>{item.title}</Body>
              <Muted colors={colors}>{item.due} · {item.category} · {item.status}</Muted>
            </View>
            <View style={styles.side}>
              <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
                {item.type === 'income' ? '+' : '-'}{formatRange(item.amountMin, item.amountMax)}
              </Text>
              {item.status === 'planned' && (
                <Button colors={colors} label="Факт" variant="soft" onPress={() => onMarkPlannedItemPaid(item.id)} />
              )}
            </View>
          </View>
        ))}
      </Surface>
    </>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    form: {
      padding: 12,
      gap: 10,
    },
    formHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    formTitle: {
      fontWeight: '900',
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    flex: {
      flex: 1,
    },
    item: {
      minHeight: 72,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    copy: {
      flex: 1,
    },
    itemTitle: {
      fontWeight: '900',
    },
    side: {
      alignItems: 'flex-end',
      gap: 8,
    },
    amount: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '900',
      textAlign: 'right',
    },
    income: {
      color: colors.green,
    },
    expense: {
      color: colors.red,
    },
  });
