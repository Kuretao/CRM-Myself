import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { navigationItems } from '../../config/navigation';
import type { AppPalette } from '../../theme/tokens';
import type { TabName } from '../../types/domain';

type TabBarProps = {
  colors: AppPalette;
  activeTab: TabName;
  onChangeTab: (tab: TabName) => void;
};

export function TabBar({ colors, activeTab, onChangeTab }: TabBarProps) {
  const styles = createStyles(colors);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {navigationItems.map((tab) => {
        const active = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => onChangeTab(tab.key)}
          >
            <Icon color={active ? '#FFFFFF' : colors.textSoft} size={17} />
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    wrap: {
      gap: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.mode === 'dark' ? 'rgba(14, 20, 44, 0.94)' : 'rgba(255, 255, 255, 0.92)',
    },
    tab: {
      minHeight: 42,
      minWidth: 42,
      paddingHorizontal: 11,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    activeTab: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      shadowColor: colors.glow,
      shadowOpacity: 1,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    label: {
      color: colors.textSoft,
      fontSize: 13,
      fontWeight: '800',
    },
    activeLabel: {
      color: '#FFFFFF',
    },
  });
