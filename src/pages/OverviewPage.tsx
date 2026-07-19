import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  Plane,
  Plus,
  ShieldCheck,
  WalletCards,
} from "lucide-react-native";
import { useState, type ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import type { AppPalette } from "../theme/tokens";
import type { AnalyticsTotals, PlannedItem, Profile } from "../types/domain";
import { formatRub } from "../utils/format";

type Props = {
  colors: AppPalette;
  profile: Profile;
  totals: AnalyticsTotals;
  cashflow: { label: string; value: number }[];
  planned: PlannedItem[];
  aiDraft: string;
  onChangeAiDraft: (value: string) => void;
  onSendAiDraft: () => void;
  onOpenFinance: () => void;
  onOpenPlanning: () => void;
};
type ViewMode = "focus" | "money" | "move";
const modes: { id: ViewMode; label: string; meta: string; icon: typeof LayoutDashboard }[] = [
  { id: "focus", label: "Фокус месяца", meta: "Обзор и приоритеты", icon: LayoutDashboard },
  { id: "money", label: "Деньги", meta: "Баланс и платежи", icon: WalletCards },
  { id: "move", label: "Переезд", meta: "Готовность к Чэнду", icon: Plane },
];
const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);

export function OverviewPage({
  colors,
  profile,
  totals,
  cashflow,
  planned,
  onOpenFinance,
  onOpenPlanning,
}: Props) {
  const s = createStyles(colors);
  const { width } = useWindowDimensions();
  const compact = width < 1320;
  const [mode, setMode] = useState<ViewMode>("focus");
  const remaining = Math.round((totals.leftMin + totals.leftMax) / 2);
  const upcoming = planned.filter((item) => item.status === "planned").slice(0, 4);
  const required = planned.filter((item) => item.stage === "required");
  const paid = planned.filter((item) => item.status === "paid").length;
  const firstName = profile.name.trim().split(/\s+/)[0] || "Богдан";

  return (
    <View style={s.page}>
      <View style={s.header}>
        <View>
          <Text style={s.kicker}>NOVA / РАБОЧИЙ СТОЛ</Text>
          <Text style={s.title}>Добрый день, {firstName}</Text>
          <Text style={s.subtitle}>Июль 2026 · контроль денег и подготовки к переезду</Text>
        </View>
        <View style={s.headerActions}>
          <Pressable style={s.monthButton}>
            <CalendarDays size={15} color={colors.textSoft} />
            <Text style={s.monthButtonText}>Июль 2026</Text>
            <ChevronRight size={13} color={colors.textFaint} />
          </Pressable>
          <Pressable style={s.addButton} onPress={onOpenFinance}>
            <Plus size={15} color="#06101D" />
            <Text style={s.addButtonText}>Новая операция</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.workspace}>
        <Glass colors={colors} style={[s.monthPanel, compact && s.monthPanelCompact]}>
          <View style={s.panelTitleRow}>
            <View>
              <Text style={s.panelKicker}>ТЕКУЩИЙ МЕСЯЦ</Text>
              <Text style={s.panelTitle}>Июль</Text>
            </View>
            <View style={s.liveBadge}><View style={s.liveDot} /><Text style={s.liveText}>активен</Text></View>
          </View>

          <View style={s.modeList}>
            {modes.map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;
              return (
                <Pressable key={item.id} onPress={() => setMode(item.id)} style={[s.modeItem, active && s.modeItemActive]}>
                  <View style={[s.modeIcon, active && s.modeIconActive]}><Icon size={15} color={active ? colors.text : colors.textFaint} /></View>
                  <View style={s.modeCopy}><Text style={[s.modeLabel, active && s.modeLabelActive]}>{item.label}</Text><Text style={s.modeMeta}>{item.meta}</Text></View>
                  {active ? <View style={s.modePulse} /> : <ChevronRight size={13} color={colors.textFaint} />}
                </Pressable>
              );
            })}
          </View>

          <View style={s.monthSummary}>
            <Text style={s.sectionLabel}>Сводка месяца</Text>
            <SummaryRow colors={colors} label="Текущий банк" value={formatRub(totals.currentBalance)} tone={colors.green} />
            <SummaryRow colors={colors} label="Оплачено" value={formatRub(totals.fixedExpenses)} tone={colors.textSoft} />
            <SummaryRow colors={colors} label="Будущий поток" value={`${totals.plannedMax <= 0 ? "+" : "−"}${formatRub(Math.abs(totals.plannedMax))}`} tone={totals.plannedMax <= 0 ? colors.green : colors.amber} />
            <View style={s.summaryTotal}><Text style={s.summaryTotalLabel}>Прогноз остатка</Text><Text style={s.summaryTotalValue}>{formatRub(remaining)}</Text></View>
          </View>

          {!compact && (
            <View style={s.calendar}>
              <View style={s.calendarHead}><Text style={s.sectionLabel}>Июль 2026</Text><Text style={s.calendarMeta}>Сегодня 16</Text></View>
              <View style={s.weekRow}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => <Text key={day} style={s.weekDay}>{day}</Text>)}</View>
              <View style={s.days}>{calendarDays.map((day) => <View key={day} style={[s.day, day === 16 && s.dayActive, day === 24 && s.dayPayment]}><Text style={[s.dayText, day === 16 && s.dayTextActive]}>{day}</Text></View>)}</View>
            </View>
          )}

          <View style={s.monthFooter}><Clock3 size={13} color={colors.textFaint} /><Text style={s.monthFooterText}>До конца месяца 15 дней</Text></View>
        </Glass>

        <View style={s.content}>
          <View style={s.contentHead}>
            <View><Text style={s.contentKicker}>{modes.find((item) => item.id === mode)?.label.toUpperCase()}</Text><Text style={s.contentTitle}>{mode === "focus" ? "Главное на сегодня" : mode === "money" ? "Финансовая картина" : "Готовность к переезду"}</Text></View>
            <View style={s.contextTabs}>{modes.map((item) => <Pressable key={item.id} onPress={() => setMode(item.id)} style={[s.contextTab, mode === item.id && s.contextTabActive]}><Text style={[s.contextTabText, mode === item.id && s.contextTabTextActive]}>{item.label}</Text></Pressable>)}</View>
          </View>
          {mode === "focus" && <FocusView colors={colors} totals={totals} cashflow={cashflow} remaining={remaining} upcoming={upcoming} onOpenFinance={onOpenFinance} onOpenPlanning={onOpenPlanning} />}
          {mode === "money" && <MoneyView colors={colors} totals={totals} cashflow={cashflow} remaining={remaining} planned={upcoming} onOpenFinance={onOpenFinance} onOpenPlanning={onOpenPlanning} />}
          {mode === "move" && <MoveView colors={colors} required={required} paid={paid} onOpenPlanning={onOpenPlanning} />}
        </View>
      </View>
    </View>
  );
}

