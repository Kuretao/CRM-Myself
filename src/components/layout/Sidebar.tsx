import {
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  FileCheck2,
  LayoutDashboard,
  Languages,
  Plus,
  Search,
  Settings,
  WalletCards,
} from "lucide-react-native";
import {
  Platform,
  Pressable,
  ScrollView,
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
  onOpenSearch: () => void;
};
type NavGroup = { title: string; items: TabName[] };

const groups: NavGroup[] = [
  { title: "Деньги", items: ["overview", "finance", "planning", "reports"] },
  { title: "Организация", items: ["tasks", "documents", "ai"] },
  { title: "Развитие", items: ["chinese", "profile"] },
];
const badges: Partial<Record<TabName, string>> = {
  tasks: "4",
  documents: "3",
  notifications: "3",
};
const railItems: { tab: TabName; icon: typeof LayoutDashboard; label: string }[] = [
  { tab: "overview", icon: LayoutDashboard, label: "Главная" },
  { tab: "finance", icon: WalletCards, label: "Финансы" },
  { tab: "tasks", icon: Command, label: "Задачи" },
  { tab: "chinese", icon: Languages, label: "Китайский" },
  { tab: "documents", icon: FileCheck2, label: "Документы" },
  { tab: "ai", icon: Bot, label: "NOVA AI" },
];

