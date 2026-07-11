import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  SlidersHorizontal,
  Wallet,
} from "lucide-react-native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/ui/Button";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { Surface } from "../components/ui/Surface";
import { TextField } from "../components/ui/TextField";
import { CategoryChart } from "../features/finance/components/CategoryChart";
import { FinanceTable } from "../features/finance/components/FinanceTable";
import type { AppPalette } from "../theme/tokens";
import type { MoneyType, Transaction } from "../types/domain";
import { formatRub } from "../utils/format";

type Props = {
  colors: AppPalette;
  transactions: Transaction[];
  chartItems: { category: string; amount: number }[];
  transactionTitle: string;
  transactionAmount: string;
  transactionType: MoneyType;
  onChangeTitle: (v: string) => void;
  onChangeAmount: (v: string) => void;
  onChangeType: (v: MoneyType) => void;
  onAddTransaction: () => void;
};
export function FinancePage(p: Props) {
  const s = css(p.colors);
  const income = p.transactions
    .filter((x) => x.type === "income")
    .reduce((a, x) => a + x.amount, 0);
  const expense = p.transactions
    .filter((x) => x.type === "expense")
    .reduce((a, x) => a + x.amount, 0);
  const add = () => {
    if (
      !p.transactionTitle.trim() ||
      Number(p.transactionAmount.replace(",", ".")) <= 0
    ) {
      Alert.alert("Проверь данные", "Укажи название и сумму больше нуля.");
      return;
    }
    p.onAddTransaction();
  };
  return (
    <View style={s.page}>
      <View style={s.head}>
        <View>
          <Text style={s.kicker}>MONEY WORKSPACE</Text>
          <Text style={s.title}>Финансы</Text>
          <Text style={s.sub}>Счета, операции и структура расходов.</Text>
        </View>
        <Button
          colors={p.colors}
          label="Добавить операцию"
          icon={<Plus size={15} color="#03101F" />}
          onPress={add}
        />
      </View>
      <View style={s.metrics}>
        <Metric
          c={p.colors}
          icon={<Wallet size={18} color={p.colors.accent} />}
          label="Чистый баланс"
          value={formatRub(income - expense)}
        />
        <Metric
          c={p.colors}
          icon={<ArrowDownLeft size={18} color={p.colors.green} />}
          label="Доходы"
          value={formatRub(income)}
        />
        <Metric
          c={p.colors}
          icon={<ArrowUpRight size={18} color={p.colors.red} />}
          label="Расходы"
          value={formatRub(expense)}
        />
      </View>
      <View style={s.grid}>
        <View style={s.main}>
          <Surface colors={p.colors} style={s.toolbar}>
            <View style={s.search}>
              <Search size={15} color={p.colors.textFaint} />
              <Text style={s.searchText}>
                Поиск и фильтрация доступны в общей шапке
              </Text>
            </View>
            <Pressable style={s.filter}>
              <SlidersHorizontal size={14} color={p.colors.textSoft} />
              <Text style={s.filterText}>Все операции</Text>
            </Pressable>
          </Surface>
          <FinanceTable colors={p.colors} items={p.transactions} />
        </View>
        <View style={s.side}>
          <Surface colors={p.colors} style={s.form}>
            <Text style={s.panelTitle}>Быстрое добавление</Text>
            <Text style={s.panelSub}>Операция сразу изменит общий баланс</Text>
            <TextField
              colors={p.colors}
              value={p.transactionTitle}
              onChangeText={p.onChangeTitle}
              placeholder="Название операции"
            />
            <TextField
              colors={p.colors}
              value={p.transactionAmount}
              onChangeText={p.onChangeAmount}
              placeholder="Сумма, ₽"
              keyboardType="decimal-pad"
            />
            <SegmentedControl
              colors={p.colors}
              value={p.transactionType}
              onChange={p.onChangeType}
              options={[
                { label: "Доход", value: "income" },
                { label: "Расход", value: "expense" },
              ]}
            />
            <Button colors={p.colors} label="Сохранить" onPress={add} />
          </Surface>
          <CategoryChart colors={p.colors} items={p.chartItems} />
        </View>
      </View>
    </View>
  );
}
function Metric({
  c,
  icon,
  label,
  value,
}: {
  c: AppPalette;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const s = css(c);
  return (
    <Surface colors={c} style={s.metric}>
      <View style={s.metricIcon}>{icon}</View>
      <View>
        <Text style={s.metricLabel}>{label}</Text>
        <Text style={s.metricValue}>{value}</Text>
      </View>
    </Surface>
  );
}
const css = (c: AppPalette) =>
  StyleSheet.create({
    page: { paddingTop: 22, gap: 14 },
    head: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    kicker: { color: c.textFaint, fontSize: 9, fontWeight: "800" },
    title: { color: c.text, fontSize: 25, fontWeight: "700", marginTop: 5 },
    sub: { color: c.textSoft, fontSize: 11, marginTop: 4 },
    metrics: { flexDirection: "row", gap: 10 },
    metric: {
      flex: 1,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
    },
    metricIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.surfaceSolid,
    },
    metricLabel: { color: c.textFaint, fontSize: 9 },
    metricValue: {
      color: c.text,
      fontSize: 17,
      fontWeight: "800",
      marginTop: 3,
    },
    grid: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    main: { flex: 1, gap: 10 },
    side: { width: 340, gap: 10 },
    toolbar: {
      height: 48,
      paddingHorizontal: 11,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    search: { flexDirection: "row", alignItems: "center", gap: 8 },
    searchText: { color: c.textFaint, fontSize: 10 },
    filter: {
      height: 30,
      paddingHorizontal: 9,
      borderRadius: 7,
      backgroundColor: c.surfaceSolid,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    filterText: { color: c.textSoft, fontSize: 10, fontWeight: "700" },
    form: { padding: 14, gap: 9 },
    panelTitle: { color: c.text, fontSize: 14, fontWeight: "800" },
    panelSub: { color: c.textFaint, fontSize: 9, marginBottom: 3 },
  });