function FocusView({ colors, totals, cashflow, remaining, upcoming, onOpenFinance, onOpenPlanning }: { colors: AppPalette; totals: AnalyticsTotals; cashflow: { label: string; value: number }[]; remaining: number; upcoming: PlannedItem[]; onOpenFinance: () => void; onOpenPlanning: () => void }) {
  const s = createStyles(colors);
  return <View style={s.view}>
    <View style={s.metrics}>
      <Metric colors={colors} label="Сейчас на карте" value={formatRub(totals.currentBalance)} meta="текущий остаток" />
      <Metric colors={colors} label="Свободный остаток" value={formatRub(remaining)} meta="после всех планов" positive />
      <Metric colors={colors} label="Задачи" value={`${totals.taskProgress}%`} meta={`${totals.doneTasks} завершено`} />
    </View>
    <View style={s.focusMain}>
      <Glass colors={colors} style={s.flowCard}>
        <View style={s.cardHead}><View><Text style={s.cardKicker}>ДЕНЕЖНЫЙ ПОТОК</Text><Text style={s.cardTitle}>Баланс месяца</Text></View><Pressable onPress={onOpenFinance}><Text style={s.actionLink}>Открыть финансы</Text></Pressable></View>
        <View style={s.flowValueRow}><Text style={s.flowValue}>{formatRub(remaining)}</Text><View style={s.delta}><Text style={s.deltaText}>прогноз</Text></View></View>
        <Text style={s.flowMeta}>Нажми на график, чтобы проверить каждый платёжный шаг</Text>
        <FlowChart colors={colors} data={cashflow} />
        <View style={s.axisRow}>{cashflow.map((item, index) => <Text key={`${item.label}-${index}`} style={s.axis}>{item.label}</Text>)}</View>
      </Glass>
      <Glass colors={colors} style={s.priorityCard}>
        <View style={s.priorityIcon}><ShieldCheck size={19} color={colors.green} /></View>
        <Text style={s.cardKicker}>СОСТОЯНИЕ ПЛАНА</Text>
        <Text style={s.priorityTitle}>Под контролем</Text>
        <Text style={s.priorityText}>До конца июля важно закрыть обязательные платежи и сохранить резерв.</Text>
        <View style={s.healthRow}><Text style={s.healthLabel}>Финансовое здоровье</Text><Text style={s.healthValue}>78%</Text></View>
        <View style={s.track}><View style={[s.fill, { width: "78%" }]} /></View>
        <Pressable style={s.softButton} onPress={onOpenPlanning}><Text style={s.softButtonText}>Проверить план</Text><ArrowRight size={13} color={colors.textSoft} /></Pressable>
      </Glass>
    </View>
    <View style={s.focusBottom}>
      <Glass colors={colors} style={s.upcomingCard}>
        <View style={s.cardHead}><View><Text style={s.cardKicker}>БЛИЖАЙШИЕ СОБЫТИЯ</Text><Text style={s.cardTitle}>Платежи и обязательства</Text></View><Pressable onPress={onOpenPlanning}><Text style={s.actionLink}>Все</Text></Pressable></View>
        <View style={s.paymentList}>{upcoming.slice(0, 3).map((item, index) => <PaymentRow key={item.id} colors={colors} item={item} index={index} />)}</View>
      </Glass>
      <Glass colors={colors} style={s.goalCard}>
        <View style={s.goalTop}><View style={s.goalIcon}><Plane size={18} color="#06101D" /></View><Text style={s.goalDays}>47 дней</Text></View>
        <Text style={s.cardKicker}>ГЛАВНАЯ ЦЕЛЬ</Text><Text style={s.goalTitle}>Переезд в Чэнду</Text><Text style={s.goalText}>Документы, бюджет и первые два месяца проживания.</Text>
        <View style={s.healthRow}><Text style={s.healthLabel}>Общая готовность</Text><Text style={s.healthValue}>68%</Text></View><View style={s.track}><View style={[s.fill, { width: "68%", backgroundColor: colors.accent }]} /></View>
      </Glass>
    </View>
  </View>;
}

