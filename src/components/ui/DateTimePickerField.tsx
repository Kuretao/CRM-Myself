import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AppPalette } from "../../theme/tokens";

const times = [
  "08:00",
  "09:30",
  "11:00",
  "13:00",
  "15:00",
  "17:00",
  "19:00",
  "21:00",
];
const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const parseDate = (value: string) => {
  const match = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  return match
    ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
    : new Date();
};
const formatDate = (value: Date) =>
  `${String(value.getDate()).padStart(2, "0")}.${String(value.getMonth() + 1).padStart(2, "0")}.${value.getFullYear()}`;
export function DateTimePickerField({
  colors,
  label,
  date,
  time,
  onChangeDate,
  onChangeTime,
  showTime = true,
}: {
  colors: AppPalette;
  label: string;
  date: string;
  time?: string;
  onChangeDate: (value: string) => void;
  onChangeTime?: (value: string) => void;
  showTime?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const initial = parseDate(date);
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const s = createStyles(colors);
  const selected = parseDate(date);
  const daysCount = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const leadingDays = (visibleMonth.getDay() + 6) % 7;
  const shiftMonth = (offset: number) =>
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1),
    );
  const chooseQuickDate = (offset: number) => {
    const value = new Date();
    value.setDate(value.getDate() + offset);
    onChangeDate(formatDate(value));
    setVisibleMonth(new Date(value.getFullYear(), value.getMonth(), 1));
  };
  return (
    <View style={s.wrap}>
      <Pressable style={s.trigger} onPress={() => setOpen((v) => !v)}>
        <CalendarDays size={15} color={colors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={s.label}>{label}</Text>
          <Text style={s.value}>
            {date || "Выбрать дату"}
            {showTime && time ? ` · ${time}` : ""}
          </Text>
        </View>
        <ChevronRight size={14} color={colors.textFaint} />
      </Pressable>
      {open && (
        <View style={s.panel}>
          <View style={s.monthHead}>
            <Pressable style={s.icon} onPress={() => shiftMonth(-1)}>
              <ChevronLeft size={14} color={colors.textFaint} />
            </Pressable>
            <Text style={s.month}>
              {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
            </Text>
            <Pressable style={s.icon} onPress={() => shiftMonth(1)}>
              <ChevronRight size={14} color={colors.textFaint} />
            </Pressable>
          </View>
          <View style={s.week}>
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((x) => (
              <Text key={x} style={s.weekday}>
                {x}
              </Text>
            ))}
          </View>
          <View style={s.days}>
            {Array.from({ length: leadingDays }, (_, index) => (
              <View key={`empty-${index}`} style={s.day} />
            ))}
            {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => {
              const active =
                selected.getDate() === day &&
                selected.getMonth() === visibleMonth.getMonth() &&
                selected.getFullYear() === visibleMonth.getFullYear();
              return (
                <Pressable
                  key={day}
                  style={[s.day, active && s.dayOn]}
                  onPress={() =>
                    onChangeDate(
                      formatDate(
                        new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth(),
                          day,
                        ),
                      ),
                    )
                  }
                >
                  <Text style={[s.dayText, active && s.dayTextOn]}>{day}</Text>
                  {active && <Check size={8} color="#03101F" />}
                </Pressable>
              );
            })}
          </View>
          {showTime && onChangeTime && (
            <>
              <View style={s.section}>
                <Clock3 size={13} color={colors.accent} />
                <Text style={s.sectionText}>Время</Text>
              </View>
              <View style={s.times}>
                {times.map((slot) => (
                  <Pressable
                    key={slot}
                    style={[s.time, time === slot && s.timeOn]}
                    onPress={() => onChangeTime(slot)}
                  >
                    <Text style={[s.timeText, time === slot && s.timeTextOn]}>
                      {slot}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
          <View style={s.quick}>
            <Pressable onPress={() => chooseQuickDate(0)}>
              <Text style={s.quickText}>Сегодня</Text>
            </Pressable>
            <Pressable onPress={() => chooseQuickDate(1)}>
              <Text style={s.quickText}>Завтра</Text>
            </Pressable>
            <Pressable style={s.ready} onPress={() => setOpen(false)}>
              <Text style={s.readyText}>Готово</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
const createStyles = (c: AppPalette) =>
  StyleSheet.create({
    wrap: { position: "relative", zIndex: 40, minWidth: 190 },
    trigger: {
      height: 46,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      paddingHorizontal: 11,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    label: { color: c.textFaint, fontSize: 8, fontWeight: "700" },
    value: { color: c.text, fontSize: 10, fontWeight: "700", marginTop: 3 },
    panel: {
      position: "absolute",
      top: 52,
      right: 0,
      width: 330,
      zIndex: 120,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.borderStrong,
      backgroundColor: c.mode === "dark" ? "#071326" : "#F7FAFF",
      shadowColor: "#000",
      shadowOpacity: 0.4,
      shadowRadius: 28,
    },
    monthHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    month: { color: c.text, fontSize: 12, fontWeight: "800" },
    icon: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    week: { flexDirection: "row", marginTop: 8 },
    weekday: {
      width: "14.285%",
      textAlign: "center",
      color: c.textFaint,
      fontSize: 8,
      fontWeight: "800",
    },
    days: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    day: {
      width: "14.285%",
      height: 31,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 2,
    },
    dayOn: { backgroundColor: c.accent },
    dayText: { color: c.textSoft, fontSize: 9, fontWeight: "700" },
    dayTextOn: { color: "#03101F" },
    section: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
    },
    sectionText: { color: c.text, fontSize: 10, fontWeight: "800" },
    times: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 7 },
    time: {
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: c.surfaceSoft,
    },
    timeOn: { backgroundColor: c.accent },
    timeText: { color: c.textSoft, fontSize: 8, fontWeight: "700" },
    timeTextOn: { color: "#03101F" },
    quick: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 12,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    quickText: { color: c.accent, fontSize: 9, fontWeight: "700" },
    ready: {
      marginLeft: "auto",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 6,
      backgroundColor: c.accent,
    },
    readyText: { color: "#03101F", fontSize: 9, fontWeight: "900" },
  });
