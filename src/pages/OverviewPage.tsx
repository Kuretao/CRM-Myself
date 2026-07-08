import { ArrowDownRight, ArrowUpRight, CreditCard } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { brand } from '../brand/identity';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Surface } from '../components/ui/Surface';
import { Kicker, Muted, Title } from '../components/ui/Typography';
import { MetricCard } from '../features/finance/components/MetricCard';
import { PaymentList } from '../features/finance/components/PaymentList';
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
};

export function OverviewPage({ colors, profile, totals, planned }: OverviewPageProps) {
  const styles = createStyles(colors);

  return (
    <>
      <Surface colors={colors} style={styles.hero}>
        <View style={styles.heroCopy}>
          <Kicker colors={colors}>{brand.shortName} control center</Kicker>
          <Title colors={colors} style={styles.heroTitle}>{formatRange(totals.leftMin, totals.leftMax)}</Title>
          <Muted colors={colors}>
            Остаток после зарплат, доп, перелета, учебы, документов, общаги на 2 месяца и резерва жизни.
          </Muted>
        </View>
        <View style={styles.orbit}>
          <Text style={styles.orbitValue}>{totals.taskProgress}%</Text>
          <Text style={styles.orbitLabel}>tasks</Text>
        </View>
      </Surface>

      <View style={styles.metrics}>
        <MetricCard colors={colors} icon={<ArrowUpRight color={colors.green} size={20} />} label="банк" value={formatRub(totals.income)} />
        <MetricCard colors={colors} icon={<ArrowDownRight color={colors.red} size={20} />} label="план расходов" value={formatRub(totals.fixedExpenses + totals.plannedMax)} />
        <MetricCard colors={colors} icon={<CreditCard color={colors.amber} size={20} />} label="Доп" value="60 000 ₽" />
      </View>

      <Surface colors={colors} style={styles.profileStrip}>
        <View>
          <Kicker colors={colors}>профиль</Kicker>
          <Title colors={colors} style={styles.stripTitle}>{profile.name}</Title>
          <Muted colors={colors}>{profile.destination} · {profile.program}</Muted>
        </View>
        <View style={styles.datePill}>
          <Text style={styles.dateText}>{profile.startDate}</Text>
        </View>
      </Surface>

      <SectionHeader colors={colors} title="Ближайшие платежи" subtitle="required + reserve" />
      <PaymentList colors={colors} items={planned} />
    </>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    hero: {
      marginTop: 12,
      padding: 18,
      minHeight: 178,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    heroCopy: {
      flex: 1,
    },
    heroTitle: {
      marginTop: 8,
      marginBottom: 8,
      color: colors.text,
      fontSize: 34,
      lineHeight: 40,
    },
    orbit: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 10,
      borderColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
    },
    orbitValue: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '900',
    },
    orbitLabel: {
      color: colors.textFaint,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    metrics: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
    },
    profileStrip: {
      marginTop: 12,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    stripTitle: {
      fontSize: 19,
      lineHeight: 25,
    },
    datePill: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    dateText: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 12,
    },
  });
