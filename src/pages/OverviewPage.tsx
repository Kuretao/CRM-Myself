import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  MoreHorizontal,
  Plane,
  Plus,
  WalletCards,
} from "lucide-react-native";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { useState } from "react";
import type { AppPalette } from "../theme/tokens";
import type { AnalyticsTotals, PlannedItem, Profile } from "../types/domain";
import { formatRub } from "../utils/format";

type Props = {
  colors: AppPalette;
  profile: Profile;
  totals: AnalyticsTotals;
  planned: PlannedItem[];
  aiDraft: string;
  onChangeAiDraft: (value: string) => void;
  onSendAiDraft: () => void;
  onOpenFinance: () => void;
  onOpenPlanning: () => void;
};

const chart = [34, 38, 31, 44, 40, 53, 48, 59, 51, 67, 62, 76, 70, 82, 74, 88];

export function OverviewPage({
  colors,
  totals,
  planned,
  onOpenFinance,
  onOpenPlanning,
}: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 1250;
  const styles = createStyles(colors);
  const remaining = Math.round((totals.leftMin + totals.leftMax) / 2);
  const upcoming = planned
    .filter((item) => item.status === "planned")
    .slice(0, 4);
  const [period, setPeriod] = useState<"1m" | "6m" | "1y">("6m");

  return (
    <View style={styles.page}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.eyebrow}>СУББОТА, 11 ИЮЛЯ</Text>
          <Text style={styles.title}>Добрый день, Богдан</Text>
          <Text style={styles.subtitle}>
            Вот что происходит с деньгами и подготовкой к переезду.
          </Text>
        </View>
        <View style={styles.titleActions}>
          <Pressable style={styles.secondaryButton}>
            <CalendarDays size={15} color={colors.textSoft} />
            <Text style={styles.secondaryText}>Июль 2026</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onOpenFinance}>
            <Plus size={16} color="#17130D" />
            <Text style={styles.primaryText}>Добавить операцию</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.kpiRow, compact && styles.kpiRowCompact]}>
        <Kpi
          colors={colors}
          label="Общий банк"
          value={formatRub(totals.income)}
          delta="+18,4%"
          positive
        />
        <Kpi
          colors={colors}
          label="Уже оплачено"
          value={formatRub(totals.fixedExpenses)}
          delta="за июль"
        />
        <Kpi
          colors={colors}
          label="План расходов"
          value={formatRub(totals.plannedMax)}
          delta={`${planned.length} платежей`}
        />
        <Kpi
          colors={colors}
          label="Останется"
          value={formatRub(remaining)}
          delta="после всех планов"
          positive
        />
      </View>

      <View style={[styles.dashboard, compact && styles.dashboardCompact]}>
        <View style={styles.mainColumn}>
          <View style={styles.chartRow}>
            <View style={styles.balanceCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>Движение денег</Text>
                  <Text style={styles.cardSub}>
                    Фактический и прогнозный баланс
                  </Text>
                </View>
                <View style={styles.periods}>
                  {(
                    [
                      ["1m", "1 мес"],
                      ["6m", "6 мес"],
                      ["1y", "1 год"],
                    ] as const
                  ).map(([key, label]) => (
                    <Pressable key={key} onPress={() => setPeriod(key)}>
                      <Text
                        style={
                          period === key ? styles.periodActive : styles.period
                        }
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.chartValueRow}>
                <Text style={styles.chartValue}>
                  {formatRub(totals.income - totals.fixedExpenses)}
                </Text>
                <Text style={styles.growth}>↗ 12,8%</Text>
              </View>
              <BalanceChart colors={colors} period={period} />
              <View style={styles.chartFooter}>
                <Text style={styles.axis}>Фев</Text>
                <Text style={styles.axis}>Мар</Text>
                <Text style={styles.axis}>Апр</Text>
                <Text style={styles.axis}>Май</Text>
                <Text style={styles.axis}>Июн</Text>
                <Text style={styles.axis}>Июл</Text>
              </View>
            </View>
            <View style={styles.forecastCard}>
              <Text style={styles.forecastLabel}>ФИНАНСОВОЕ ЗДОРОВЬЕ</Text>
              <Text style={styles.forecastValue}>74</Text>
              <Text style={styles.forecastOf}>из 100</Text>
              <View style={styles.healthTrack}>
                <View style={styles.healthFill} />
              </View>
              <Text style={styles.forecastTitle}>Устойчивый план</Text>
              <Text style={styles.forecastText}>
                Главный риск — крупные обязательные платежи до конца июля.
              </Text>
              <Pressable style={styles.forecastAction} onPress={onOpenPlanning}>
                <Text style={styles.forecastActionText}>
                  Посмотреть прогноз
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomGrid}>
            <View style={styles.spendingCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>Структура расходов</Text>
                  <Text style={styles.cardSub}>Текущий финансовый план</Text>
                </View>
                <MoreHorizontal size={18} color={colors.textFaint} />
              </View>
              <View style={styles.donutContent}>
                <Donut colors={colors} />
                <View style={styles.legend}>
                  <Legend
                    color={colors.accent}
                    label="Учеба"
                    value="42%"
                    colors={colors}
                  />
                  <Legend
                    color={colors.green}
                    label="Жизнь"
                    value="28%"
                    colors={colors}
                  />
                  <Legend
                    color={colors.blue}
                    label="Переезд"
                    value="18%"
                    colors={colors}
                  />
                  <Legend
                    color={colors.red}
                    label="Другое"
                    value="12%"
                    colors={colors}
                  />
                </View>
              </View>
            </View>
            <View style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Plane size={20} color="#17130D" />
              </View>
              <Text style={styles.goalLabel}>ГЛАВНАЯ ЦЕЛЬ</Text>
              <Text style={styles.goalTitle}>Переезд в Чэнду</Text>
              <Text style={styles.goalMeta}>
                До старта программы осталось 52 дня
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: "68%" }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressStrong}>68% готово</Text>
                <Text style={styles.progressWeak}>4 из 6 этапов</Text>
              </View>
            </View>
            <View style={styles.commitmentCard}>
              <Text style={styles.goalLabel}>ОБЯЗАТЕЛЬСТВА</Text>
              <Text style={styles.commitmentValue}>
                {planned.filter((item) => item.status === "planned").length}
              </Text>
              <Text style={styles.commitmentTitle}>платежей впереди</Text>
              <View style={styles.commitmentRows}>
                <View>
                  <Text style={styles.commitmentMeta}>Ближайший</Text>
                  <Text style={styles.commitmentStrong}>15 июля</Text>
                </View>
                <View>
                  <Text style={styles.commitmentMeta}>Нагрузка</Text>
                  <Text style={styles.commitmentStrong}>
                    {formatRub(totals.plannedMax)}
                  </Text>
                </View>
              </View>
              <Pressable style={styles.forecastAction} onPress={onOpenPlanning}>
                <Text style={styles.forecastActionText}>Открыть план</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.sideColumn}>
          <View style={styles.cardVisual}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardBrand}>NOVA</Text>
                <Text style={styles.cardType}>PERSONAL</Text>
              </View>
              <WalletCards size={23} color="#17130D" />
            </View>
            <Text style={styles.cardBalanceLabel}>Доступный баланс</Text>
            <Text style={styles.cardBalance}>
              {formatRub(Math.max(remaining, 0))}
            </Text>
            <View style={styles.cardBottom}>
              <Text style={styles.cardNumber}>•••• 1208</Text>
              <Text style={styles.cardCurrency}>RUB</Text>
            </View>
          </View>
          <View style={styles.transferRow}>
            <Pressable style={styles.transferButton} onPress={onOpenFinance}>
              <ArrowDownLeft size={16} color={colors.text} />
              <Text style={styles.transferText}>Получить</Text>
            </Pressable>
            <Pressable
              style={[styles.transferButton, styles.transferPrimary]}
              onPress={onOpenFinance}
            >
              <ArrowUpRight size={16} color="#17130D" />
              <Text style={styles.transferPrimaryText}>Перевести</Text>
            </Pressable>
          </View>

          <View style={styles.upcomingCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Ближайшие платежи</Text>
                <Text style={styles.cardSub}>Следующие обязательства</Text>
              </View>
              <Pressable onPress={onOpenPlanning}>
                <Text style={styles.allLink}>Все</Text>
              </Pressable>
            </View>
            <ScrollView
              style={styles.paymentScroll}
              showsVerticalScrollIndicator={false}
            >
              {upcoming.map((item, index) => (
                <Payment
                  key={item.id}
                  item={item}
                  index={index}
                  colors={colors}
                />
              ))}
            </ScrollView>
            <Pressable style={styles.scheduleButton} onPress={onOpenPlanning}>
              <Text style={styles.scheduleText}>
                Открыть платежный календарь
              </Text>
              <ChevronRight size={15} color={colors.textSoft} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function Kpi({
  colors,
  label,
  value,
  delta,
  positive,
}: {
  colors: AppPalette;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <View style={createStyles(colors).kpi}>
      <View style={createStyles(colors).kpiTop}>
        <Text style={createStyles(colors).kpiLabel}>{label}</Text>
        <MoreHorizontal size={15} color={colors.textFaint} />
      </View>
      <Text style={createStyles(colors).kpiValue}>{value}</Text>
      <Text
        style={[
          createStyles(colors).kpiDelta,
          positive && { color: colors.green },
        ]}
      >
        {positive ? "↗ " : ""}
        {delta}
      </Text>
    </View>
  );
}

function BalanceChart({
  colors,
  period,
}: {
  colors: AppPalette;
  period: "1m" | "6m" | "1y";
}) {
  const values =
    period === "1m"
      ? chart.slice(-7)
      : period === "1y"
        ? [22, 31, 28, 45, 42, 57, 53, 70, 62, 78, 75, 91]
        : chart;
  const points = values
    .map((v, i) => `${i * (720 / (values.length - 1))},${128 - v}`)
    .join(" L ");
  return (
    <Svg
      width="100%"
      height="142"
      viewBox="0 0 720 142"
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id="cash" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.accent} stopOpacity="0.36" />
          <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={`M ${points} L 720 142 L 0 142 Z`} fill="url(#cash)" />
      <Path
        d={`M ${points}`}
        fill="none"
        stroke={colors.accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="528"
        cy="52"
        r="5"
        fill={colors.bg}
        stroke={colors.accent}
        strokeWidth="3"
      />
    </Svg>
  );
}

function Donut({ colors }: { colors: AppPalette }) {
  return (
    <View
      style={{
        width: 112,
        height: 112,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width="112" height="112" viewBox="0 0 112 112">
        <Circle
          cx="56"
          cy="56"
          r="42"
          fill="none"
          stroke={colors.surfaceSolid}
          strokeWidth="15"
        />
        <Circle
          cx="56"
          cy="56"
          r="42"
          fill="none"
          stroke={colors.accent}
          strokeWidth="15"
          strokeDasharray="110 264"
          strokeLinecap="round"
          rotation="-90"
          origin="56,56"
        />
        <Circle
          cx="56"
          cy="56"
          r="42"
          fill="none"
          stroke={colors.green}
          strokeWidth="15"
          strokeDasharray="73 264"
          strokeDashoffset="-116"
          strokeLinecap="round"
          rotation="-90"
          origin="56,56"
        />
        <Circle
          cx="56"
          cy="56"
          r="42"
          fill="none"
          stroke={colors.blue}
          strokeWidth="15"
          strokeDasharray="47 264"
          strokeDashoffset="-195"
          strokeLinecap="round"
          rotation="-90"
          origin="56,56"
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: "800" }}>
          100%
        </Text>
        <Text style={{ color: colors.textFaint, fontSize: 9 }}>план</Text>
      </View>
    </View>
  );
}

function Legend({
  color,
  label,
  value,
  colors,
}: {
  color: string;
  label: string;
  value: string;
  colors: AppPalette;
}) {
  return (
    <View style={createStyles(colors).legendRow}>
      <View
        style={[createStyles(colors).legendDot, { backgroundColor: color }]}
      />
      <Text style={createStyles(colors).legendLabel}>{label}</Text>
      <Text style={createStyles(colors).legendValue}>{value}</Text>
    </View>
  );
}

function Payment({
  item,
  index,
  colors,
}: {
  item: PlannedItem;
  index: number;
  colors: AppPalette;
}) {
  const icons = ["学", "签", "保", "住"];
  return (
    <View style={createStyles(colors).payment}>
      <View style={createStyles(colors).paymentIcon}>
        <Text style={createStyles(colors).paymentIconText}>
          {icons[index] || "₽"}
        </Text>
      </View>
      <View style={createStyles(colors).paymentCopy}>
        <Text style={createStyles(colors).paymentTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={createStyles(colors).paymentDate}>{item.due}</Text>
      </View>
      <Text style={createStyles(colors).paymentAmount}>
        −{formatRub(item.amountMax)}
      </Text>
    </View>
  );
}

const glass =
  Platform.OS === "web"
    ? ({
        backdropFilter: "blur(24px) saturate(145%)",
        WebkitBackdropFilter: "blur(24px) saturate(145%)",
      } as ViewStyle)
    : {};
const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    page: {
      flex: 1,
      minHeight: 0,
      padding: 22,
      gap: 14,
      backgroundColor: "transparent",
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    eyebrow: { color: colors.textFaint, fontSize: 9, fontWeight: "800" },
    title: {
      color: colors.text,
      fontSize: 25,
      lineHeight: 30,
      fontWeight: "700",
      marginTop: 5,
    },
    subtitle: { color: colors.textSoft, fontSize: 11, marginTop: 3 },
    titleActions: { flexDirection: "row", gap: 8 },
    secondaryButton: {
      height: 36,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 12,
    },
    secondaryText: { color: colors.textSoft, fontSize: 11, fontWeight: "700" },
    primaryButton: {
      height: 36,
      borderRadius: 8,
      backgroundColor: colors.accent,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 13,
    },
    primaryText: { color: "#17130D", fontSize: 11, fontWeight: "800" },
    kpiRow: { flexDirection: "row", gap: 10 },
    kpiRowCompact: { gap: 7 },
    kpi: {
      flex: 1,
      minWidth: 0,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...glass,
    },
    kpiTop: { flexDirection: "row", justifyContent: "space-between" },
    kpiLabel: { color: colors.textSoft, fontSize: 10, fontWeight: "600" },
    kpiValue: {
      color: colors.text,
      fontSize: 19,
      fontWeight: "800",
      marginTop: 8,
    },
    kpiDelta: { color: colors.textFaint, fontSize: 9, marginTop: 4 },
    dashboard: { flex: 1, minHeight: 0, flexDirection: "row", gap: 12 },
    dashboardCompact: { gap: 8 },
    mainColumn: { flex: 1, minWidth: 0, gap: 12 },
    chartRow: { flex: 1.18, minHeight: 226, flexDirection: "row", gap: 12 },
    sideColumn: { width: 316, gap: 10 },
    balanceCard: {
      flex: 1,
      minHeight: 226,
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...glass,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    cardTitle: { color: colors.text, fontSize: 13, fontWeight: "700" },
    cardSub: { color: colors.textFaint, fontSize: 9, marginTop: 3 },
    periods: { flexDirection: "row", alignItems: "center", gap: 4 },
    period: {
      color: colors.textFaint,
      fontSize: 9,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    periodActive: {
      color: colors.text,
      fontSize: 9,
      fontWeight: "700",
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 6,
      backgroundColor: colors.surfaceSolid,
    },
    chartValueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 11,
    },
    chartValue: { color: colors.text, fontSize: 22, fontWeight: "800" },
    growth: { color: colors.green, fontSize: 10, fontWeight: "700" },
    chartFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: -3,
    },
    axis: { color: colors.textFaint, fontSize: 8 },
    bottomGrid: { flex: 0.82, minHeight: 180, flexDirection: "row", gap: 12 },
    spendingCard: {
      flex: 1.25,
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...glass,
    },
    donutContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      gap: 12,
    },
    legend: { minWidth: 120, gap: 8 },
    legendRow: { flexDirection: "row", alignItems: "center", gap: 7 },
    legendDot: { width: 7, height: 7, borderRadius: 2 },
    legendLabel: { flex: 1, color: colors.textSoft, fontSize: 10 },
    legendValue: { color: colors.text, fontSize: 10, fontWeight: "800" },
    goalCard: {
      flex: 0.75,
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...glass,
    },
    forecastCard: {
      width: 210,
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...glass,
    },
    forecastLabel: { color: colors.textFaint, fontSize: 8, fontWeight: "900" },
    forecastValue: {
      color: colors.accent,
      fontSize: 38,
      fontWeight: "900",
      marginTop: 10,
    },
    forecastOf: { color: colors.textFaint, fontSize: 8 },
    healthTrack: {
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.surfaceSolid,
      marginTop: 12,
      overflow: "hidden",
    },
    healthFill: { width: "74%", height: "100%", backgroundColor: colors.green },
    forecastTitle: {
      color: colors.text,
      fontSize: 11,
      fontWeight: "800",
      marginTop: 12,
    },
    forecastText: {
      color: colors.textFaint,
      fontSize: 8,
      lineHeight: 12,
      marginTop: 4,
    },
    forecastAction: {
      marginTop: "auto",
      height: 29,
      borderRadius: 6,
      backgroundColor: colors.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    forecastActionText: {
      color: colors.accent,
      fontSize: 8,
      fontWeight: "800",
    },
    commitmentCard: {
      flex: 0.68,
      minWidth: 150,
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...glass,
    },
    commitmentValue: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "900",
      marginTop: 9,
    },
    commitmentTitle: { color: colors.textSoft, fontSize: 9, marginTop: 1 },
    commitmentRows: { gap: 8, marginTop: 12 },
    commitmentMeta: { color: colors.textFaint, fontSize: 7 },
    commitmentStrong: {
      color: colors.text,
      fontSize: 9,
      fontWeight: "800",
      marginTop: 2,
    },
    goalIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
    },
    goalLabel: {
      color: colors.textFaint,
      fontSize: 8,
      fontWeight: "800",
      marginTop: 12,
    },
    goalTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
      marginTop: 4,
    },
    goalMeta: { color: colors.textSoft, fontSize: 9, marginTop: 4 },
    progressTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.surfaceSolid,
      marginTop: "auto",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    progressLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 7,
    },
    progressStrong: { color: colors.text, fontSize: 9, fontWeight: "700" },
    progressWeak: { color: colors.textFaint, fontSize: 9 },
    cardVisual: {
      minHeight: 154,
      borderRadius: 8,
      padding: 16,
      backgroundColor: colors.accent,
    },
    cardTop: { flexDirection: "row", justifyContent: "space-between" },
    cardBrand: { color: "#17130D", fontSize: 14, fontWeight: "900" },
    cardType: {
      color: "rgba(23,19,13,.55)",
      fontSize: 7,
      fontWeight: "800",
      marginTop: 1,
    },
    cardBalanceLabel: {
      color: "rgba(23,19,13,.58)",
      fontSize: 9,
      marginTop: 18,
    },
    cardBalance: {
      color: "#17130D",
      fontSize: 24,
      fontWeight: "800",
      marginTop: 2,
    },
    cardBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: "auto",
    },
    cardNumber: { color: "#17130D", fontSize: 10, fontWeight: "700" },
    cardCurrency: { color: "#17130D", fontSize: 10, fontWeight: "800" },
    transferRow: { flexDirection: "row", gap: 8 },
    transferButton: {
      flex: 1,
      height: 36,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    transferPrimary: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    transferText: { color: colors.text, fontSize: 10, fontWeight: "700" },
    transferPrimaryText: { color: "#17130D", fontSize: 10, fontWeight: "800" },
    upcomingCard: {
      flex: 1,
      minHeight: 0,
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...glass,
    },
    allLink: { color: colors.accent, fontSize: 10, fontWeight: "700" },
    paymentScroll: { flex: 1, marginTop: 9 },
    payment: {
      height: 47,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    paymentIcon: {
      width: 29,
      height: 29,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceSolid,
    },
    paymentIconText: {
      color: colors.textSoft,
      fontSize: 11,
      fontWeight: "800",
    },
    paymentCopy: { flex: 1, minWidth: 0 },
    paymentTitle: { color: colors.text, fontSize: 10, fontWeight: "700" },
    paymentDate: { color: colors.textFaint, fontSize: 8, marginTop: 2 },
    paymentAmount: { color: colors.red, fontSize: 10, fontWeight: "700" },
    scheduleButton: {
      height: 32,
      marginTop: 8,
      borderRadius: 7,
      backgroundColor: colors.surfaceSolid,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
    },
    scheduleText: { color: colors.textSoft, fontSize: 9, fontWeight: "700" },
  });
