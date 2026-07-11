import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react-native";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { navigationItems } from "../../config/navigation";
import type { AppPalette } from "../../theme/tokens";
import type { Profile, TabName } from "../../types/domain";
import { NovaLogo } from "../brand/NovaLogo";

type Props = {
  colors: AppPalette;
  activeTab: TabName;
  profile: Profile;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onChangeTab: (tab: TabName) => void;
};

export function Sidebar({
  colors,
  activeTab,
  profile,
  collapsed,
  onToggleCollapsed,
  onChangeTab,
}: Props) {
  const styles = createStyles(colors, collapsed);

  return (
    <View style={styles.sidebar}>
      <View style={styles.brandRow}>
        <NovaLogo size={34} colors={colors} />
        {!collapsed && <Text style={styles.brand}>NOVA</Text>}
      </View>

      <View style={styles.nav}>
        <Text style={styles.navCaption}>{collapsed ? "•••" : "WORKSPACE"}</Text>
        {navigationItems.slice(0, 8).map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => onChangeTab(item.key)}
              style={[styles.navItem, active && styles.navItemActive]}
            >
              <Icon
                size={18}
                color={active ? colors.text : colors.textFaint}
                strokeWidth={active ? 2.4 : 1.8}
              />
              {!collapsed && (
                <Text
                  style={[styles.navLabel, active && styles.navLabelActive]}
                >
                  {item.label}
                </Text>
              )}
              {active && <View style={styles.activeMark} />}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={styles.navItem}
          onPress={() => onChangeTab("settings")}
        >
          <Settings size={18} color={colors.textFaint} />
          {!collapsed && <Text style={styles.navLabel}>Настройки</Text>}
        </Pressable>
        <Pressable style={styles.navItem}>
          <Bell size={18} color={colors.textFaint} />
          {!collapsed && <Text style={styles.navLabel}>Уведомления</Text>}
          {!collapsed && <View style={styles.notification} />}
        </Pressable>
        <View style={styles.divider} />
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>БФ</Text>
          </View>
          {!collapsed && (
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileMeta}>Personal workspace</Text>
            </View>
          )}
          {!collapsed && <LogOut size={16} color={colors.textFaint} />}
        </View>
        <Pressable style={styles.collapse} onPress={onToggleCollapsed}>
          {collapsed ? (
            <ChevronRight size={16} color={colors.textFaint} />
          ) : (
            <ChevronLeft size={16} color={colors.textFaint} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: AppPalette, collapsed: boolean) =>
  StyleSheet.create({
    sidebar: {
      width: collapsed ? 76 : 224,
      height: "100%",
      paddingHorizontal: 12,
      paddingVertical: 18,
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(3, 9, 22, 0.68)"
          : "rgba(247,247,245,.82)",
      borderRightWidth: 1,
      borderRightColor: colors.border,
      ...(Platform.OS === "web"
        ? ({
            backdropFilter: "blur(32px) saturate(140%)",
            WebkitBackdropFilter: "blur(32px) saturate(140%)",
          } as ViewStyle)
        : {}),
    },
    brandRow: {
      height: 48,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    brand: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "900",
      letterSpacing: 0,
    },
    nav: { flex: 1, paddingTop: 22, gap: 5 },
    navCaption: {
      height: 24,
      paddingHorizontal: 12,
      color: colors.textFaint,
      fontSize: 9,
      fontWeight: "800",
    },
    navItem: {
      position: "relative",
      height: 42,
      borderRadius: 8,
      paddingHorizontal: collapsed ? 16 : 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: collapsed ? "center" : "flex-start",
      gap: 11,
    },
    navItemActive: {
      backgroundColor: colors.mode === "dark" ? "#20201F" : "#EAEAE6",
    },
    navLabel: { color: colors.textFaint, fontSize: 13, fontWeight: "600" },
    navLabelActive: { color: colors.text, fontWeight: "700" },
    activeMark: {
      position: "absolute",
      left: -12,
      width: 2,
      height: 18,
      borderRadius: 2,
      backgroundColor: colors.accent,
    },
    bottom: { gap: 3 },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
    notification: {
      marginLeft: "auto",
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    profile: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      paddingHorizontal: 7,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
    },
    avatarText: { color: "#03101F", fontSize: 10, fontWeight: "900" },
    profileCopy: { flex: 1, minWidth: 0 },
    profileName: { color: colors.text, fontSize: 11, fontWeight: "700" },
    profileMeta: { color: colors.textFaint, fontSize: 9, marginTop: 2 },
    collapse: {
      position: "absolute",
      right: collapsed ? 18 : -12,
      top: -420,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceSolid,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
