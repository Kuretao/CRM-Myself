import { Bell, Moon, Search, Sun } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { brand } from '../../brand/identity';
import { NovaLogo } from '../brand/NovaLogo';
import { Kicker, Title } from '../ui/Typography';
import type { AppPalette } from '../../theme/tokens';
import type { ThemeName } from '../../types/domain';

type AppHeaderProps = {
  colors: AppPalette;
  themeName: ThemeName;
  onToggleTheme: () => void;
};

export function AppHeader({ colors, themeName, onToggleTheme }: AppHeaderProps) {
  const styles = createStyles(colors);
  const { width } = useWindowDimensions();
  const showSearch = width >= 760;
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <NovaLogo colors={colors} size={42} />
        <View>
          <Kicker colors={colors}>{brand.tagline}</Kicker>
          <Title colors={colors} style={styles.title}>{brand.productName}</Title>
        </View>
      </View>
      {showSearch && (
        <View style={styles.searchPill}>
          <Search color={colors.textFaint} size={16} />
          <Text style={styles.searchText}>Search space, folder, task</Text>
        </View>
      )}
      <Pressable style={styles.iconButton}>
        <Bell color={colors.textSoft} size={19} />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={onToggleTheme}>
        {themeName === 'dark' ? <Sun color={colors.amber} size={20} /> : <Moon color={colors.accent} size={20} />}
      </Pressable>
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    header: {
      paddingTop: 12,
      paddingBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    title: {
      fontSize: 20,
      lineHeight: 24,
    },
    searchPill: {
      flex: 0.62,
      minHeight: 38,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.mode === 'dark' ? 'rgba(8, 13, 34, 0.62)' : 'rgba(255, 255, 255, 0.64)',
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    searchText: {
      color: colors.textFaint,
      fontSize: 12,
      fontWeight: '700',
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
