import { PanelLeftClose, PanelLeftOpen } from 'lucide-react-native';
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
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onChangeTab: (tab: TabName) => void;
};

export function Sidebar({ colors, activeTab, profile, collapsed = false, onToggleCollapsed, onChangeTab }: SidebarProps) {
  const styles = createStyles(colors, collapsed);

  return (
    <View style={styles.sidebar}>
      <View style={styles.brand}>
        <NovaLogo colors={colors} size={44} />
        {!collapsed && (
          <View>
            <Kicker colors={colors}>workspace</Kicker>
            <Title colors={colors} style={styles.brandTitle}>{brand.shortName}</Title>
          </View>
        )}
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
              <Icon color={active ? '#FFFFFF' : colors.textSoft} size={19} />
              {!collapsed && (
                <View style={styles.navCopy}>
                  <Text style={[styles.navLabel, active && styles.activeLabel]}>{item.label}</Text>
                  <Text style={[styles.navHint, active && styles.activeHint]}>{item.hint}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {!collapsed && (
        <View style={styles.profileCard}>
          <Muted colors={colors}>Профиль</Muted>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileMeta}>{profile.destination}</Text>
        </View>
      )}
      <Pressable style={styles.collapseButton} onPress={onToggleCollapsed}>
        {collapsed ? <PanelLeftOpen color={colors.textSoft} size={18} /> : <PanelLeftClose color={colors.textSoft} size={18} />}
        {!collapsed && <Text style={styles.collapseText}>Свернуть</Text>}
      </Pressable>
    </View>
  );
}

const createStyles = (colors: AppPalette, collapsed: boolean) =>
  StyleSheet.create({
    sidebar: {
      width: collapsed ? 74 : 216,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      paddingHorizontal: collapsed ? 12 : 18,
      paddingVertical: 18,
      gap: 24,
      backgroundColor: colors.mode === 'dark' ? 'rgba(8, 13, 34, 0.56)' : 'rgba(255, 255, 255, 0.62)',
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      gap: 12,
    },
    brandTitle: {
      fontSize: 22,
      lineHeight: 26,
    },
    nav: {
      gap: 8,
    },
    navItem: {
      minHeight: collapsed ? 48 : 46,
      borderRadius: 8,
      paddingHorizontal: collapsed ? 0 : 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      gap: 10,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    activeItem: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.borderStrong,
      shadowColor: colors.glow,
      shadowOpacity: 1,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
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
      color: colors.textSoft,
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
    collapseButton: {
      minHeight: 42,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: collapsed ? 'center' : 'flex-start',
      paddingHorizontal: collapsed ? 0 : 12,
      gap: 9,
    },
    collapseText: {
      color: colors.textSoft,
      fontSize: 12,
      fontWeight: '900',
    },
  });
