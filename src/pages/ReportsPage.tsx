import { Download, TrendingUp } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Surface } from "../components/ui/Surface";
import { DonutChart } from "../features/reports/components/DonutChart";
import { LineChart } from "../features/reports/components/LineChart";
import { ScenarioCards } from "../features/reports/components/ScenarioCards";
import type { AppPalette } from "../theme/tokens";
import { formatRub } from "../utils/format";
type Props = {
  colors: AppPalette;
  cashflow: { label: string; value: number }[];
  expenseShare: { category: string; amount: number }[];
  taskShare: { label: string; value: number }[];
  scenarios: {
    title: string;
    description: string;
    value: number;
    tone: "accent" | "green" | "amber";
  }[];
};
export function ReportsPage(p: Props) {
  const s = css(p.colors);
  const last = p.cashflow.at(-1)?.value || 0;
  const expenses = p.expenseShare.reduce((a, x) => a + x.amount, 0);
  return (
    <View style={s.page}>
      <View style={s.head}>
        <View>
          <Text style={s.kicker}>INTELLIGENCE CENTER</Text>
          <Text style={s.title}>Аналитика</Text>
          <Text style={s.sub}>
            Прогнозы, структура бюджета и контроль рисков.
          </Text>
        </View>
        <View style={s.actions}>
          <View style={s.periods}>
            <Text style={s.period}>Месяц</Text>
            <Text style={s.periodOn}>Квартал</Text>
            <Text style={s.period}>Год</Text>
          </View>
          <Pressable style={s.export}>
            <Download size={14} color={p.colors.textSoft} />
            <Text style={s.exportText}>Экспорт</Text>
          </Pressable>
        </View>
      </View>
      <View style={s.metrics}>
        <Metric
          c={p.colors}
          label="Прогнозный остаток"
          value={formatRub(last)}
          tone={p.colors.green}
        />
        <Metric
          c={p.colors}
          label="Расходная нагрузка"
          value={formatRub(expenses)}
          tone={p.colors.red}
        />
        <Metric
          c={p.colors}
          label="Финансовое здоровье"
          value="74 / 100"
          tone={p.colors.accent}
        />
      </View>
      <LineChart
        colors={p.colors}
        title="Денежный поток после ключевых этапов"
        data={p.cashflow}
      />
      <ScenarioCards colors={p.colors} items={p.scenarios} />
      <View style={s.grid}>
        <DonutChart
          colors={p.colors}
          title="Структура расходов"
          data={p.expenseShare
            .slice(0, 5)
            .map((x) => ({ label: x.category, value: x.amount }))}
        />
        <DonutChart
          colors={p.colors}
          title="Прогресс задач"
          data={p.taskShare}
        />
      </View>
    </View>
  );
}
function Metric({
  c,
  label,
  value,
  tone,
}: {
  c: AppPalette;
  label: string;
  value: string;
  tone: string;
}) {
  const s = css(c);
  return (
    <Surface colors={c} style={s.metric}>
      <View style={[s.metricIcon, { backgroundColor: `${tone}22` }]}>
        <TrendingUp size={16} color={tone} />
      </View>
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
    actions: { flexDirection: "row", gap: 8 },
    periods: {
      height: 36,
      padding: 4,
      borderRadius: 8,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      alignItems: "center",
    },
    period: { color: c.textFaint, fontSize: 9, paddingHorizontal: 10 },
    periodOn: {
      color: c.text,
      fontSize: 9,
      fontWeight: "800",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 6,
      backgroundColor: c.surfaceSolid,
    },
    export: {
      height: 36,
      paddingHorizontal: 11,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    exportText: { color: c.textSoft, fontSize: 10, fontWeight: "700" },
    metrics: { flexDirection: "row", gap: 10 },
    metric: {
      flex: 1,
      padding: 13,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    metricIcon: {
      width: 34,
      height: 34,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    metricLabel: { color: c.textFaint, fontSize: 9 },
    metricValue: {
      color: c.text,
      fontSize: 16,
      fontWeight: "800",
      marginTop: 3,
    },
    grid: { flexDirection: "row", gap: 12 },
  });
