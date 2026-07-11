import {
  Bell,
  ChevronDown,
  Command,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
  X,
} from "lucide-react-native";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import type { AppPalette } from "../../theme/tokens";
import type { TabName, ThemeName } from "../../types/domain";

type Result = { id: string; title: string; meta: string; tab: TabName };
type Props = {
  colors: AppPalette;
  themeName: ThemeName;
  profileName: string;
  query: string;
  results: Result[];
  profileOpen: boolean;
  notificationsOpen: boolean;
  onQuery: (v: string) => void;
  onToggleTheme: () => void;
  onToggleProfile: () => void;
  onToggleNotifications: () => void;
  onNavigate: (tab: TabName) => void;
  onLock: () => void;
};

export function AppHeader({
  colors,
  themeName,
  profileName,
  query,
  results,
  profileOpen,
  notificationsOpen,
  onQuery,
  onToggleTheme,
  onToggleProfile,
  onToggleNotifications,
  onNavigate,
  onLock,
}: Props) {
  const s = createStyles(colors);
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
    <View style={s.header}>
      <View style={s.searchWrap}>
        <View style={s.search}>
          <Search size={16} color={colors.textFaint} />
          <TextInput
            value={query}
            onChangeText={onQuery}
            placeholder="Поиск по NOVA"
            placeholderTextColor={colors.textFaint}
            style={s.searchInput}
          />
          {query ? (
            <Pressable onPress={() => onQuery("")}>
              <X size={14} color={colors.textFaint} />
            </Pressable>
          ) : (
            <View style={s.shortcut}>
              <Command size={11} color={colors.textFaint} />
              <Text style={s.shortcutText}>K</Text>
            </View>
          )}
        </View>
        {!!query && (
          <View style={s.searchPanel}>
            {results.length ? (
              results.map((r) => (
                <Pressable
                  key={r.id}
                  style={s.result}
                  onPress={() => {
                    onNavigate(r.tab);
                    onQuery("");
                  }}
                >
                  <Search size={14} color={colors.accent} />
                  <View>
                    <Text style={s.resultTitle}>{r.title}</Text>
                    <Text style={s.resultMeta}>{r.meta}</Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={s.empty}>Ничего не найдено</Text>
            )}
          </View>
        )}
      </View>
      <View style={s.actions}>
        <Pressable style={s.iconButton} onPress={onToggleTheme}>
          {themeName === "dark" ? (
            <Sun size={17} color={colors.textSoft} />
          ) : (
            <Moon size={17} color={colors.textSoft} />
          )}
        </Pressable>
        <View>
          <Pressable style={s.iconButton} onPress={onToggleNotifications}>
            <Bell size={17} color={colors.textSoft} />
            <View style={s.dot} />
          </Pressable>
          {notificationsOpen && (
            <View style={[s.popover, s.notifications]}>
              <Text style={s.popTitle}>Уведомления</Text>
              <Notice
                title="Перелет"
                text="Оплата запланирована на 15–20 июля"
                colors={colors}
              />
              <Notice
                title="Бюджет"
                text="До следующей зарплаты 3 дня"
                colors={colors}
              />
              <Notice
                title="Документы"
                text="Проверь страховку и визу"
                colors={colors}
              />
              <Pressable
                style={s.openCenter}
                onPress={() => onNavigate("notifications")}
              >
                <Text style={s.openCenterText}>Открыть центр уведомлений</Text>
              </Pressable>
            </View>
          )}
        </View>
        <View style={s.rule} />
        <View>
          <Pressable style={s.user} onPress={onToggleProfile}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={s.userName}>{firstName}</Text>
              <Text style={s.userPlan}>NOVA Personal</Text>
            </View>
            <ChevronDown size={14} color={colors.textFaint} />
          </Pressable>
          {profileOpen && (
            <View style={[s.popover, s.profileMenu]}>
              <Pressable
                style={s.menuItem}
                onPress={() => onNavigate("profile")}
              >
                <UserRound size={15} color={colors.textSoft} />
                <Text style={s.menuText}>Мой профиль</Text>
              </Pressable>
              <Pressable
                style={s.menuItem}
                onPress={() => onNavigate("settings")}
              >
                <Settings size={15} color={colors.textSoft} />
                <Text style={s.menuText}>Настройки</Text>
              </Pressable>
              <View style={s.menuDivider} />
              <Pressable style={s.menuItem} onPress={onLock}>
                <LogOut size={15} color={colors.red} />
                <Text style={[s.menuText, { color: colors.red }]}>
                  Заблокировать
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
function Notice({
  title,
  text,
  colors,
}: {
  title: string;
  text: string;
  colors: AppPalette;
}) {
  const s = createStyles(colors);
  return (
    <View style={s.notice}>
      <View style={s.noticeDot} />
      <View>
        <Text style={s.noticeTitle}>{title}</Text>
        <Text style={s.noticeText}>{text}</Text>
      </View>
    </View>
  );
}
const createStyles = (c: AppPalette) =>
  StyleSheet.create({
    header: {
      height: 68,
      zIndex: 50,
      paddingHorizontal: 22,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor:
        c.mode === "dark" ? "rgba(3,10,25,.44)" : "rgba(241,247,255,.62)",
      ...(Platform.OS === "web"
        ? ({
            backdropFilter: "blur(28px) saturate(140%)",
            WebkitBackdropFilter: "blur(28px) saturate(140%)",
          } as ViewStyle)
        : {}),
    },
    searchWrap: { position: "relative", zIndex: 60 },
    search: {
      width: 310,
      height: 36,
      borderRadius: 8,
      paddingHorizontal: 11,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: c.surfaceSoft,
      borderWidth: 1,
      borderColor: c.border,
    },
    searchInput: {
      flex: 1,
      color: c.text,
      fontSize: 12,
      outlineStyle: "none",
    } as any,
    shortcut: {
      flexDirection: "row",
      gap: 3,
      alignItems: "center",
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 5,
      paddingHorizontal: 6,
      paddingVertical: 3,
    },
    shortcutText: { color: c.textFaint, fontSize: 9, fontWeight: "700" },
    searchPanel: {
      position: "absolute",
      top: 43,
      left: 0,
      width: 360,
      padding: 7,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.borderStrong,
      backgroundColor:
        c.mode === "dark" ? "rgba(5,14,32,.96)" : "rgba(250,252,255,.98)",
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    result: {
      minHeight: 48,
      borderRadius: 7,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    resultTitle: { color: c.text, fontSize: 12, fontWeight: "700" },
    resultMeta: { color: c.textFaint, fontSize: 9, marginTop: 2 },
    empty: { color: c.textFaint, fontSize: 11, padding: 12 },
    actions: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconButton: {
      position: "relative",
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
    },
    dot: {
      position: "absolute",
      right: 8,
      top: 7,
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.red,
    },
    rule: {
      width: 1,
      height: 28,
      backgroundColor: c.border,
      marginHorizontal: 3,
    },
    user: { flexDirection: "row", alignItems: "center", gap: 8 },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { color: "#03101F", fontSize: 10, fontWeight: "900" },
    userName: { color: c.text, fontSize: 11, fontWeight: "800" },
    userPlan: { color: c.textFaint, fontSize: 9, marginTop: 1 },
    popover: {
      position: "absolute",
      right: 0,
      top: 45,
      zIndex: 80,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.borderStrong,
      backgroundColor:
        c.mode === "dark" ? "rgba(5,14,32,.97)" : "rgba(250,252,255,.98)",
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 28,
      padding: 7,
    },
    profileMenu: { width: 210 },
    notifications: { width: 310, right: 0, padding: 12 },
    popTitle: {
      color: c.text,
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 8,
    },
    menuItem: {
      height: 38,
      borderRadius: 7,
      paddingHorizontal: 9,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },
    menuText: { color: c.textSoft, fontSize: 11, fontWeight: "700" },
    menuDivider: { height: 1, backgroundColor: c.border, marginVertical: 5 },
    notice: {
      minHeight: 54,
      flexDirection: "row",
      gap: 9,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    noticeDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: c.accent,
      marginTop: 5,
    },
    noticeTitle: { color: c.text, fontSize: 11, fontWeight: "800" },
    noticeText: { color: c.textFaint, fontSize: 9, marginTop: 3 },
    openCenter: {
      height: 34,
      marginTop: 8,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accentSoft,
    },
    openCenterText: { color: c.accent, fontSize: 9, fontWeight: "800" },
  });
