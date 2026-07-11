import {
  CalendarDays,
  MapPin,
  Plane,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Surface } from "../components/ui/Surface";
import type { AppPalette } from "../theme/tokens";
import type { Profile } from "../types/domain";
export function ProfilePage({
  colors: c,
  profile: p,
}: {
  colors: AppPalette;
  profile: Profile;
}) {
  const s = css(c);
  const rows = [
    {
      icon: <UserRound size={18} color={c.accent} />,
      label: "Имя",
      value: p.name,
    },
    {
      icon: <MapPin size={18} color={c.blue} />,
      label: "Направление",
      value: p.destination,
    },
    {
      icon: <Plane size={18} color={c.green} />,
      label: "Программа",
      value: p.program,
    },
    {
      icon: <CalendarDays size={18} color={c.amber} />,
      label: "Дата старта",
      value: p.startDate,
    },
  ];
  return (
    <View style={s.page}>
      <View>
        <Text style={s.kicker}>PERSONAL SPACE</Text>
        <Text style={s.title}>Профиль</Text>
        <Text style={s.sub}>Личные данные и параметры переезда.</Text>
      </View>
      <View style={s.grid}>
        <Surface colors={c} style={s.identity}>
          <View style={s.avatar}>
            <Text style={s.initials}>БФ</Text>
          </View>
          <Text style={s.name}>{p.name}</Text>
          <Text style={s.place}>{p.destination}</Text>
          <View style={s.verified}>
            <ShieldCheck size={13} color={c.green} />
            <Text style={s.verifiedText}>Профиль защищен PIN-кодом</Text>
          </View>
          <View style={s.progress}>
            <View style={s.progressFill} />
          </View>
          <Text style={s.progressText}>Профиль заполнен на 82%</Text>
        </Surface>
        <Surface colors={c} style={s.details}>
          <Text style={s.panelTitle}>Основная информация</Text>
          {rows.map((x) => (
            <View key={x.label} style={s.row}>
              <View style={s.icon}>{x.icon}</View>
              <View>
                <Text style={s.label}>{x.label}</Text>
                <Text style={s.value}>{x.value}</Text>
              </View>
            </View>
          ))}
        </Surface>
        <Surface colors={c} style={s.trip}>
          <Text style={s.panelTitle}>Переезд</Text>
          <Text style={s.tripNumber}>52</Text>
          <Text style={s.tripLabel}>дня до начала программы</Text>
          <View style={s.tripLine} />
          <Text style={s.tripMeta}>Чэнду · языковой год · 2026</Text>
        </Surface>
      </View>
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
    identity: { width: 280, padding: 20, alignItems: "center" },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    initials: { color: "#03101F", fontSize: 20, fontWeight: "900" },
    name: { color: c.text, fontSize: 17, fontWeight: "800", marginTop: 12 },
    place: { color: c.textFaint, fontSize: 10, marginTop: 4 },
    verified: {
      marginTop: 16,
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
    },
    verifiedText: { color: c.green, fontSize: 9, fontWeight: "700" },
    progress: {
      alignSelf: "stretch",
      height: 5,
      borderRadius: 3,
      backgroundColor: c.surfaceSolid,
      marginTop: "auto",
      overflow: "hidden",
    },
    progressFill: { width: "82%", height: "100%", backgroundColor: c.accent },
    progressText: { color: c.textFaint, fontSize: 8, marginTop: 7 },
    details: { flex: 1, padding: 16 },
    panelTitle: {
      color: c.text,
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 8,
    },
    row: {
      minHeight: 67,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    icon: {
      width: 35,
      height: 35,
      borderRadius: 8,
      backgroundColor: c.surfaceSolid,
      alignItems: "center",
      justifyContent: "center",
    },
    label: { color: c.textFaint, fontSize: 8 },
    value: { color: c.text, fontSize: 11, fontWeight: "700", marginTop: 3 },
    trip: { width: 270, padding: 18 },
    tripNumber: {
      color: c.accent,
      fontSize: 52,
      fontWeight: "800",
      marginTop: 20,
    },
    tripLabel: { color: c.textSoft, fontSize: 10 },
    tripLine: {
      height: 1,
      backgroundColor: c.border,
      marginTop: "auto",
      marginBottom: 12,
    },
    tripMeta: { color: c.textFaint, fontSize: 9 },
  });
