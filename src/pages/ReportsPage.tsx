import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DonutChart } from '../features/reports/components/DonutChart';
import { LineChart } from '../features/reports/components/LineChart';
import { ScenarioCards } from '../features/reports/components/ScenarioCards';
import type { AppPalette } from '../theme/tokens';

type ReportsPageProps = {
  colors: AppPalette;
  cashflow: { label: string; value: number }[];
  expenseShare: { category: string; amount: number }[];
  taskShare: { label: string; value: number }[];
  scenarios: {
    title: string;
    description: string;
    value: number;
    tone: 'accent' | 'green' | 'amber';
  }[];
};

export function ReportsPage({ colors, cashflow, expenseShare, taskShare, scenarios }: ReportsPageProps) {
  const styles = createStyles();
  const donutExpenses = expenseShare.slice(0, 5).map((item) => ({
    label: item.category,
    value: item.amount,
  }));

  return (
    <>
      <SectionHeader colors={colors} title="Отчеты" subtitle="analytics foundation" />
      <LineChart colors={colors} title="Cashflow после ключевых этапов" data={cashflow} />

      <SectionHeader colors={colors} title="Сценарии" subtitle="decision table" />
      <ScenarioCards colors={colors} items={scenarios} />

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <SectionHeader colors={colors} title="Расходы" subtitle="share" />
          <DonutChart colors={colors} title="Категории" data={donutExpenses} />
        </View>
        <View style={styles.gridItem}>
          <SectionHeader colors={colors} title="Задачи" subtitle="status" />
          <DonutChart colors={colors} title="Прогресс" data={taskShare} />
        </View>
      </View>
    </>
  );
}

const createStyles = () =>
  StyleSheet.create({
    grid: {
      gap: 12,
    },
    gridItem: {
      flex: 1,
    },
  });
