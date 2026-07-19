import {
  CalendarClock,
  Check,
  CircleDollarSign,
  Plus,
} from "lucide-react-native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/ui/Button";
import { DateTimePickerField } from "../components/ui/DateTimePickerField";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { Surface } from "../components/ui/Surface";
import { TextField } from "../components/ui/TextField";
import type { AppPalette } from "../theme/tokens";
import type { MoneyType, PlannedItem } from "../types/domain";
import { isPaidTuitionPlan } from "../utils/finance";
import { formatRange, formatRub } from "../utils/format";
type Props = {
  colors: AppPalette;
  plannedItems: PlannedItem[];
  title: string;
  amount: string;
  due: string;
  type: MoneyType;
  onChangeTitle: (v: string) => void;
  onChangeAmount: (v: string) => void;
  onChangeDue: (v: string) => void;
  onChangeType: (v: MoneyType) => void;
  onAddPlannedItem: () => void;
  onMarkPlannedItemPaid: (id: string) => void;
};
export function PlanningPage(p: Props) {
  const s = css(p.colors);
  const plannedItems = p.plannedItems.filter((item) => !isPaidTuitionPlan(item));
  const active = plannedItems.filter((x) => x.status === "planned");
  const paid = plannedItems.filter((x) => x.status === "paid");
  const total = active.reduce((a, x) => a + x.amountMax, 0);
  const add = () => {
    if (!p.title.trim() || Number(p.amount.replace(",", ".")) <= 0)
      return Alert.alert("Проверь план", "Укажи название и сумму.");
    p.onAddPlannedItem();
  };
  return (
    <View style={s.page}>
      <View style={s.head}>
        <View>
          <Text style={s.kicker}>CASHFLOW PLANNER</Text>
          <Text style={s.title}>Планирование</Text>
          <Text style={s.sub}>Будущие платежи, доходы и обязательства.</Text>
        </View>
        <Button
          colors={p.colors}
          label="Добавить в план"
          icon={<Plus size={15} color="#03101F" />}
          onPress={add}
        />
      </View>
      <View style={s.stats}>
        <Stat c={p.colors} label="Активные планы" value={`${active.length}`} />
        <Stat c={p.colors} label="Плановая нагрузка" value={formatRub(total)} />
        <Stat c={p.colors} label="Закрыто" value={`${paid.length}`} />
      </View>
      <View style={s.grid}>
        <Surface colors={p.colors} style={s.timeline}>
          <View style={s.panelHead}>
            <View>
              <Text style={s.panelTitle}>Платежный timeline</Text>
              <Text style={s.panelSub}>
                Нажми «Оплачено», чтобы перенести сумму в факт
              </Text>
            </View>
            <CalendarClock size={19} color={p.colors.accent} />
          </View>
          {plannedItems.map((x, i) => (
            <View key={x.id} style={s.item}>
              <View
                style={[
                  s.line,
                  i === plannedItems.length - 1 && { opacity: 0 },
                ]}
              />
              <View style={[s.dot, x.status === "paid" && s.dotDone]}>
                {x.status === "paid" && <Check size={11} color="#fff" />}
              </View>
              <View style={s.copy}>
                <Text style={s.itemTitle}>{x.title}</Text>
                <Text style={s.meta}>
                  {x.due} · {x.category}
                </Text>
              </View>
              <Text
                style={[
                  s.amount,
                  x.type === "income" && { color: p.colors.green },
                ]}
              >
                {x.type === "income" ? "+" : "−"}
                {formatRange(x.amountMin, x.amountMax)}
              </Text>
              {x.status === "planned" ? (
                <Pressable
                  style={s.paid}
                  onPress={() => p.onMarkPlannedItemPaid(x.id)}
                >
                  <Text style={s.paidText}>Оплачено</Text>
                </Pressable>
              ) : (
                <Text style={s.done}>ГОТОВО</Text>
              )}
            </View>
          ))}
        </Surface>
        <Surface colors={p.colors} style={s.form}>
          <View style={s.formIcon}>
            <CircleDollarSign size={19} color={p.colors.accent} />
          </View>
          <Text style={s.panelTitle}>Новый план</Text>
          <Text style={s.panelSub}>Добавь будущий доход или расход</Text>
          <TextField
            colors={p.colors}
            value={p.title}
            onChangeText={p.onChangeTitle}
            placeholder="Название"
          />
          <TextField
            colors={p.colors}
            value={p.amount}
            onChangeText={p.onChangeAmount}
            placeholder="Сумма, ₽"
            keyboardType="decimal-pad"
          />
          <DateTimePickerField
            colors={p.colors}
            label="Дата платежа"
            date={p.due}
            onChangeDate={p.onChangeDue}
            showTime={false}
          />
          <SegmentedControl
            colors={p.colors}
            value={p.type}
            onChange={p.onChangeType}
            options={[
              { label: "Доход", value: "income" },
              { label: "Расход", value: "expense" },
            ]}
          />
          <Button colors={p.colors} label="Сохранить план" onPress={add} />
        </Surface>
      </View>
      <CalendarMonth colors={p.colors} items={plannedItems} />
    </View>
  );
}
function CalendarMonth({
  colors,
  items,
}: {
  colors: AppPalette;
  items: PlannedItem[];
}) {
  const s = css(colors);
  const markedDays = [5, 11, 15, 20, 24, 29];
  return (
    <Surface colors={colors} style={s.calendar}>
      <View style={s.calendarHead}>
        <View>
          <Text style={s.panelTitle}>Календарь платежей</Text>
          <Text style={s.panelSub}>
            Июль 2026 ·{" "}
            {items.filter((item) => item.status === "planned").length} активных
            событий
          </Text>
        </View>
        <View style={s.legend}>
          <View style={[s.legendDot, { backgroundColor: colors.red }]} />
          <Text style={s.legendText}>расход</Text>
          <View style={[s.legendDot, { backgroundColor: colors.green }]} />
          <Text style={s.legendText}>доход</Text>
        </View>
      </View>
      <View style={s.weekRow}>
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
          <Text key={day} style={s.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <View style={s.monthGrid}>
        {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
          <View key={day} style={[s.monthDay, day === 11 && s.today]}>
            <Text
              style={[s.monthDayText, day === 11 && { color: colors.accent }]}
            >
              {day}
            </Text>
            {markedDays.includes(day) && (
              <View style={s.events}>
                <View
                  style={[
                    s.event,
                    { backgroundColor: day === 24 ? colors.green : colors.red },
                  ]}
                />
                {day === 15 && (
                  <View style={[s.event, { backgroundColor: colors.amber }]} />
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    </Surface>
  );
}
function Stat({
  c,
  label,
  value,
}: {
  c: AppPalette;
  label: string;
  value: string;
}) {
  const s = css(c);
  return (
    <Surface colors={c} style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </Surface>
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
    stats: { flexDirection: "row", gap: 10 },
    stat: { flex: 1, padding: 13 },
    statLabel: { color: c.textFaint, fontSize: 9 },
    statValue: { color: c.text, fontSize: 18, fontWeight: "800", marginTop: 5 },
    grid: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    timeline: { flex: 1, padding: 14 },
    form: { width: 340, padding: 14, gap: 9 },
    panelHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    panelTitle: { color: c.text, fontSize: 14, fontWeight: "800" },
    panelSub: { color: c.textFaint, fontSize: 9, marginTop: 3 },
    item: {
      position: "relative",
      minHeight: 64,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingLeft: 4,
    },
    line: {
      position: "absolute",
      left: 12,
      top: 42,
      bottom: -22,
      width: 1,
      backgroundColor: c.borderStrong,
    },
    dot: {
      zIndex: 2,
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 2,
      borderColor: c.accent,
      backgroundColor: c.surfaceSolid,
      alignItems: "center",
      justifyContent: "center",
    },
    dotDone: { backgroundColor: c.green, borderColor: c.green },
    copy: { flex: 1 },
    itemTitle: { color: c.text, fontSize: 11, fontWeight: "700" },
    meta: { color: c.textFaint, fontSize: 9, marginTop: 3 },
    amount: {
      width: 125,
      textAlign: "right",
      color: c.red,
      fontSize: 10,
      fontWeight: "800",
    },
    paid: {
      height: 28,
      paddingHorizontal: 9,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accentSoft,
    },
    paidText: { color: c.accent, fontSize: 9, fontWeight: "800" },
    done: {
      width: 70,
      textAlign: "right",
      color: c.green,
      fontSize: 8,
      fontWeight: "900",
    },
    formIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accentSoft,
    },
    calendar: { padding: 14 },
    calendarHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    legend: { flexDirection: "row", alignItems: "center", gap: 6 },
    legendDot: { width: 6, height: 6, borderRadius: 3 },
    legendText: { color: c.textFaint, fontSize: 8, marginRight: 6 },
    weekRow: { flexDirection: "row" },
    weekDay: {
      width: "14.285%",
      color: c.textFaint,
      textAlign: "center",
      fontSize: 8,
      fontWeight: "800",
      paddingVertical: 6,
    },
    monthGrid: { flexDirection: "row", flexWrap: "wrap" },
    monthDay: {
      width: "14.285%",
      height: 44,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderColor: c.border,
      padding: 6,
    },
    today: { backgroundColor: c.accentSoft },
    monthDayText: { color: c.textSoft, fontSize: 9, fontWeight: "700" },
    events: { flexDirection: "row", gap: 3, marginTop: 8 },
    event: { width: 18, height: 3, borderRadius: 2 },
  });
