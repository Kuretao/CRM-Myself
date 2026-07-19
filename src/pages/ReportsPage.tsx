import {
  BarChart3,
  CalendarDays,
  CheckSquare2,
  Download,
  Gauge,
  PieChart,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
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
type Period = "month" | "quarter" | "year";
type ReportView = "overview" | "expenses" | "tasks";

const periods: { id: Period; label: string }[] = [
  { id: "month", label: "Месяц" },
  { id: "quarter", label: "Квартал" },
  { id: "year", label: "Год" },
];
const views: { id: ReportView; label: string; hint: string; icon: typeof Gauge }[] = [
  { id: "overview", label: "Обзор", hint: "Баланс и сценарии", icon: Gauge },
  { id: "expenses", label: "Расходы", hint: "Категории и доли", icon: PieChart },
  { id: "tasks", label: "Исполнение", hint: "Задачи и прогресс", icon: CheckSquare2 },
];

export function ReportsPage(props: Props) {
  const { width } = useWindowDimensions();
  const stacked = width < 1080;
  const mobile = width < 720;
  const styles = css(props.colors, stacked, mobile);
  const [period, setPeriod] = useState<Period>("quarter");
  const [view, setView] = useState<ReportView>("overview");
  const [exported, setExported] = useState(false);

  const visibleCashflow = useMemo(() => {
    if (period === "month") return props.cashflow.slice(-4);
    if (period === "quarter") return props.cashflow.slice(-7);
    return props.cashflow;
  }, [period, props.cashflow]);
  const expenseData = props.expenseShare.slice(0, 5).map((item) => ({ label: item.category, value: item.amount }));
  const balance = visibleCashflow.at(-1)?.value || 0;
  const previousBalance = visibleCashflow.at(-2)?.value || balance;
  const expenses = props.expenseShare.reduce((sum, item) => sum + item.amount, 0);
  const topExpense = props.expenseShare[0];
  const change = balance - previousBalance;
  const taskTotal = props.taskShare.reduce((sum, item) => sum + item.value, 0);
  const taskDone = props.taskShare.find((item) => item.label === "Done")?.value || 0;
  const taskProgress = taskTotal ? Math.round((taskDone / taskTotal) * 100) : 0;

  const exportCsv = () => {
    const rows = [
      ["Раздел", "Название", "Значение"],
      ...visibleCashflow.map((item) => ["Движение денег", item.label, item.value]),
      ...props.expenseShare.map((item) => ["Расходы", item.category, item.amount]),
      ...props.taskShare.map((item) => ["Задачи", item.label, item.value]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n");
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nova-analytics-${period}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
    setExported(true);
  };

  return (
    <View style={styles.page}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.kicker}>NOVA INTELLIGENCE</Text>
          <Text style={styles.title}>Аналитика</Text>
          <Text style={styles.sub}>Управляй прогнозом, расходами и исполнением из одного центра.</Text>
        </View>
        <View style={styles.headingActions}>
          <View style={styles.periods}>
            {periods.map((item) => (
              <Pressable key={item.id} onPress={() => setPeriod(item.id)} style={[styles.period, period === item.id && styles.periodOn]}>
                <Text style={[styles.periodText, period === item.id && styles.periodTextOn]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={[styles.export, exported && styles.exportDone]} onPress={exportCsv}>
            <Download size={14} color={exported ? props.colors.green : props.colors.textSoft} />
            <Text style={[styles.exportText, exported && { color: props.colors.green }]}>{exported ? "Скачано" : "Экспорт"}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.workspace}>
        <Surface colors={props.colors} style={styles.navigator}>
          <View style={styles.navHead}>
            <BarChart3 size={16} color={props.colors.text} />
            <View>
              <Text style={styles.navTitle}>Рабочий отчёт</Text>
              <Text style={styles.navMeta}>Данные обновляются локально</Text>
            </View>
          </View>
          <View style={styles.navGroup}>
            <Text style={styles.navGroupTitle}>ПРЕДСТАВЛЕНИЯ</Text>
            {views.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <Pressable key={item.id} style={[styles.navItem, active && styles.navItemOn]} onPress={() => setView(item.id)}>
                  <View style={[styles.navIcon, active && styles.navIconOn]}><Icon size={15} color={active ? props.colors.text : props.colors.textFaint} /></View>
                  <View style={styles.navCopy}>
                    <Text style={[styles.navLabel, active && styles.navLabelOn]}>{item.label}</Text>
                    <Text style={styles.navHint}>{item.hint}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.navSnapshot}>
            <Text style={styles.navGroupTitle}>СНИМОК ПЕРИОДА</Text>
            <SnapshotRow colors={props.colors} label="Прогноз" value={formatRub(balance)} />
            <SnapshotRow colors={props.colors} label="Расходы" value={formatRub(expenses)} />
            <SnapshotRow colors={props.colors} label="Задачи" value={`${taskProgress}%`} />
          </View>
          <View style={styles.healthCard}>
            <ShieldCheck size={16} color={balance >= 0 ? props.colors.green : props.colors.red} />
            <View style={styles.navCopy}>
              <Text style={styles.healthTitle}>{balance >= 0 ? "План устойчив" : "Нужна корректировка"}</Text>
              <Text style={styles.healthText}>Проверка обязательных расходов включена</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.reportArea}>
          <View style={styles.metrics}>
            <Metric colors={props.colors} icon={WalletCards} label="Прогнозный остаток" value={formatRub(balance)} tone={props.colors.green} hint={`${change >= 0 ? "+" : ""}${formatRub(change)} на последнем шаге`} />
            <Metric colors={props.colors} icon={TrendingDown} label="Все расходы" value={formatRub(expenses)} tone={props.colors.red} hint={topExpense ? `Лидер: ${topExpense.category}` : "Нет данных"} />
            <Metric colors={props.colors} icon={CheckSquare2} label="Исполнение задач" value={`${taskProgress}%`} tone={props.colors.accent} hint={`${taskDone} из ${taskTotal} завершено`} />
          </View>

          {view === "overview" && (
            <>
              <View style={styles.primaryGrid}>
                <View style={styles.chartColumn}>
                  <LineChart colors={props.colors} title={`Движение денег · ${periods.find((item) => item.id === period)?.label.toLowerCase()}`} data={visibleCashflow} />
                </View>
                <Surface colors={props.colors} style={styles.insightCard}>
                  <View style={styles.insightHead}><View style={styles.insightIcon}><TrendingUp size={15} color={props.colors.accent} /></View><Text style={styles.insightTitle}>Фокус периода</Text></View>
                  <Text style={styles.insightValue}>{formatRub(balance)}</Text>
                  <Text style={styles.insightCopy}>Прогноз после всех отмеченных поступлений и обязательных оплат.</Text>
                  <View style={styles.insightDivider} />
                  <InsightRow colors={props.colors} label="Крупнейшая статья" value={topExpense?.category || "Нет данных"} />
                  <InsightRow colors={props.colors} label="Сумма статьи" value={topExpense ? formatRub(topExpense.amount) : "—"} />
                  <InsightRow colors={props.colors} label="Этапов прогноза" value={`${visibleCashflow.length}`} />
                  <Pressable style={styles.insightButton} onPress={() => setView("expenses")}>
                    <PieChart size={13} color={props.colors.text} />
                    <Text style={styles.insightButtonText}>Открыть расходы</Text>
                  </Pressable>
                </Surface>
              </View>
              <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Сценарии</Text><Text style={styles.sectionSub}>Сравнение возможного остатка</Text></View>
              <ScenarioCards colors={props.colors} items={props.scenarios} />
            </>
          )}

          {view === "expenses" && (
            <View style={styles.detailGrid}>
              <DonutChart colors={props.colors} title="Структура расходов" data={expenseData} />
              <Surface colors={props.colors} style={styles.ranking}>
                <View style={styles.rankingHead}><View><Text style={styles.kicker}>КАТЕГОРИИ</Text><Text style={styles.rankingTitle}>Рейтинг расходов</Text></View><Text style={styles.rankingTotal}>{formatRub(expenses)}</Text></View>
                {props.expenseShare.slice(0, 7).map((item, index) => {
                  const share = expenses ? Math.round((item.amount / expenses) * 100) : 0;
                  return (
                    <View key={item.category} style={styles.rankRow}>
                      <Text style={styles.rankIndex}>{String(index + 1).padStart(2, "0")}</Text>
                      <View style={styles.rankCopy}><View style={styles.rankLine}><Text style={styles.rankLabel}>{item.category}</Text><Text style={styles.rankValue}>{formatRub(item.amount)}</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${share}%` }]} /></View></View>
                      <Text style={styles.rankShare}>{share}%</Text>
                    </View>
                  );
                })}
              </Surface>
            </View>
          )}

          {view === "tasks" && (
            <View style={styles.detailGrid}>
              <DonutChart colors={props.colors} title="Статусы задач" data={props.taskShare} valueMode="count" />
              <Surface colors={props.colors} style={styles.ranking}>
                <View style={styles.rankingHead}><View><Text style={styles.kicker}>ИСПОЛНЕНИЕ</Text><Text style={styles.rankingTitle}>Контроль фокуса</Text></View><Text style={styles.rankingTotal}>{taskProgress}%</Text></View>
                {props.taskShare.map((item, index) => {
                  const share = taskTotal ? Math.round((item.value / taskTotal) * 100) : 0;
                  const labels = ["Нужно сделать", "В работе", "Завершено"];
                  return (
                    <View key={item.label} style={styles.taskStatus}>
                      <View style={[styles.statusMark, { backgroundColor: [props.colors.textFaint, props.colors.amber, props.colors.green][index] }]} />
                      <View style={styles.rankCopy}><Text style={styles.rankLabel}>{labels[index] || item.label}</Text><Text style={styles.navHint}>{share}% от всех задач</Text></View>
                      <Text style={styles.taskCount}>{item.value}</Text>
                    </View>
                  );
                })}
                <View style={styles.calendarNote}><CalendarDays size={15} color={props.colors.textSoft} /><Text style={styles.calendarText}>Период меняет финансовый график; задачи показываются по текущему состоянию.</Text></View>
              </Surface>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function Metric({ colors, icon: Icon, label, value, tone, hint }: { colors: AppPalette; icon: typeof TrendingUp; label: string; value: string; tone: string; hint: string }) {
  const styles = css(colors, false);
  return <Surface colors={colors} style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: `${tone}20` }]}><Icon size={15} color={tone} /></View><View style={styles.metricCopy}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricHint}>{hint}</Text></View></Surface>;
}
function SnapshotRow({ colors, label, value }: { colors: AppPalette; label: string; value: string }) {
  const styles = css(colors, false);
  return <View style={styles.snapshotRow}><Text style={styles.snapshotLabel}>{label}</Text><Text style={styles.snapshotValue}>{value}</Text></View>;
}
function InsightRow({ colors, label, value }: { colors: AppPalette; label: string; value: string }) {
  const styles = css(colors, false);
  return <View style={styles.insightRow}><Text style={styles.insightRowLabel}>{label}</Text><Text style={styles.insightRowValue} numberOfLines={1}>{value}</Text></View>;
}

const css = (colors: AppPalette, stacked: boolean, mobile = false) => StyleSheet.create({
  page: { width: "100%", paddingTop: 20, paddingBottom: 28, gap: 14 },
  heading: { flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "stretch" : "flex-end", gap: 16 },
  kicker: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
  title: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 5 },
  sub: { color: colors.textSoft, fontSize: 10, marginTop: 4 },
  headingActions: { width: mobile ? "100%" : undefined, flexDirection: "row", gap: 8, alignItems: "center" },
  periods: { flex: mobile ? 1 : undefined, height: 38, padding: 4, flexDirection: "row", borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  period: { flex: mobile ? 1 : undefined, height: 28, paddingHorizontal: 10, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  periodOn: { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border },
  periodText: { color: colors.textFaint, fontSize: 8, fontWeight: "800" },
  periodTextOn: { color: colors.text },
  export: { height: 38, paddingHorizontal: 11, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", gap: 6 },
  exportDone: { borderColor: `${colors.green}88` },
  exportText: { color: colors.textSoft, fontSize: 9, fontWeight: "800" },
  workspace: { flexDirection: stacked ? "column" : "row", gap: 12, alignItems: "flex-start" },
  navigator: { width: stacked ? "100%" : 230, padding: 11 },
  navHead: { minHeight: 48, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  navTitle: { color: colors.text, fontSize: 10, fontWeight: "900" },
  navMeta: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  navGroup: { paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  navGroupTitle: { color: colors.textFaint, fontSize: 7, fontWeight: "900", marginBottom: 6 },
  navItem: { minHeight: 48, paddingHorizontal: 6, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, borderWidth: 1, borderColor: "transparent" },
  navItemOn: { backgroundColor: colors.surfaceSoft, borderColor: colors.border },
  navIcon: { width: 30, height: 30, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  navIconOn: { backgroundColor: colors.surfaceSolid },
  navCopy: { flex: 1, minWidth: 0 },
  navLabel: { color: colors.textSoft, fontSize: 9, fontWeight: "800" },
  navLabelOn: { color: colors.text },
  navHint: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  navSnapshot: { paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  snapshotRow: { height: 30, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  snapshotLabel: { color: colors.textFaint, fontSize: 8 },
  snapshotValue: { color: colors.text, fontSize: 8, fontWeight: "900" },
  healthCard: { marginTop: 10, minHeight: 58, padding: 9, borderRadius: 8, flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: colors.surfaceSoft },
  healthTitle: { color: colors.text, fontSize: 8, fontWeight: "900" },
  healthText: { color: colors.textFaint, fontSize: 7, lineHeight: 11, marginTop: 3 },
  reportArea: { flex: 1, width: stacked ? "100%" : undefined, minWidth: 0, gap: 12 },
  metrics: { flexDirection: mobile ? "column" : "row", gap: 10 },
  metric: { flex: mobile ? undefined : 1, width: mobile ? "100%" : undefined, minHeight: 88, padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 9 },
  metricIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  metricCopy: { flex: 1, minWidth: 0 },
  metricLabel: { color: colors.textFaint, fontSize: 8 },
  metricValue: { color: colors.text, fontSize: 14, fontWeight: "900", marginTop: 3 },
  metricHint: { color: colors.textSoft, fontSize: 7, marginTop: 5 },
  primaryGrid: { flexDirection: stacked ? "column" : "row", gap: 12, alignItems: "stretch" },
  chartColumn: { flex: 1, minWidth: 0 },
  insightCard: { width: stacked ? "100%" : 252, padding: 14 },
  insightHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  insightIcon: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: colors.accentSoft },
  insightTitle: { color: colors.text, fontSize: 10, fontWeight: "900" },
  insightValue: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: 13 },
  insightCopy: { color: colors.textSoft, fontSize: 8, lineHeight: 13, marginTop: 5 },
  insightDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  insightRow: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 9 },
  insightRowLabel: { color: colors.textFaint, fontSize: 7 },
  insightRowValue: { flex: 1, color: colors.textSoft, fontSize: 8, textAlign: "right", fontWeight: "800" },
  insightButton: { marginTop: 6, height: 34, borderRadius: 7, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  insightButtonText: { color: colors.text, fontSize: 8, fontWeight: "900" },
  sectionHead: { flexDirection: "row", alignItems: "baseline", gap: 8, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: 12, fontWeight: "900" },
  sectionSub: { color: colors.textFaint, fontSize: 8 },
  detailGrid: { width: "100%", flexDirection: stacked ? "column" : "row", gap: 12, alignItems: "stretch" },
  ranking: { flex: 1, minHeight: 360, padding: 15 },
  rankingHead: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 12 },
  rankingTitle: { color: colors.text, fontSize: 13, fontWeight: "900", marginTop: 4 },
  rankingTotal: { color: colors.textSoft, fontSize: 11, fontWeight: "900" },
  rankRow: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  rankIndex: { width: 22, color: colors.textFaint, fontSize: 7, fontWeight: "900" },
  rankCopy: { flex: 1, minWidth: 0 },
  rankLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  rankLabel: { color: colors.text, fontSize: 8, fontWeight: "800" },
  rankValue: { color: colors.textSoft, fontSize: 8, fontWeight: "900" },
  track: { height: 3, marginTop: 5, borderRadius: 2, backgroundColor: colors.surfaceSoft, overflow: "hidden" },
  fill: { height: "100%", minWidth: 3, borderRadius: 2, backgroundColor: colors.accent },
  rankShare: { width: 30, color: colors.textFaint, fontSize: 8, textAlign: "right" },
  taskStatus: { minHeight: 64, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  statusMark: { width: 8, height: 8, borderRadius: 3 },
  taskCount: { color: colors.text, fontSize: 18, fontWeight: "900" },
  calendarNote: { marginTop: 14, padding: 11, borderRadius: 8, flexDirection: "row", gap: 9, backgroundColor: colors.surfaceSoft },
  calendarText: { flex: 1, color: colors.textSoft, fontSize: 8, lineHeight: 13 },
});
