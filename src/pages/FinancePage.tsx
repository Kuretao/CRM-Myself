import { Alert, StyleSheet, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { Surface } from '../components/ui/Surface';
import { TextField } from '../components/ui/TextField';
import { CategoryChart } from '../features/finance/components/CategoryChart';
import { FinanceTable } from '../features/finance/components/FinanceTable';
import type { AppPalette } from '../theme/tokens';
import type { MoneyType, Transaction } from '../types/domain';

type FinancePageProps = {
  colors: AppPalette;
  transactions: Transaction[];
  chartItems: { category: string; amount: number }[];
  transactionTitle: string;
  transactionAmount: string;
  transactionType: MoneyType;
  onChangeTitle: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeType: (value: MoneyType) => void;
  onAddTransaction: () => void;
};

export function FinancePage({
  colors,
  transactions,
  chartItems,
  transactionTitle,
  transactionAmount,
  transactionType,
  onChangeTitle,
  onChangeAmount,
  onChangeType,
  onAddTransaction,
}: FinancePageProps) {
  const styles = createStyles();

  return (
    <>
      <SectionHeader colors={colors} title="Финансовая таблица" subtitle="fact + plan" />
      <FinanceTable colors={colors} items={transactions} />

      <SectionHeader colors={colors} title="Новая операция" subtitle="local only" />
      <Surface colors={colors} style={styles.form}>
        <TextField colors={colors} value={transactionTitle} onChangeText={onChangeTitle} placeholder="Название операции" />
        <TextField colors={colors} value={transactionAmount} onChangeText={onChangeAmount} placeholder="Сумма" keyboardType="decimal-pad" />
        <SegmentedControl
          colors={colors}
          value={transactionType}
          onChange={onChangeType}
          options={[
            { label: 'Доход', value: 'income' },
            { label: 'Расход', value: 'expense' },
          ]}
        />
        <Button
          colors={colors}
          label="Добавить операцию"
          onPress={() => {
            if (!transactionTitle.trim() || Number(transactionAmount.replace(',', '.')) <= 0) {
              Alert.alert('Проверь данные', 'Нужно название и сумма больше нуля.');
              return;
            }
            onAddTransaction();
          }}
        />
      </Surface>

      <SectionHeader colors={colors} title="График расходов" subtitle="by category" />
      <CategoryChart colors={colors} items={chartItems} />
    </>
  );
}

const createStyles = () =>
  StyleSheet.create({
    form: {
      padding: 12,
      gap: 10,
    },
  });
