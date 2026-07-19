import {
  Bell,
  ChevronDown,
  Command,
  LockKeyhole,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
  X,
} from "lucide-react-native";
import { useEffect, useMemo, useRef } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import { navigationItems } from "../../config/navigation";
import type { AppPalette } from "../../theme/tokens";
import type { TabName, ThemeName } from "../../types/domain";

type Result = { id: string; title: string; meta: string; tab: TabName };
type Props = {
  colors: AppPalette;
  activeTab: TabName;
  themeName: ThemeName;
  profileName: string;
  query: string;
  results: Result[];
  profileOpen: boolean;
  notificationsOpen: boolean;
  searchRequest: number;
  onQuery: (value: string) => void;
  onToggleTheme: () => void;
  onToggleProfile: () => void;
  onToggleNotifications: () => void;
  onNavigate: (tab: TabName) => void;
  onLock: () => void;
};

export function AppHeader({
  colors,
  activeTab,
  themeName,
  profileName,
  query,
  results,
  profileOpen,
  notificationsOpen,
  searchRequest,
  onQuery,
  onToggleTheme,
  onToggleProfile,
  onToggleNotifications,
  onNavigate,
  onLock,
}: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const styles = createStyles(colors, compact);
  const searchRef = useRef<TextInput>(null);
  const current = useMemo(
    () =>
      navigationItems.find((item) => item.key === activeTab) || {
        label: activeTab === "notifications" ? "Уведомления" : "NOVA",
        hint: "личное рабочее пространство",
      },
    [activeTab],
  );

  useEffect(() => {
    if (searchRequest > 0) searchRef.current?.focus();
  }, [searchRequest]);

  const firstName = profileName.trim().split(/\s+/)[0] || "Пользователь";
  const initials =
    profileName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "N";

  return (
    <View style={styles.header}>
      {!compact && (
        <View style={styles.context}>
          <View style={styles.contextMark}>
            <Text style={styles.contextMarkText}>N</Text>
          </View>
          <View>
            <View style={styles.breadcrumb}>
              <Text style={styles.breadcrumbMuted}>NOVA</Text>
              <Text style={styles.breadcrumbDivider}>/</Text>
              <Text style={styles.breadcrumbActive}>{current.label}</Text>
            </View>
            <Text style={styles.contextHint}>{current.hint}</Text>
          </View>
        </View>
      )}

      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Search size={15} color={colors.textFaint} />
          <TextInput
            ref={searchRef}
            value={query}
            onChangeText={onQuery}
            placeholder="Поиск по рабочему пространству"
            placeholderTextColor={colors.textFaint}
            style={styles.searchInput}
          />
          {query ? (
            <Pressable accessibilityLabel="Очистить поиск" onPress={() => onQuery("")}>
              <X size={14} color={colors.textFaint} />
            </Pressable>
          ) : (
            !compact && (
              <View style={styles.shortcut}>
                <Command size={10} color={colors.textFaint} />
                <Text style={styles.shortcutText}>K</Text>
              </View>
            )
          )}
        </View>
        {!!query && (
          <View style={styles.searchPanel}>
            {results.length ? (
              results.map((result) => (
                <Pressable
                  key={result.id}
                  style={styles.result}
                  onPress={() => {
                    onNavigate(result.tab);
                    onQuery("");
                  }}
                >
                  <View style={styles.resultIcon}>
                    <Search size={13} color={colors.textSoft} />
                  </View>
                  <View style={styles.resultCopy}>
                    <Text style={styles.resultTitle}>{result.title}</Text>
                    <Text style={styles.resultMeta}>{result.meta}</Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={styles.empty}>Ничего не найдено</Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityLabel="Сменить тему" style={styles.iconButton} onPress={onToggleTheme}>
          {themeName === "dark" ? (
            <Sun size={16} color={colors.textSoft} />
          ) : (
            <Moon size={16} color={colors.textSoft} />
          )}
        </Pressable>
        <View>
          <Pressable accessibilityLabel="Уведомления" style={styles.iconButton} onPress={onToggleNotifications}>
            <Bell size={16} color={colors.textSoft} />
            <View style={styles.dot} />
          </Pressable>
          {notificationsOpen && (
            <View style={[styles.popover, styles.notifications]}>
              <View style={styles.popHead}>
                <Text style={styles.popTitle}>Уведомления</Text>
                <Text style={styles.popCount}>3 новых</Text>
              </View>
              <Notice title="Переезд" text="Проверь оплату билетов и отеля" colors={colors} />
              <Notice title="Бюджет" text="Следующее поступление 28 июля" colors={colors} />
              <Notice title="Документы" text="Добавь билеты после покупки" colors={colors} />
              <Pressable style={styles.openCenter} onPress={() => onNavigate("notifications")}>
                <Text style={styles.openCenterText}>Открыть центр уведомлений</Text>
              </Pressable>
            </View>
          )}
        </View>
        {!compact && <View style={styles.rule} />}
        <View>
          <Pressable style={styles.user} onPress={onToggleProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {!compact && (
              <View style={styles.userCopy}>
                <Text style={styles.userName}>{firstName}</Text>
                <Text style={styles.userPlan}>Personal owner</Text>
              </View>
            )}
            {!compact && <ChevronDown size={13} color={colors.textFaint} />}
          </Pressable>
          {profileOpen && (
            <View style={[styles.popover, styles.profileMenu]}>
              <View style={styles.profileSummary}>
                <View style={styles.avatarLarge}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.resultCopy}>
                  <Text style={styles.profileTitle}>{profileName}</Text>
                  <Text style={styles.resultMeta}>NOVA Personal</Text>
                </View>
              </View>
              <MenuItem colors={colors} icon={UserRound} label="Мой профиль" onPress={() => onNavigate("profile")} />
              <MenuItem colors={colors} icon={Settings} label="Настройки" onPress={() => onNavigate("settings")} />
              <View style={styles.menuDivider} />
              <MenuItem colors={colors} icon={LockKeyhole} label="Заблокировать" onPress={onLock} danger />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function Notice({ title, text, colors }: { title: string; text: string; colors: AppPalette }) {
  const styles = createStyles(colors, false);
  return (
    <View style={styles.notice}>
      <View style={styles.noticeDot} />
      <View style={styles.resultCopy}>
        <Text style={styles.noticeTitle}>{title}</Text>
        <Text style={styles.noticeText}>{text}</Text>
      </View>
    </View>
  );
}

function MenuItem({ colors, icon: Icon, label, onPress, danger }: { colors: AppPalette; icon: typeof LogOut; label: string; onPress: () => void; danger?: boolean }) {
  const styles = createStyles(colors, false);
  const tone = danger ? colors.red : colors.textSoft;
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Icon size={15} color={tone} />
      <Text style={[styles.menuText, danger && { color: colors.red }]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: AppPalette, compact: boolean) =>
  StyleSheet.create({
    header: {
      height: 66,
      zIndex: 50,
      marginTop: 10,
      marginRight: 10,
      paddingHorizontal: compact ? 10 : 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: colors.mode === "dark" ? "rgba(17,22,29,.74)" : "rgba(248,249,250,.82)",
      ...(Platform.OS === "web"
        ? ({ backdropFilter: "blur(34px) saturate(112%)", WebkitBackdropFilter: "blur(34px) saturate(112%)" } as ViewStyle)
        : {}),
    },
    context: { minWidth: 210, flexDirection: "row", alignItems: "center", gap: 10 },
    contextMark: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.text },
    contextMarkText: { color: colors.mode === "dark" ? "#171A1F" : "#FFFFFF", fontSize: 11, fontWeight: "900" },
    breadcrumb: { flexDirection: "row", alignItems: "center", gap: 5 },
    breadcrumbMuted: { color: colors.textFaint, fontSize: 8, fontWeight: "800" },
    breadcrumbDivider: { color: colors.borderStrong, fontSize: 9 },
    breadcrumbActive: { color: colors.text, fontSize: 10, fontWeight: "900" },
    contextHint: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
    searchWrap: { flex: 1, maxWidth: 460, position: "relative", zIndex: 60 },
    search: { height: 36, paddingHorizontal: 10, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border },
    searchInput: { flex: 1, color: colors.text, fontSize: 10, outlineStyle: "none" } as any,
    shortcut: { height: 20, paddingHorizontal: 6, flexDirection: "row", gap: 3, alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 5, backgroundColor: colors.surfaceSolid },
    shortcutText: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
    searchPanel: { position: "absolute", top: 43, left: 0, right: 0, padding: 7, borderRadius: 8, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.mode === "dark" ? "rgba(20,25,32,.98)" : "rgba(249,250,251,.98)", shadowColor: colors.shadow, shadowOpacity: 1, shadowRadius: 24 },
    result: { minHeight: 48, borderRadius: 7, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", gap: 9 },
    resultIcon: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSoft },
    resultCopy: { flex: 1, minWidth: 0 },
    resultTitle: { color: colors.text, fontSize: 10, fontWeight: "800" },
    resultMeta: { color: colors.textFaint, fontSize: 8, marginTop: 2 },
    empty: { color: colors.textFaint, fontSize: 9, padding: 12 },
    actions: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 7 },
    iconButton: { position: "relative", width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft },
    dot: { position: "absolute", right: 7, top: 6, width: 5, height: 5, borderRadius: 3, backgroundColor: colors.red, borderWidth: 1, borderColor: colors.surfaceSolid },
    rule: { width: 1, height: 28, backgroundColor: colors.border, marginHorizontal: 2 },
    user: { height: 38, paddingHorizontal: compact ? 2 : 4, flexDirection: "row", alignItems: "center", gap: 8 },
    avatar: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
    avatarLarge: { width: 38, height: 38, borderRadius: 9, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
    avatarText: { color: colors.text, fontSize: 9, fontWeight: "900" },
    userCopy: { minWidth: 76 },
    userName: { color: colors.text, fontSize: 9, fontWeight: "900" },
    userPlan: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
    popover: { position: "absolute", right: 0, top: 45, zIndex: 80, borderRadius: 8, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.mode === "dark" ? "rgba(20,25,32,.98)" : "rgba(249,250,251,.98)", shadowColor: colors.shadow, shadowOpacity: 1, shadowRadius: 28, padding: 7 },
    profileMenu: { width: 220 },
    notifications: { width: 310, padding: 11 },
    popHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
    popTitle: { color: colors.text, fontSize: 11, fontWeight: "900" },
    popCount: { color: colors.textFaint, fontSize: 7, fontWeight: "800" },
    profileSummary: { padding: 7, marginBottom: 6, flexDirection: "row", alignItems: "center", gap: 9, borderRadius: 7, backgroundColor: colors.surfaceSoft },
    profileTitle: { color: colors.text, fontSize: 9, fontWeight: "900" },
    menuItem: { height: 36, borderRadius: 7, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", gap: 8 },
    menuText: { color: colors.textSoft, fontSize: 9, fontWeight: "800" },
    menuDivider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
    notice: { minHeight: 52, flexDirection: "row", alignItems: "flex-start", gap: 8, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
    noticeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, marginTop: 4 },
    noticeTitle: { color: colors.text, fontSize: 9, fontWeight: "900" },
    noticeText: { color: colors.textFaint, fontSize: 8, marginTop: 3 },
    openCenter: { height: 34, marginTop: 7, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSoft },
    openCenterText: { color: colors.textSoft, fontSize: 8, fontWeight: "900" },
  });
