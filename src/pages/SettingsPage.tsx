import { Moon, RotateCcw, ShieldCheck, Smartphone, Sun } from 'lucide-react-native';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Surface } from '../components/ui/Surface';
import { Body, Muted } from '../components/ui/Typography';
import type { AppPalette } from '../theme/tokens';
import type { ThemeName } from '../types/domain';

type SettingsPageProps = {
  colors: AppPalette;
  themeName: ThemeName;
  onToggleTheme: () => void;
  onResetData: () => void;
};

export function SettingsPage({ colors, themeName, onToggleTheme, onResetData }: SettingsPageProps) {
  const styles = createStyles(colors);
  const isDark = themeName === 'dark';

  return (
    <>
      <SectionHeader colors={colors} title="Настройки" subtitle="app control" />
      <Surface colors={colors}>
        <View style={[styles.row, styles.divider]}>
          <View style={styles.icon}>{isDark ? <Moon color={colors.accent} size={19} /> : <Sun color={colors.amber} size={19} />}</View>
          <View style={styles.copy}>
            <Body colors={colors} style={styles.title}>Темная тема</Body>
            <Muted colors={colors}>Linear-like dark mode включен по умолчанию</Muted>
          </View>
          <Switch value={isDark} onValueChange={onToggleTheme} trackColor={{ false: colors.borderStrong, true: colors.accent }} />
        </View>
        <View style={[styles.row, styles.divider]}>
          <View style={styles.icon}><ShieldCheck color={colors.green} size={19} /></View>
          <View style={styles.copy}>
            <Body colors={colors} style={styles.title}>PIN-код</Body>
            <Muted colors={colors}>Код входа: 120800</Muted>
          </View>
          <Text style={styles.badge}>active</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.icon}><Smartphone color={colors.blue} size={19} /></View>
          <View style={styles.copy}>
            <Body colors={colors} style={styles.title}>Платформы</Body>
            <Muted colors={colors}>iPhone через Expo Go, web сейчас, .exe через Electron/Tauri позже</Muted>
          </View>
        </View>
      </Surface>

      <SectionHeader colors={colors} title="Данные" subtitle="local storage" />
      <Surface colors={colors} style={styles.danger}>
        <Muted colors={colors}>Все данные сейчас хранятся локально на устройстве. Сброс вернет стартовый бюджет и задачи.</Muted>
        <Button colors={colors} label="Сбросить демо-данные" icon={<RotateCcw color="#FFFFFF" size={17} />} onPress={onResetData} />
      </Surface>
    </>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    row: {
      minHeight: 66,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    icon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: colors.surfaceSoft,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: {
      flex: 1,
    },
    title: {
      fontWeight: '800',
    },
    badge: {
      color: colors.green,
      fontSize: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
    },
    danger: {
      padding: 13,
      gap: 12,
    },
  });
