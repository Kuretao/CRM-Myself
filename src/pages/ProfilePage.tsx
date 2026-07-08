import { CalendarDays, MapPin, Plane, UserRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Surface } from '../components/ui/Surface';
import { Body, Kicker, Muted, Title } from '../components/ui/Typography';
import type { AppPalette } from '../theme/tokens';
import type { Profile } from '../types/domain';

type ProfilePageProps = {
  colors: AppPalette;
  profile: Profile;
};

export function ProfilePage({ colors, profile }: ProfilePageProps) {
  const styles = createStyles(colors);
  const rows = [
    { icon: <UserRound color={colors.accent} size={19} />, label: 'Имя', value: profile.name },
    { icon: <MapPin color={colors.blue} size={19} />, label: 'Направление', value: profile.destination },
    { icon: <Plane color={colors.green} size={19} />, label: 'Программа', value: profile.program },
    { icon: <CalendarDays color={colors.amber} size={19} />, label: 'Старт', value: profile.startDate },
  ];

  return (
    <>
      <Surface colors={colors} style={styles.hero}>
        <View style={styles.avatar}>
          <Title colors={colors}>Б</Title>
        </View>
        <View style={styles.copy}>
          <Kicker colors={colors}>profile</Kicker>
          <Title colors={colors}>{profile.name}</Title>
          <Muted colors={colors}>{profile.destination} · {profile.program}</Muted>
        </View>
      </Surface>

      <SectionHeader colors={colors} title="Данные поездки" subtitle="travel profile" />
      <Surface colors={colors}>
        {rows.map((row, index) => (
          <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.divider]}>
            <View style={styles.rowIcon}>{row.icon}</View>
            <View style={styles.rowCopy}>
              <Muted colors={colors}>{row.label}</Muted>
              <Body colors={colors} style={styles.rowValue}>{row.value}</Body>
            </View>
          </View>
        ))}
      </Surface>
    </>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    hero: {
      marginTop: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    avatar: {
      width: 66,
      height: 66,
      borderRadius: 8,
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: {
      flex: 1,
    },
    row: {
      minHeight: 62,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceSoft,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowCopy: {
      flex: 1,
    },
    rowValue: {
      fontWeight: '800',
      marginTop: 2,
    },
  });
