import { Moon, Sun } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
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
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <NovaLogo colors={colors} size={42} />
        <View>
          <Kicker colors={colors}>{brand.tagline}</Kicker>
          <Title colors={colors} style={styles.title}>{brand.productName}</Title>
        </View>
      </View>
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
      paddingBottom: 12,
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
      fontSize: 26,
      lineHeight: 31,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