function MoneyView({ colors, totals, cashflow, remaining, planned, onOpenFinance, onOpenPlanning }: { colors: AppPalette; totals: AnalyticsTotals; cashflow: { label: string; value: number }[]; remaining: number; planned: PlannedItem[]; onOpenFinance: () => void; onOpenPlanning: () => void }) {
  const s = createStyles(colors);
  return <View style={s.view}>
    <View style={s.moneyHero}>
      <Glass colors={colors} style={s.balancePanel}><Text style={s.cardKicker}>ДОСТУПНО ПОСЛЕ ПЛАНОВ</Text><Text style={s.balanceValue}>{formatRub(remaining)}</Text><Text style={s.balanceMeta}>при текущем банке {formatRub(totals.currentBalance)}</Text><FlowChart colors={colors} data={cashflow} compact /><Pressable style={s.darkButton} onPress={onOpenFinance}><CircleDollarSign size={14} color="#FFFFFF" /><Text style={s.darkButtonText}>Добавить операцию</Text></Pressable></Glass>
      <View style={s.moneyStats}><Glass colors={colors} style={s.moneyStat}><Text style={s.cardKicker}>ОПЛАЧЕНО</Text><Text style={s.moneyStatValue}>{formatRub(totals.fixedExpenses)}</Text><Text style={s.moneyStatMeta}>подтвержденные расходы</Text></Glass><Glass colors={colors} style={s.moneyStat}><Text style={s.cardKicker}>В ПЛАНЕ</Text><Text style={s.moneyStatValue}>{formatRub(totals.plannedMax)}</Text><Text style={s.moneyStatMeta}>предстоящая нагрузка</Text></Glass></View>
    </View>
    <Glass colors={colors} style={s.moneyTable}><View style={s.cardHead}><View><Text style={s.cardKicker}>ПЛАТЕЖНЫЙ ПЛАН</Text><Text style={s.cardTitle}>Ближайшие списания</Text></View><Pressable onPress={onOpenPlanning}><Text style={s.actionLink}>Управлять</Text></Pressable></View>{planned.map((item, index) => <PaymentRow key={item.id} colors={colors} item={item} index={index} />)}</Glass>
  </View>;
}

