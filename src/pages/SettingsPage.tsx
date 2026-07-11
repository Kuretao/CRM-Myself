import {
  Database,
  Moon,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sun,
} from "lucide-react-native";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Button } from "../components/ui/Button";
import { Surface } from "../components/ui/Surface";
import type { AppPalette } from "../theme/tokens";
import type { ThemeName } from "../types/domain";
export function SettingsPage({
  colors: c,
  themeName,
  onToggleTheme,
  onResetData,
}: {
  colors: AppPalette;
  themeName: ThemeName;
  onToggleTheme: () => void;
  onResetData: () => void;
}) {
  const s = css(c),
    dark = themeName === "dark";
  return (
    <View style={s.page}>
      <View>
        <Text style={s.kicker}>NOVA CONTROL</Text>
        <Text style={s.title}>Настройки</Text>
        <Text style={s.sub}>Внешний вид, безопасность и локальные данные.</Text>
      </View>
      <View style={s.grid}>
        <View style={s.main}>
          <Surface colors={c} style={s.panel}>
            <Text style={s.panelTitle}>Интерфейс</Text>
            <Row
              c={c}
              icon={
                dark ? (
                  <Moon size={18} color={c.accent} />
                ) : (
                  <Sun size={18} color={c.amber} />
                )
              }
              title="Темная тема"
              text="Переключает всю палитру, стекло и фон"
            >
              <Switch
                value={dark}
                onValueChange={onToggleTheme}
                trackColor={{ false: c.borderStrong, true: c.accent }}
              />
            </Row>
            <Row
              c={c}
              icon={<Smartphone size={18} color={c.blue} />}
              title="Адаптивный интерфейс"
              text="Desktop, iPhone и web используют общие данные"
            >
              <Text style={s.badge}>ACTIVE</Text>
            </Row>
          </Surface>
          <Surface colors={c} style={s.panel}>
            <Text style={s.panelTitle}>Безопасность</Text>
            <Row
              c={c}
              icon={<ShieldCheck size={18} color={c.green} />}
              title="PIN-код"
              text="Код доступа 120800"
            >
              <Text style={s.badge}>ON</Text>
            </Row>
            <Row
              c={c}
              icon={<Database size={18} color={c.accent} />}
              title="Локальное хранилище"
              text="Данные сохраняются на этом устройстве"
            >
              <Text style={s.badge}>V2</Text>
            </Row>
          </Surface>
        </View>
        <Surface colors={c} style={s.danger}>
          <RotateCcw size={22} color={c.red} />
          <Text style={s.dangerTitle}>Сброс данных</Text>
          <Text style={s.dangerText}>
            Удалит добавленные операции, планы и задачи и вернет стартовый
            бюджет.
          </Text>
          <View style={{ marginTop: "auto" }}>
            <Button
              colors={c}
              label="Сбросить данные"
              variant="ghost"
              onPress={onResetData}
            />
          </View>
        </Surface>
      </View>
    </View>
  );
}
function Row({
  c,
  icon,
  title,
  text,
  children,
}: {
  c: AppPalette;
  icon: React.ReactNode;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  const s = css(c);
  return (
    <View style={s.row}>
      <View style={s.icon}>{icon}</View>
      <View style={s.copy}>
        <Text style={s.rowTitle}>{title}</Text>
        <Text style={s.rowText}>{text}</Text>
      </View>
      {children}
    </View>
  );
}
const css = (c: AppPalette) =>
  StyleSheet.create({
    page: { paddingTop: 22, gap: 14 },
    kicker: { color: c.textFaint, fontSize: 9, fontWeight: "800" },
    title: { color: c.text, fontSize: 25, fontWeight: "700", marginTop: 5 },
    sub: { color: c.textSoft, fontSize: 11, marginTop: 4 },
    grid: { flexDirection: "row", gap: 12, alignItems: "stretch" },
    main: { flex: 1, gap: 12 },
    panel: { padding: 15 },
    panelTitle: {
      color: c.text,
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 7,
    },
    row: {
      minHeight: 68,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    icon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: c.surfaceSolid,
      alignItems: "center",
      justifyContent: "center",
    },
    copy: { flex: 1 },
    rowTitle: { color: c.text, fontSize: 11, fontWeight: "800" },
    rowText: { color: c.textFaint, fontSize: 9, marginTop: 3 },
    badge: { color: c.green, fontSize: 8, fontWeight: "900" },
    danger: { width: 300, padding: 18 },
    dangerTitle: {
      color: c.text,
      fontSize: 15,
      fontWeight: "800",
      marginTop: 14,
    },
    dangerText: {
      color: c.textSoft,
      fontSize: 10,
      lineHeight: 16,
      marginTop: 6,
    },
  });
