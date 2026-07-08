import { ArrowDownRight, ArrowUpRight, Bot, CalendarDays, CreditCard, Plus, Send } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { brand } from '../brand/identity';
import { Surface } from '../components/ui/Surface';
import { Kicker, Muted, Title } from '../components/ui/Typography';
import { MetricCard } from '../features/finance/components/MetricCard';
import type { AppPalette } from '../theme/tokens';
import type { PlannedPayment, Profile } from '../types/domain';
import { formatRange, formatRub } from '../utils/format';

type OverviewPageProps = {
  colors: AppPalette;
  profile: Profile;
  totals: {
    income: number;
    fixedExpenses: number;
    plannedMax: number;
    leftMin: number;
    leftMax: number;
    taskProgress: number;
  };
  planned: PlannedPayment[];
  aiDraft: string;
  onChangeAiDraft: (value: string) => void;
  onSendAiDraft: () => void;
};

export function OverviewPage({
  colors,
  profile,
  totals,
  planned,
  aiDraft,
  onChangeAiDraft,
  onSendAiDraft,
}: OverviewPageProps) {
  const styles = createStyles(colors);
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 980;
  const isCompact = width < 760;
  const plannedExpenses = planned
    .filter((item) => item.type === 'expense' && item.status === 'planned')
    .reduce((sum, item) => sum + item.amountMax, 0);
  const plannedIncome = planned
    .filter((item) => item.type === 'income' && item.status === 'planned')
    .reduce((sum, item) => sum + item.amountMax, 0);
  const dashboardHeight = isDesktop ? Math.max(680, height - 86) : undefined;

  return (
    <View style={[styles.page, isDesktop && { height: dashboardHeight }]}>
      <View style={[styles.dashboardGrid, isCompact && styles.dashboardGridCompact]}>
        <View style={styles.mainColumn}>
          <View style={[styles.topGrid, isCompact && styles.topGridCompact]}>
            <Surface colors={colors} style={styles.hero}>
              <View>
                <Kicker colors={colors}>Good morning · {profile.name.split(' ')[0]}</Kicker>
                <Title colors={colors} style={styles.greeting}>Make Things <Text style={styles.accentWord}>Simple</Text></Title>
                <Muted colors={colors} style={styles.heroText}>
                  {brand.shortName} держит вместе деньги, планы и задачи без хаоса в таблицах.
                </Muted>
              </View>
              <View>
                <Muted colors={colors} style={styles.balanceLabel}>Прогнозный остаток</Muted>
                <Title colors={colors} style={styles.heroTitle}>{formatRange(totals.leftMin, totals.leftMax)}</Title>
                <View style={styles.actions}>
                  <Pressable style={styles.actionButton}>
                    <Send color="#FFFFFF" size={16} />
                    <Text style={styles.actionText}>Расход</Text>
                  </Pressable>
                  <Pressable style={styles.actionButtonSoft}>
                    <Plus color={colors.text} size={16} />
                    <Text style={styles.actionTextSoft}>Поступление</Text>
                  </Pressable>
                  <Pressable style={styles.actionButtonSoft}>
                    <CalendarDays color={colors.text} size={16} />
                    <Text style={styles.actionTextSoft}>План</Text>
                  </Pressable>
                </View>
              </View>
            </Surface>

            <Surface colors={colors} style={[styles.progressCard, isCompact && styles.progressCardCompact]}>
              <View style={styles.datePill}>
                <CalendarDays color={colors.accent} size={16} />
                <Text style={styles.dateText}>{profile.startDate}</Text>
              </View>
              <View style={styles.orbit}>
                <Text style={styles.orbitValue}>{totals.taskProgress}%</Text>
                <Text style={styles.orbitLabel}>tasks</Text>
              </View>
              <Muted colors={colors}>Прогресс задач до переезда</Muted>
            </Surface>
          </View>

          <View style={[styles.metrics, isCompact && styles.metricsCompact]}>
            <MetricCard colors={colors} icon={<ArrowUpRight color={colors.green} size={20} />} label="банк" value={formatRub(totals.income)} />
            <MetricCard colors={colors} icon={<ArrowDownRight color={colors.red} size={20} />} label="план расходов" value={formatRub(totals.fixedExpenses + totals.plannedMax)} />
            <MetricCard colors={colors} icon={<CreditCard color={colors.amber} size={20} />} label="доп" value="60 000 ₽" />
          </View>

          <View style={[styles.analyticsGrid, isCompact && styles.analyticsGridCompact]}>
            <Surface colors={colors} style={styles.chartCard}>
              <View style={styles.cardHead}>
                <View>
                  <Text style={styles.cardTitle}>Cash structure</Text>
                  <Text style={styles.cardHint}>банк · расходы · платежи</Text>
                </View>
                <Text style={styles.cardBadge}>live</Text>
              </View>
              <CashBars
                colors={colors}
                items={[
                  { label: 'Bank', value: totals.income, color: colors.green },
                  { label: 'Spent', value: totals.fixedExpenses, color: colors.red },
                  { label: 'Plan', value: plannedExpenses, color: colors.accent },
                  { label: 'In', value: plannedIncome, color: colors.blue },
                ]}
              />
            </Surface>

            <Surface colors={colors} style={styles.chartCard}>
              <View style={styles.cardHead}>
                <View>
                  <Text style={styles.cardTitle}>Allocation</Text>
                  <Text style={styles.cardHint}>планируемая нагрузка</Text>
                </View>
                <Text style={styles.cardBadge}>{planned.length}</Text>
              </View>
              <PlanDonut colors={colors} paid={totals.fixedExpenses} planned={plannedExpenses} reserve={Math.max(totals.plannedMax - plannedExpenses, 0)} />
            </Surface>
          </View>
        </View>

        <View style={[styles.sideColumn, isCompact && styles.sideColumnCompact]}>
          <Surface colors={colors} style={styles.aiCard}>
            <View style={styles.cardHead}>
              <View style={styles.aiTitleRow}>
                <View style={styles.aiIcon}>
                  <Bot color={colors.accent} size={18} />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Quick AI</Text>
                  <Text style={styles.cardHint}>спроси про деньги или задачи</Text>
                </View>
              </View>
            </View>
            <View style={styles.aiBubble}>
              <Text style={styles.aiBubbleText}>Могу быстро проверить риски бюджета, платежи недели или собрать план дня.</Text>
            </View>
            <View style={styles.aiInputRow}>
              <TextInput
                style={[styles.aiInput, !aiDraft && styles.aiPlaceholder]}
                value={aiDraft}
                onChangeText={onChangeAiDraft}
                placeholder="Напиши запрос..."
                placeholderTextColor={colors.textFaint}
                numberOfLines={1}
                onSubmitEditing={onSendAiDraft}
              />
              <Pressable style={styles.aiSend} onPress={onSendAiDraft}>
                <Send color="#FFFFFF" size={15} />
              </Pressable>
            </View>
          </Surface>

          <Surface colors={colors} style={styles.paymentsCard}>
            <View style={styles.cardHead}>
              <View>
                <Text style={styles.cardTitle}>Ближайшие платежи</Text>
                <Text style={styles.cardHint}>required + reserve</Text>
              </View>
              <Text style={styles.cardBadge}>{planned.filter((item) => item.status === 'planned').length}</Text>
            </View>
            <ScrollView style={styles.paymentsScroll} contentContainerStyle={styles.paymentsContent} showsVerticalScrollIndicator={false}>
              {planned.map((item) => (
                <View key={item.id} style={styles.paymentRow}>
                  <View style={[styles.paymentDot, item.type === 'income' && styles.paymentDotIncome]} />
                  <View style={styles.paymentCopy}>
                    <Text style={styles.paymentTitle}>{item.title}</Text>
                    <Text style={styles.paymentMeta}>{item.due} · {item.category}</Text>
                  </View>
                  <Text style={[styles.paymentAmount, item.type === 'income' && styles.paymentIncome]}>
                    {item.type === 'income' ? '+' : '-'}{formatRange(item.amountMin, item.amountMax)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </Surface>
        </View>
      </View>
    </View>
  );
}

function CashBars({
  colors,
  items,
}: {
  colors: AppPalette;
  items: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <View style={{ gap: 10 }}>
      <Svg width="100%" height={132} viewBox="0 0 360 132">
        {items.map((item, index) => {
          const barHeight = Math.max(8, (item.value / max) * 96);
          const x = 28 + index * 82;
          const y = 112 - barHeight;
          return (
            <Rect key={item.label} x={x} y={y} width="42" height={barHeight} rx="16" fill={item.color} opacity={index === 0 ? 0.95 : 0.72} />
          );
        })}
      </Svg>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        {items.map((item) => (
          <View key={item.label} style={{ flex: 1 }}>
            <Text style={{ color: colors.textFaint, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }}>{item.label}</Text>
            <Text style={{ color: colors.text, fontSize: 12, fontWeight: '900', marginTop: 2 }}>{formatRub(item.value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PlanDonut({ colors, paid, planned, reserve }: { colors: AppPalette; paid: number; planned: number; reserve: number }) {
  const data = [
    { label: 'Факт', value: paid, color: colors.red },
    { label: 'План', value: planned, color: colors.accent },
    { label: 'Резерв', value: reserve, color: colors.blue },
  ];
  const total = Math.max(data.reduce((sum, item) => sum + item.value, 0), 1);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Svg width={116} height={116} viewBox="0 0 116 116">
        <Circle cx="58" cy="58" r={radius} stroke={colors.surfaceSoft} strokeWidth="15" fill="none" />
        {data.map((item) => {
          const dash = `${circumference * (item.value / total)} ${circumference}`;
          const currentOffset = offset;
          offset += circumference * (item.value / total);
          return (
            <Circle
              key={item.label}
              cx="58"
              cy="58"
              r={radius}
              stroke={item.color}
              strokeWidth="15"
              fill="none"
              strokeDasharray={dash}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              rotation="-90"
              origin="58,58"
            />
          );
        })}
      </Svg>
      <View style={{ flex: 1, gap: 8 }}>
        {data.map((item) => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
            <Text style={{ flex: 1, color: colors.textSoft, fontSize: 12, fontWeight: '800' }}>{item.label}</Text>
            <Text style={{ color: colors.text, fontSize: 12, fontWeight: '900' }}>{Math.round((item.value / total) * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    page: {
      minHeight: 0,
    },
    dashboardGrid: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      minHeight: 0,
    },
    dashboardGridCompact: {
      flexDirection: 'column',
    },
    mainColumn: {
      flex: 1,
      gap: 12,
      minWidth: 0,
      minHeight: 0,
    },
    sideColumn: {
      width: 348,
      gap: 12,
      minHeight: 0,
    },
    sideColumnCompact: {
      width: '100%',
    },
    topGrid: {
      marginTop: 8,
      flexDirection: 'row',
      gap: 12,
    },
    topGridCompact: {
      flexDirection: 'column',
    },
    hero: {
      flex: 1,
      padding: 16,
      minHeight: 204,
      justifyContent: 'space-between',
      backgroundColor: colors.mode === 'dark' ? 'rgba(54, 72, 132, 0.24)' : colors.surface,
      borderColor: colors.borderStrong,
    },
    greeting: {
      marginTop: 4,
      fontSize: 29,
      lineHeight: 34,
    },
    accentWord: {
      color: colors.accent,
    },
    heroText: {
      maxWidth: 520,
      marginTop: 4,
    },
    balanceLabel: {
      marginTop: 14,
      textTransform: 'uppercase',
      fontSize: 10,
      fontWeight: '900',
    },
    heroTitle: {
      marginTop: 3,
      color: colors.text,
      fontSize: 31,
      lineHeight: 36,
      fontWeight: '900',
    },
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 11,
    },
    actionButton: {
      minHeight: 38,
      borderRadius: 8,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor: colors.accent,
      shadowColor: colors.glow,
      shadowOpacity: 1,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    actionButtonSoft: {
      minHeight: 38,
      borderRadius: 8,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor: colors.surfaceSoft,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionText: {
      color: '#FFFFFF',
      fontWeight: '900',
      fontSize: 12,
    },
    actionTextSoft: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 12,
    },
    progressCard: {
      width: 210,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
      minHeight: 204,
      backgroundColor: colors.mode === 'dark' ? 'rgba(65, 84, 148, 0.26)' : colors.surface,
    },
    progressCardCompact: {
      width: '100%',
      gap: 12,
    },
    datePill: {
      alignSelf: 'stretch',
      minHeight: 36,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      backgroundColor: colors.surfaceSoft,
    },
    dateText: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 12,
    },
    orbit: {
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 10,
      borderColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
      shadowColor: colors.glow,
      shadowOpacity: 1,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    },
    orbitValue: {
      color: colors.text,
      fontSize: 21,
      fontWeight: '900',
    },
    orbitLabel: {
      color: colors.textFaint,
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
    },
    metrics: {
      flexDirection: 'row',
      gap: 10,
    },
    metricsCompact: {
      flexDirection: 'column',
    },
    analyticsGrid: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      minHeight: 0,
    },
    analyticsGridCompact: {
      flexDirection: 'column',
    },
    chartCard: {
      flex: 1,
      padding: 14,
      gap: 12,
      minHeight: 216,
    },
    cardHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '900',
    },
    cardHint: {
      color: colors.textFaint,
      fontSize: 11,
      fontWeight: '800',
      marginTop: 2,
    },
    cardBadge: {
      color: colors.text,
      overflow: 'hidden',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      paddingHorizontal: 9,
      paddingVertical: 5,
      fontSize: 11,
      fontWeight: '900',
    },
    aiCard: {
      minHeight: 208,
      padding: 14,
      gap: 12,
      backgroundColor: colors.mode === 'dark' ? 'rgba(70, 83, 150, 0.28)' : colors.surface,
    },
    aiTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    aiIcon: {
      width: 34,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aiBubble: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      padding: 11,
    },
    aiBubbleText: {
      color: colors.textSoft,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '700',
    },
    aiInputRow: {
      minHeight: 40,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.mode === 'dark' ? 'rgba(6, 10, 28, 0.36)' : colors.surfaceSoft,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingLeft: 12,
      paddingRight: 5,
    },
    aiInput: {
      flex: 1,
      color: colors.text,
      fontSize: 12,
      fontWeight: '800',
    },
    aiPlaceholder: {
      color: colors.textFaint,
    },
    aiSend: {
      width: 31,
      height: 31,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
    },
    paymentsCard: {
      flex: 1,
      minHeight: 0,
      padding: 14,
      gap: 10,
    },
    paymentsScroll: {
      flex: 1,
      minHeight: 0,
    },
    paymentsContent: {
      gap: 8,
      paddingBottom: 2,
    },
    paymentRow: {
      minHeight: 56,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    paymentDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },
    paymentDotIncome: {
      backgroundColor: colors.green,
    },
    paymentCopy: {
      flex: 1,
      minWidth: 0,
    },
    paymentTitle: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '900',
    },
    paymentMeta: {
      color: colors.textFaint,
      fontSize: 11,
      fontWeight: '800',
      marginTop: 2,
    },
    paymentAmount: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '900',
      textAlign: 'right',
      maxWidth: 112,
    },
    paymentIncome: {
      color: colors.green,
    },
  });