function MoveView({ colors, required, paid, onOpenPlanning }: { colors: AppPalette; required: PlannedItem[]; paid: number; onOpenPlanning: () => void }) {
  const s = createStyles(colors);
  const stages = [
    { title: "Документы и регистрация", meta: "Нотариус и сбор оплачены", done: true },
    { title: "Перелёт в Чэнду", meta: "Билет и маршрут", done: false },
    { title: "Общежитие", meta: "Первые два месяца", done: false },
    { title: "Финансовый резерв", meta: "Резерв на адаптацию", done: false },
  ];
  return <View style={s.view}>
    <View style={s.moveTop}><Glass colors={colors} style={s.moveProgress}><View style={s.moveScore}><Text style={s.moveScoreValue}>68%</Text><Text style={s.moveScoreLabel}>готовность</Text></View><View style={s.moveCopy}><Text style={s.cardKicker}>ПЕРЕЕЗД В ЧЭНДУ</Text><Text style={s.moveTitle}>Основной маршрут собран</Text><Text style={s.moveText}>Оплачены услуги, нотариус и регистрационный сбор. Следующий контрольный шаг — перелёт.</Text><View style={s.track}><View style={[s.fill, { width: "68%", backgroundColor: colors.accent }]} /></View></View></Glass><Glass colors={colors} style={s.moveBudget}><Text style={s.cardKicker}>ОБЯЗАТЕЛЬНЫЕ ЭТАПЫ</Text><Text style={s.moveBudgetValue}>{required.length}</Text><Text style={s.moveText}>позиций в текущем плане</Text><Text style={s.movePaid}>{paid} уже оплачено</Text></Glass></View>
    <Glass colors={colors} style={s.roadmap}><View style={s.cardHead}><View><Text style={s.cardKicker}>ДОРОЖНАЯ КАРТА</Text><Text style={s.cardTitle}>Подготовка по этапам</Text></View><Pressable onPress={onOpenPlanning}><Text style={s.actionLink}>Открыть планирование</Text></Pressable></View><View style={s.stageList}>{stages.map((stage, index) => <View key={stage.title} style={s.stage}><View style={[s.stageNumber, stage.done && s.stageDone]}>{stage.done ? <Check size={13} color="#06101D" /> : <Text style={s.stageNumberText}>{index + 1}</Text>}</View><View style={s.stageCopy}><Text style={s.stageTitle}>{stage.title}</Text><Text style={s.stageMeta}>{stage.meta}</Text></View><Text style={[s.stageStatus, stage.done && { color: colors.green }]}>{stage.done ? "Готово" : index === 1 ? "Следующий" : "В плане"}</Text></View>)}</View></Glass>
  </View>;
}