export function Sidebar({
  colors,
  activeTab,
  profile,
  collapsed,
  onToggleCollapsed,
  onChangeTab,
  onOpenSearch,
}: Props) {
  const s = createStyles(colors, collapsed);
  const initials =
    profile.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "N";

  return (
    <View style={s.sidebar}>
      <View style={s.rail}>
        <View style={s.railLogo}>
          <NovaLogo size={30} colors={colors} />
        </View>
        <View style={s.railRule} />
        <View style={s.railNav}>
          {railItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.tab;
            return (
              <Pressable
                key={item.tab}
                accessibilityLabel={item.label}
                onPress={() => onChangeTab(item.tab)}
                style={[s.railButton, active && s.railButtonActive]}
              >
                <Icon size={18} color={active ? colors.text : colors.textFaint} strokeWidth={active ? 2.3 : 1.8} />
                {item.tab === "tasks" && <View style={s.railDot} />}
              </Pressable>
            );
          })}
        </View>
        <View style={s.railBottom}>
          <Pressable accessibilityLabel="Уведомления" style={[s.railButton, activeTab === "notifications" && s.railButtonActive]} onPress={() => onChangeTab("notifications")}>
            <Bell size={18} color={activeTab === "notifications" ? colors.text : colors.textFaint} />
            <View style={s.railDot} />
          </Pressable>
          <Pressable accessibilityLabel="Настройки" style={[s.railButton, activeTab === "settings" && s.railButtonActive]} onPress={() => onChangeTab("settings")}>
            <Settings size={18} color={activeTab === "settings" ? colors.text : colors.textFaint} />
          </Pressable>
        </View>
      </View>

      {!collapsed && (
        <View style={s.panel}>
          <View style={s.panelHeader}>
            <View style={s.workspaceMark}><Text style={s.workspaceMarkText}>N</Text></View>
            <View style={s.workspaceCopy}>
              <Text style={s.workspaceName}>NOVA Personal</Text>
              <Text style={s.workspaceMeta}>Личное пространство</Text>
            </View>
            <Pressable accessibilityLabel="Свернуть меню" style={s.collapse} onPress={onToggleCollapsed}>
              <ChevronLeft size={15} color={colors.textFaint} />
            </Pressable>
          </View>

          <View style={s.profileRow}>
            <Pressable style={s.profileMain} onPress={() => onChangeTab("profile")}>
              <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
              <View style={s.profileCopy}>
                <Text style={s.profileName} numberOfLines={1}>{profile.name}</Text>
                <Text style={s.profileMeta}>Personal owner</Text>
              </View>
              <ChevronRight size={14} color={colors.textFaint} />
            </Pressable>
          </View>

          <Pressable style={s.quickSearch} accessibilityLabel="Открыть поиск" onPress={onOpenSearch}>
            <Search size={14} color={colors.textFaint} />
            <Text style={s.quickSearchText}>Быстрый переход</Text>
            <View style={s.shortcut}><Text style={s.shortcutText}>⌘ K</Text></View>
          </Pressable>

          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
            {groups.map((group) => (
              <View key={group.title} style={s.group}>
                <Text style={s.groupTitle}>{group.title}</Text>
                {group.items.map((key) => {
                  const item = navigationItems.find((candidate) => candidate.key === key);
                  if (!item) return null;
                  const Icon = item.icon;
                  const active = activeTab === key;
                  return (
                    <Pressable key={key} onPress={() => onChangeTab(key)} style={[s.navItem, active && s.navItemActive]}>
                      <Icon size={16} color={active ? colors.text : colors.textFaint} strokeWidth={active ? 2.3 : 1.8} />
                      <Text style={[s.navLabel, active && s.navLabelActive]}>{item.label}</Text>
                      {badges[key] && <View style={[s.badge, active && s.badgeActive]}><Text style={[s.badgeText, active && s.badgeTextActive]}>{badges[key]}</Text></View>}
                    </Pressable>
                  );
                })}
              </View>
            ))}

            <View style={s.collection}>
              <View style={s.collectionHead}>
                <View><Text style={s.groupTitle}>Рабочие подборки</Text><Text style={s.collectionMeta}>Быстрый контекст</Text></View>
                <Pressable style={s.addButton} accessibilityLabel="Добавить подборку" onPress={() => onChangeTab("tasks")}><Plus size={14} color={colors.textSoft} /></Pressable>
              </View>
              <Pressable style={s.collectionItem} onPress={() => onChangeTab("planning")}><View style={[s.collectionDot, { backgroundColor: colors.blue }]} /><Text style={s.collectionLabel}>Переезд в Чэнду</Text><Text style={s.collectionCount}>8</Text></Pressable>
              <Pressable style={s.collectionItem} onPress={() => onChangeTab("finance")}><View style={[s.collectionDot, { backgroundColor: colors.green }]} /><Text style={s.collectionLabel}>Бюджет 2026</Text><Text style={s.collectionCount}>12</Text></Pressable>
              <Pressable style={s.collectionItem} onPress={() => onChangeTab("chinese")}><View style={[s.collectionDot, { backgroundColor: colors.amber }]} /><Text style={s.collectionLabel}>Китайский HSK</Text><Text style={s.collectionCount}>16</Text></Pressable>
            </View>
          </ScrollView>

          <View style={s.panelFooter}>
            <View style={s.syncCard}>
              <View style={s.syncStatus} />
              <View style={{ flex: 1 }}><Text style={s.syncTitle}>Локальная база</Text><Text style={s.syncMeta}>Все изменения сохранены</Text></View>
            </View>
            <View style={s.footerActions}>
              <Pressable style={s.footerButton} onPress={() => onChangeTab("settings")}><Settings size={14} color={colors.textSoft} /><Text style={s.footerButtonText}>Настройки</Text></Pressable>
              <Pressable style={s.helpButton} accessibilityLabel="Помощь" onPress={() => onChangeTab("settings")}><CircleHelp size={15} color={colors.textFaint} /></Pressable>
            </View>
          </View>
        </View>
      )}

      {collapsed && (
        <Pressable accessibilityLabel="Развернуть меню" style={s.expand} onPress={onToggleCollapsed}>
          <ChevronRight size={15} color={colors.textFaint} />
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (c: AppPalette, collapsed: boolean) => {
  return StyleSheet.create({
    sidebar: { width: collapsed ? 74 : 320, height: "100%", padding: 10, paddingRight: collapsed ? 10 : 0, flexDirection: "row", gap: 8, position: "relative" },
    rail: { width: 54, height: "100%", borderRadius: 10, paddingVertical: 9, alignItems: "center", backgroundColor: c.mode === "dark" ? "rgba(10,14,20,.88)" : "rgba(248,249,250,.88)", borderWidth: 1, borderColor: c.border, ...(Platform.OS === "web" ? ({ backdropFilter: "blur(32px) saturate(112%)", WebkitBackdropFilter: "blur(32px) saturate(112%)" } as ViewStyle) : {}) },
    railLogo: { height: 42, justifyContent: "center" }, railRule: { width: 28, height: 1, backgroundColor: c.border, marginVertical: 7 }, railNav: { flex: 1, gap: 6, alignItems: "center", paddingTop: 4 }, railBottom: { gap: 6 },
    railButton: { width: 38, height: 38, borderRadius: 8, alignItems: "center", justifyContent: "center", position: "relative" }, railButtonActive: { backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.borderStrong }, railDot: { position: "absolute", top: 7, right: 7, width: 5, height: 5, borderRadius: 3, backgroundColor: c.accent, borderWidth: 1, borderColor: c.surfaceSolid },
    panel: { flex: 1, minWidth: 0, height: "100%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, backgroundColor: c.mode === "dark" ? "rgba(17,22,29,.78)" : "rgba(248,249,250,.84)", borderWidth: 1, borderRightWidth: 0, borderColor: c.border, ...(Platform.OS === "web" ? ({ backdropFilter: "blur(34px) saturate(112%)", WebkitBackdropFilter: "blur(34px) saturate(112%)" } as ViewStyle) : {}) },
    panelHeader: { height: 66, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: c.border }, workspaceMark: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: c.text }, workspaceMarkText: { color: c.mode === "dark" ? "#07101E" : "#FFFFFF", fontSize: 12, fontWeight: "900" }, workspaceCopy: { flex: 1 }, workspaceName: { color: c.text, fontSize: 11, fontWeight: "900" }, workspaceMeta: { color: c.textFaint, fontSize: 8, marginTop: 2 }, collapse: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: c.border, backgroundColor: c.surfaceSoft },
    profileRow: { paddingHorizontal: 12, paddingTop: 12 }, profileMain: { height: 52, paddingHorizontal: 8, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.border }, avatar: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: c.accent }, avatarText: { color: "#05101D", fontSize: 10, fontWeight: "900" }, profileCopy: { flex: 1, minWidth: 0 }, profileName: { color: c.text, fontSize: 10, fontWeight: "800" }, profileMeta: { color: c.textFaint, fontSize: 8, marginTop: 2 },
    quickSearch: { marginHorizontal: 12, marginTop: 9, height: 34, borderRadius: 7, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderColor: c.border, backgroundColor: c.surfaceSoft }, quickSearchText: { flex: 1, color: c.textFaint, fontSize: 9 }, shortcut: { paddingHorizontal: 5, height: 19, borderRadius: 5, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceSolid }, shortcutText: { color: c.textFaint, fontSize: 7, fontWeight: "800" },
    scroll: { flex: 1, marginTop: 6 }, scrollContent: { paddingHorizontal: 12, paddingBottom: 12 }, group: { paddingTop: 12, paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: c.border }, groupTitle: { color: c.textFaint, fontSize: 8, fontWeight: "900", textTransform: "uppercase" }, navItem: { height: 34, borderRadius: 7, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 9, marginTop: 3 }, navItemActive: { backgroundColor: c.mode === "dark" ? "rgba(255,255,255,.1)" : "rgba(17,22,41,.08)", borderWidth: 1, borderColor: c.borderStrong }, navLabel: { flex: 1, color: c.textSoft, fontSize: 10, fontWeight: "600" }, navLabelActive: { color: c.text, fontWeight: "800" }, badge: { minWidth: 20, height: 20, paddingHorizontal: 5, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceSolid }, badgeActive: { backgroundColor: c.text }, badgeText: { color: c.textFaint, fontSize: 7, fontWeight: "900" }, badgeTextActive: { color: c.mode === "dark" ? "#06101E" : "#FFFFFF" },
    collection: { paddingTop: 13 }, collectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }, collectionMeta: { color: c.textFaint, fontSize: 7, marginTop: 2 }, addButton: { width: 26, height: 26, borderRadius: 7, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: c.border }, collectionItem: { height: 32, borderRadius: 7, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 8 }, collectionDot: { width: 7, height: 7, borderRadius: 2 }, collectionLabel: { flex: 1, color: c.textSoft, fontSize: 9, fontWeight: "700" }, collectionCount: { color: c.textFaint, fontSize: 8 },
    panelFooter: { padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: c.border }, syncCard: { minHeight: 42, paddingHorizontal: 9, borderRadius: 7, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: c.surfaceSoft }, syncStatus: { width: 7, height: 7, borderRadius: 4, backgroundColor: c.green }, syncTitle: { color: c.text, fontSize: 9, fontWeight: "800" }, syncMeta: { color: c.textFaint, fontSize: 7, marginTop: 2 }, footerActions: { flexDirection: "row", gap: 6 }, footerButton: { flex: 1, height: 32, borderRadius: 7, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderColor: c.border }, footerButtonText: { color: c.textSoft, fontSize: 8, fontWeight: "800" }, helpButton: { width: 32, height: 32, borderRadius: 7, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: c.border },
    expand: { position: "absolute", right: -8, top: 78, width: 24, height: 30, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceSolid, borderWidth: 1, borderColor: c.border, zIndex: 5 },
  });
};
