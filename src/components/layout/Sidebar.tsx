import { Pressable, StyleSheet, Text, View } from 'react-native';
import { brand } from '../../brand/identity';
import { navigationItems } from '../../config/navigation';
import type { AppPalette } from '../../theme/tokens';
import type { Profile, TabName } from '../../types/domain';
import { NovaLogo } from '../brand/NovaLogo';
import { Kicker, Muted, Title } from '../ui/Typography';

type SidebarProps = {
  colors: AppPalette;
  activeTab: TabName;
  profile: Profile;
  onChangeTab: (tab: TabName) => void;
};

export function Sidebar({ colors, activeTab, profile, onChangeTab }: SidebarProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.sidebar}>
      <View style={styles.brand}>
        <NovaLogo colors={colors} size={44} />
        <View>
          <Kicker colors={colors}>workspace</Kicker>
          <Title colors={colors} style={styles.brandTitle}>{brand.shortName}</Title>
        </View>
      </View>

      <View style={styles.nav}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <Pressable
              key={item.key}
              style={[styles.navItem, active && styles.activeItem]}
              onPress={() => onChangeTab(item.key)}
            >
              <Icon color={active ? '#FFFFFF' : colors.textSoft} size={18} />
              <View style={styles.navCopy}>
                <Text style={[styles.navLabel, active && styles.activeLabel]}>{item.label}</Text>
                <Text style={[styles.navHint, active && styles.activeHint]}>{item.hint}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.profileCard}>
        <Muted colors={colors}>Профиль</Muted>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileMeta}>{profile.destination}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    sidebar: {
      width: 286,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      padding: 18,
      gap: 22,
      backgroundColor: colors.mode === 'dark' ? 'rgba(5, 7, 20, 0.68)' : 'rgba(255, 255, 255, 0.58)',
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    brandTitle: {
      fontSize: 22,
      lineHeight: 26,
    },
    nav: {
      gap: 6,
    },
    navItem: {
      minHeight: 58,
      borderRadius: 8,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    activeItem: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    navCopy: {
      flex: 1,
    },
    navLabel: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 14,
    },
    activeLabel: {
      color: '#FFFFFF',
    },
    navHint: {
      color: colors.textFaint,
      fontSize: 11,
      marginTop: 2,
    },
    activeHint: {
      color: 'rgba(255, 255, 255, 0.72)',
    },
    profileCard: {
      marginTop: 'auto',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 12,
    },
    profileName: {
      color: colors.text,
      fontWeight: '900',
      marginTop: 5,
    },
    profileMeta: {
      color: colors.textFaint,
      fontSize: 12,
      marginTop: 2,
    },
  });