function Glass({ colors, children, style }: { colors: AppPalette; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = createStyles(colors);
  return <View style={[s.glass, style]}>{children}</View>;
}
function Metric({ colors, label, value, meta, positive }: { colors: AppPalette; label: string; value: string; meta: string; positive?: boolean }) {
  const s = createStyles(colors);
  return <Glass colors={colors} style={s.metric}><Text style={s.metricLabel}>{label}</Text><Text style={s.metricValue}>{value}</Text><Text style={[s.metricMeta, positive && { color: colors.green }]}>{positive ? "Стабильный прогноз · " : ""}{meta}</Text></Glass>;
}
function SummaryRow({ colors, label, value, tone }: { colors: AppPalette; label: string; value: string; tone: string }) {
  const s = createStyles(colors);
  return <View style={s.summaryRow}><View style={[s.summaryDot, { backgroundColor: tone }]} /><Text style={s.summaryLabel}>{label}</Text><Text style={s.summaryValue}>{value}</Text></View>;
}
function PaymentRow({ colors, item, index }: { colors: AppPalette; item: PlannedItem; index: number }) {
  const s = createStyles(colors);
  const [day = String(index + 1), month = ""] = item.due.split(".");
  return <View style={s.payment}><View style={s.paymentDate}><Text style={s.paymentDay}>{day}</Text><Text style={s.paymentMonth}>{month === "07" ? "ИЮЛ" : month === "08" ? "АВГ" : "ПЛАН"}</Text></View><View style={s.paymentCopy}><Text style={s.paymentTitle} numberOfLines={1}>{item.title}</Text><Text style={s.paymentMeta}>{item.category} · {item.due}</Text></View><Text style={[s.paymentAmount, item.type === "income" && { color: colors.green }]}>{item.type === "income" ? "+" : "−"}{formatRub(item.amountMax)}</Text></View>;
}
function FlowChart({ colors, data, compact = false }: { colors: AppPalette; data: { label: string; value: number }[]; compact?: boolean }) {
  const s = createStyles(colors);
  const [selectedIndex, setSelectedIndex] = useState(Math.max(data.length - 1, 0));
  const values = data.length ? data.map((item) => item.value) : [0];
  const width = 700;
  const height = compact ? 96 : 118;
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = Math.max(max - min, 1);
  const coordinates = values.map((value, index) => ({ x: index * (width / Math.max(values.length - 1, 1)), y: 12 + (1 - (value - min) / range) * (height - 24) }));
  const points = coordinates.map((point) => `${point.x},${point.y}`).join(" L ");
  const selected = coordinates[Math.min(selectedIndex, coordinates.length - 1)];
  return <View style={s.chartInteractive}><View style={s.chartBadge}><Text style={s.chartBadgeLabel}>{data[selectedIndex]?.label || "Сейчас"}</Text><Text style={s.chartBadgeValue}>{formatRub(data[selectedIndex]?.value || 0)}</Text></View><Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"><Defs><LinearGradient id={compact ? "flow-small" : "flow-main"} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={colors.accent} stopOpacity=".24" /><Stop offset="1" stopColor={colors.accent} stopOpacity="0" /></LinearGradient></Defs><Path d={`M ${points} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${compact ? "flow-small" : "flow-main"})`} /><Path d={`M ${points}`} fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{selected && <G><Line x1={selected.x} x2={selected.x} y1="0" y2={height} stroke={colors.borderStrong} strokeWidth="1" strokeDasharray="4 5" /><Circle cx={selected.x} cy={selected.y} r="5" fill={colors.surfaceSolid} stroke={colors.accent} strokeWidth="3" /></G>}{coordinates.map((point, index) => <Rect key={index} x={Math.max(0, point.x - width / Math.max(values.length, 1) / 2)} y="0" width={width / Math.max(values.length, 1)} height={height} fill="transparent" onPress={() => setSelectedIndex(index)} />)}</Svg></View>;
}

const blur = Platform.OS === "web" ? ({ backdropFilter: "blur(32px) saturate(125%)", WebkitBackdropFilter: "blur(32px) saturate(125%)" } as ViewStyle) : {};
const createStyles = (c: AppPalette) => StyleSheet.create({
  page: { flex: 1, minHeight: 0, padding: 16, gap: 14 },
  header: { minHeight: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }, kicker: { color: c.textFaint, fontSize: 8, fontWeight: "900" }, title: { color: c.text, fontSize: 22, lineHeight: 27, fontWeight: "800", marginTop: 3 }, subtitle: { color: c.textSoft, fontSize: 9, marginTop: 2 }, headerActions: { flexDirection: "row", gap: 7 }, monthButton: { height: 36, paddingHorizontal: 11, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderColor: c.border, backgroundColor: c.surface }, monthButtonText: { color: c.textSoft, fontSize: 9, fontWeight: "700" }, addButton: { height: 36, paddingHorizontal: 12, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: c.accent }, addButtonText: { color: "#06101D", fontSize: 9, fontWeight: "900" },
  workspace: { flex: 1, minHeight: 0, flexDirection: "row", gap: 12 }, glass: { borderRadius: 8, borderWidth: 1, borderColor: c.border, backgroundColor: c.mode === "dark" ? "rgba(17,22,29,.68)" : "rgba(250,251,252,.72)", shadowColor: c.shadow, shadowOpacity: .55, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 5, ...blur },
  monthPanel: { width: 268, minHeight: 0, padding: 13 }, monthPanelCompact: { width: 238 }, panelTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, panelKicker: { color: c.textFaint, fontSize: 7, fontWeight: "900" }, panelTitle: { color: c.text, fontSize: 19, fontWeight: "800", marginTop: 3 }, liveBadge: { height: 24, borderRadius: 6, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: c.surfaceSoft }, liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.green }, liveText: { color: c.textSoft, fontSize: 7, fontWeight: "800" },
  modeList: { gap: 5, marginTop: 13, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: c.border }, modeItem: { minHeight: 48, borderRadius: 7, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", gap: 8 }, modeItemActive: { backgroundColor: c.surfaceSolid, borderWidth: 1, borderColor: c.borderStrong }, modeIcon: { width: 29, height: 29, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceSoft }, modeIconActive: { backgroundColor: c.accentSoft }, modeCopy: { flex: 1 }, modeLabel: { color: c.textSoft, fontSize: 9, fontWeight: "700" }, modeLabelActive: { color: c.text, fontWeight: "900" }, modeMeta: { color: c.textFaint, fontSize: 7, marginTop: 2 }, modePulse: { width: 7, height: 7, borderRadius: 4, backgroundColor: c.accent },
  monthSummary: { paddingTop: 12, paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: c.border }, sectionLabel: { color: c.textFaint, fontSize: 7, fontWeight: "900", textTransform: "uppercase" }, summaryRow: { height: 30, flexDirection: "row", alignItems: "center", gap: 7 }, summaryDot: { width: 6, height: 6, borderRadius: 2 }, summaryLabel: { flex: 1, color: c.textSoft, fontSize: 8 }, summaryValue: { color: c.text, fontSize: 8, fontWeight: "800" }, summaryTotal: { marginTop: 6, paddingTop: 9, borderTopWidth: 1, borderTopColor: c.border, flexDirection: "row", justifyContent: "space-between" }, summaryTotalLabel: { color: c.textSoft, fontSize: 8, fontWeight: "700" }, summaryTotalValue: { color: c.text, fontSize: 10, fontWeight: "900" },
  calendar: { paddingTop: 12 }, calendarHead: { flexDirection: "row", justifyContent: "space-between" }, calendarMeta: { color: c.accent, fontSize: 7, fontWeight: "800" }, weekRow: { flexDirection: "row", marginTop: 10 }, weekDay: { width: "14.285%", textAlign: "center", color: c.textFaint, fontSize: 6, fontWeight: "800" }, days: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 }, day: { width: "14.285%", height: 23, alignItems: "center", justifyContent: "center", position: "relative" }, dayActive: { borderRadius: 6, backgroundColor: c.text }, dayPayment: { borderBottomWidth: 2, borderBottomColor: c.amber }, dayText: { color: c.textSoft, fontSize: 7 }, dayTextActive: { color: c.mode === "dark" ? "#06101D" : "#FFFFFF", fontWeight: "900" }, monthFooter: { marginTop: "auto", paddingTop: 10, borderTopWidth: 1, borderTopColor: c.border, flexDirection: "row", alignItems: "center", gap: 6 }, monthFooterText: { color: c.textFaint, fontSize: 7 },
  content: { flex: 1, minWidth: 0, minHeight: 0 }, contentHead: { height: 54, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, contentKicker: { color: c.accent, fontSize: 7, fontWeight: "900" }, contentTitle: { color: c.text, fontSize: 16, fontWeight: "800", marginTop: 3 }, contextTabs: { height: 32, padding: 3, borderRadius: 8, flexDirection: "row", backgroundColor: c.surface, borderWidth: 1, borderColor: c.border }, contextTab: { paddingHorizontal: 10, borderRadius: 6, alignItems: "center", justifyContent: "center" }, contextTabActive: { backgroundColor: c.surfaceSolid }, contextTabText: { color: c.textFaint, fontSize: 8, fontWeight: "700" }, contextTabTextActive: { color: c.text, fontWeight: "900" },
  view: { flex: 1, minHeight: 0, gap: 10 }, metrics: { flexDirection: "row", gap: 9 }, metric: { flex: 1, minHeight: 75, padding: 12 }, metricLabel: { color: c.textFaint, fontSize: 8, fontWeight: "700" }, metricValue: { color: c.text, fontSize: 17, fontWeight: "900", marginTop: 6 }, metricMeta: { color: c.textSoft, fontSize: 7, marginTop: 3 },
  focusMain: { flex: 1.18, minHeight: 210, flexDirection: "row", gap: 10 }, flowCard: { flex: 1, padding: 13 }, cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }, cardKicker: { color: c.textFaint, fontSize: 7, fontWeight: "900" }, cardTitle: { color: c.text, fontSize: 12, fontWeight: "800", marginTop: 3 }, actionLink: { color: c.accent, fontSize: 8, fontWeight: "800" }, flowValueRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 9 }, flowValue: { color: c.text, fontSize: 21, fontWeight: "900" }, delta: { height: 21, paddingHorizontal: 6, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: `${c.green}1C` }, deltaText: { color: c.green, fontSize: 7, fontWeight: "900" }, flowMeta: { color: c.textFaint, fontSize: 7, marginTop: 2 }, axisRow: { flexDirection: "row", justifyContent: "space-between", marginTop: -2 }, axis: { color: c.textFaint, fontSize: 6 },
  chartInteractive: { position: "relative" }, chartBadge: { position: "absolute", zIndex: 3, right: 4, top: 4, minWidth: 82, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 6, backgroundColor: c.surfaceSolid, borderWidth: 1, borderColor: c.border }, chartBadgeLabel: { color: c.textFaint, fontSize: 6, fontWeight: "800" }, chartBadgeValue: { color: c.text, fontSize: 8, fontWeight: "900", marginTop: 2 },
  priorityCard: { width: 224, padding: 13 }, priorityIcon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: `${c.green}18`, marginBottom: 10 }, priorityTitle: { color: c.text, fontSize: 17, fontWeight: "900", marginTop: 6 }, priorityText: { color: c.textSoft, fontSize: 8, lineHeight: 13, marginTop: 5 }, healthRow: { flexDirection: "row", justifyContent: "space-between", marginTop: "auto", paddingTop: 10 }, healthLabel: { color: c.textFaint, fontSize: 7 }, healthValue: { color: c.text, fontSize: 8, fontWeight: "900" }, track: { height: 5, borderRadius: 3, backgroundColor: c.surfaceSolid, marginTop: 6, overflow: "hidden" }, fill: { height: "100%", borderRadius: 3, backgroundColor: c.green }, softButton: { height: 32, marginTop: 10, borderRadius: 7, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: c.surfaceSoft }, softButtonText: { color: c.textSoft, fontSize: 8, fontWeight: "800" },
  focusBottom: { flex: .82, minHeight: 155, flexDirection: "row", gap: 10 }, upcomingCard: { flex: 1.35, padding: 13 }, paymentList: { marginTop: 7 }, payment: { minHeight: 43, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: c.border }, paymentDate: { width: 31, alignItems: "center" }, paymentDay: { color: c.text, fontSize: 10, fontWeight: "900" }, paymentMonth: { color: c.textFaint, fontSize: 6, marginTop: 1 }, paymentCopy: { flex: 1, minWidth: 0 }, paymentTitle: { color: c.text, fontSize: 8, fontWeight: "800" }, paymentMeta: { color: c.textFaint, fontSize: 7, marginTop: 2 }, paymentAmount: { color: c.red, fontSize: 8, fontWeight: "900" },
  goalCard: { flex: .75, padding: 13 }, goalTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }, goalIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: c.accent }, goalDays: { color: c.textFaint, fontSize: 7, fontWeight: "800" }, goalTitle: { color: c.text, fontSize: 14, fontWeight: "900", marginTop: 4 }, goalText: { color: c.textSoft, fontSize: 8, lineHeight: 12, marginTop: 4 },
  moneyHero: { flex: 1, minHeight: 245, flexDirection: "row", gap: 10 }, balancePanel: { flex: 1, padding: 15 }, balanceValue: { color: c.text, fontSize: 29, fontWeight: "900", marginTop: 9 }, balanceMeta: { color: c.textFaint, fontSize: 8, marginTop: 3 }, darkButton: { alignSelf: "flex-start", height: 33, borderRadius: 7, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: c.mode === "dark" ? "#EAF2FF" : "#151A23" }, darkButtonText: { color: c.mode === "dark" ? "#07101D" : "#FFFFFF", fontSize: 8, fontWeight: "900" }, moneyStats: { width: 230, gap: 10 }, moneyStat: { flex: 1, padding: 13 }, moneyStatValue: { color: c.text, fontSize: 18, fontWeight: "900", marginTop: 8 }, moneyStatMeta: { color: c.textFaint, fontSize: 7, marginTop: 3 }, moneyTable: { flex: 1, minHeight: 195, padding: 13 },
  moveTop: { flexDirection: "row", gap: 10 }, moveProgress: { flex: 1, minHeight: 150, padding: 15, flexDirection: "row", alignItems: "center", gap: 17 }, moveScore: { width: 92, height: 92, borderRadius: 46, borderWidth: 8, borderColor: c.accentSoft, alignItems: "center", justifyContent: "center" }, moveScoreValue: { color: c.text, fontSize: 20, fontWeight: "900" }, moveScoreLabel: { color: c.textFaint, fontSize: 7, marginTop: 2 }, moveCopy: { flex: 1 }, moveTitle: { color: c.text, fontSize: 17, fontWeight: "900", marginTop: 5 }, moveText: { color: c.textSoft, fontSize: 8, lineHeight: 13, marginTop: 5 }, moveBudget: { width: 210, padding: 14 }, moveBudgetValue: { color: c.text, fontSize: 34, fontWeight: "900", marginTop: 12 }, movePaid: { color: c.green, fontSize: 8, fontWeight: "800", marginTop: "auto" }, roadmap: { flex: 1, minHeight: 0, padding: 14 }, stageList: { marginTop: 8 }, stage: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: c.border }, stageNumber: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceSoft }, stageDone: { backgroundColor: c.green }, stageNumberText: { color: c.textSoft, fontSize: 8, fontWeight: "900" }, stageCopy: { flex: 1 }, stageTitle: { color: c.text, fontSize: 9, fontWeight: "800" }, stageMeta: { color: c.textFaint, fontSize: 7, marginTop: 2 }, stageStatus: { color: c.textFaint, fontSize: 7, fontWeight: "800" },
});
