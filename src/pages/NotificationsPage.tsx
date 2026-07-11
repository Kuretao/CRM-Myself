import {
  Bell,
  CalendarClock,
  CheckCheck,
  CreditCard,
  FileCheck2,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Surface } from "../components/ui/Surface";
import type { AppPalette } from "../theme/tokens";

const items = [
  {
    title: "Оплата перелета",
    text: "Запланирована на 15–20 июля. Проверь актуальную стоимость билетов.",
    time: "12 минут назад",
    type: "payment",
    unread: true,
  },
  {
    title: "Бюджет обновлен",
    text: "Добавлено 121 операция из банковского отчета на 312 798,04 ₽.",
    time: "сегодня, 14:20",
    type: "bank",
    unread: true,
  },
  {
    title: "Проверить документы",
    text: "Медицинская страховка и визовый сбор еще находятся в плане.",
    time: "сегодня, 09:00",
    type: "docs",
    unread: false,
  },
  {
    title: "Следующая зарплата",
    text: "До поступления с первой работы осталось 3 дня.",
    time: "вчера",
    type: "calendar",
    unread: false,
  },
];
export function NotificationsPage({ colors }: { colors: AppPalette }) {
  const s = css(colors);
  return (
    <View style={s.page}>
      <View style={s.head}>
        <View>
          <Text style={s.kicker}>ACTIVITY CENTER</Text>
          <Text style={s.title}>Уведомления</Text>
          <Text style={s.sub}>Платежи, задачи и важные изменения бюджета.</Text>
        </View>
        <Pressable style={s.read}>
          <CheckCheck size={15} color={colors.accent} />
          <Text style={s.readText}>Прочитать все</Text>
        </Pressable>
      </View>
      <View style={s.filters}>
        <Text style={s.filterOn}>Все</Text>
        <Text style={s.filter}>Непрочитанные</Text>
        <Text style={s.filter}>Финансы</Text>
        <Text style={s.filter}>Задачи</Text>
      </View>
      <Surface colors={colors} style={s.list}>
        {items.map((item, index) => (
          <View
            key={item.title}
            style={[s.item, index < items.length - 1 && s.divider]}
          >
            <View style={s.icon}>
              {item.type === "payment" ? (
                <CreditCard size={17} color={colors.red} />
              ) : item.type === "bank" ? (
                <Bell size={17} color={colors.accent} />
              ) : item.type === "docs" ? (
                <FileCheck2 size={17} color={colors.green} />
              ) : (
                <CalendarClock size={17} color={colors.amber} />
              )}
            </View>
            <View style={s.copy}>
              <View style={s.itemHead}>
                <Text style={s.itemTitle}>{item.title}</Text>
                {item.unread && <View style={s.dot} />}
              </View>
              <Text style={s.itemText}>{item.text}</Text>
              <Text style={s.time}>{item.time}</Text>
            </View>
            <Pressable style={s.more}>
              <Text style={s.moreText}>Подробнее</Text>
            </Pressable>
          </View>
        ))}
      </Surface>
    </View>
  );
}
const css = (c: AppPalette) =>
  StyleSheet.create({
    page: { paddingTop: 22, gap: 14 },
    head: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    kicker: { color: c.textFaint, fontSize: 9, fontWeight: "800" },
    title: { color: c.text, fontSize: 25, fontWeight: "700", marginTop: 5 },
    sub: { color: c.textSoft, fontSize: 11, marginTop: 4 },
    read: {
      height: 36,
      paddingHorizontal: 11,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    readText: { color: c.textSoft, fontSize: 10, fontWeight: "700" },
    filters: { flexDirection: "row", gap: 7 },
    filter: {
      paddingHorizontal: 11,
      paddingVertical: 7,
      color: c.textFaint,
      fontSize: 9,
      fontWeight: "700",
    },
    filterOn: {
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 7,
      backgroundColor: c.accentSoft,
      color: c.accent,
      fontSize: 9,
      fontWeight: "800",
    },
    list: { overflow: "hidden" },
    item: {
      minHeight: 92,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    divider: { borderBottomWidth: 1, borderBottomColor: c.border },
    icon: {
      width: 38,
      height: 38,
      borderRadius: 9,
      backgroundColor: c.surfaceSolid,
      alignItems: "center",
      justifyContent: "center",
    },
    copy: { flex: 1 },
    itemHead: { flexDirection: "row", alignItems: "center", gap: 7 },
    itemTitle: { color: c.text, fontSize: 12, fontWeight: "800" },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent },
    itemText: { color: c.textSoft, fontSize: 10, lineHeight: 15, marginTop: 4 },
    time: { color: c.textFaint, fontSize: 8, marginTop: 5 },
    more: {
      paddingHorizontal: 9,
      paddingVertical: 7,
      borderRadius: 6,
      backgroundColor: c.surfaceSoft,
    },
    moreText: { color: c.accent, fontSize: 8, fontWeight: "800" },
  });
