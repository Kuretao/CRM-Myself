import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Surface } from "../../../components/ui/Surface";
import type { AppPalette } from "../../../theme/tokens";
import { formatRub } from "../../../utils/format";

type DonutChartProps = {
  colors: AppPalette;
  title: string;
  data: { label: string; value: number }[];
  valueMode?: "money" | "count";
};

const chartColors = ["accent", "green", "amber", "blue", "red"] as const;

export function DonutChart({ colors, title, data, valueMode = "money" }: DonutChartProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const styles = createStyles(colors);
  const total = Math.max(data.reduce((sum, item) => sum + item.value, 0), 1);
  const radius = 47;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  useEffect(() => {
    setSelectedIndex((current) => Math.min(current, Math.max(data.length - 1, 0)));
  }, [data.length]);

  const selected = data[selectedIndex];
  return (
    <Surface colors={colors} style={styles.card}>
      <View style={styles.head}>
        <View>
          <Text style={styles.eyebrow}>НАЖМИ НА СЕГМЕНТ</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.total}>{valueMode === "money" ? formatRub(total) : `${total}`}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.chart}>
          <Svg width={148} height={148} viewBox="0 0 148 148">
            <Circle cx="74" cy="74" r={radius} stroke={colors.surfaceSoft} strokeWidth="17" fill="none" />
            {data.map((item, index) => {
              const percent = item.value / total;
              const dash = `${Math.max(circumference * percent - 4, 0)} ${circumference}`;
              const currentOffset = offset;
              offset += circumference * percent;
              const tone = colors[chartColors[index % chartColors.length]];
              return (
                <Circle
                  key={`${item.label}-${index}`}
                  cx="74"
                  cy="74"
                  r={radius}
                  stroke={tone}
                  strokeWidth={selectedIndex === index ? "20" : "16"}
                  opacity={selectedIndex === index ? 1 : 0.56}
                  fill="none"
                  strokeDasharray={dash}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="74,74"
                  onPress={() => setSelectedIndex(index)}
                />
              );
            })}
          </Svg>
          <View style={styles.center} pointerEvents="none">
            <Text style={styles.centerValue}>{Math.round(((selected?.value || 0) / total) * 100)}%</Text>
            <Text style={styles.centerLabel} numberOfLines={1}>{selected?.label || "Нет данных"}</Text>
          </View>
        </View>
        <View style={styles.legend}>
          {data.map((item, index) => (
            <Pressable key={`${item.label}-legend`} style={[styles.legendRow, selectedIndex === index && styles.legendRowOn]} onPress={() => setSelectedIndex(index)}>
              <View style={[styles.dot, { backgroundColor: colors[chartColors[index % chartColors.length]] }]} />
              <View style={styles.legendCopy}>
                <Text style={styles.legendText} numberOfLines={1}>{item.label}</Text>
                <Text style={styles.legendAmount}>{valueMode === "money" ? formatRub(item.value) : `${item.value} шт.`}</Text>
              </View>
              <Text style={styles.legendValue}>{Math.round((item.value / total) * 100)}%</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Surface>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    card: { flex: 1, padding: 16, gap: 14, minHeight: 252 },
    head: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 8 },
    eyebrow: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
    title: { color: colors.text, fontWeight: "900", fontSize: 13, marginTop: 4 },
    total: { color: colors.textSoft, fontSize: 10, fontWeight: "900" },
    body: { flex: 1, flexDirection: "row", alignItems: "center", gap: 14 },
    chart: { width: 148, height: 148, position: "relative" },
    center: { position: "absolute", left: 33, top: 50, width: 82, alignItems: "center" },
    centerValue: { color: colors.text, fontSize: 17, fontWeight: "900" },
    centerLabel: { color: colors.textFaint, fontSize: 7, maxWidth: 72, marginTop: 3 },
    legend: { flex: 1, gap: 5 },
    legendRow: { minHeight: 38, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 7, borderWidth: 1, borderColor: "transparent" },
    legendRowOn: { backgroundColor: colors.surfaceSoft, borderColor: colors.border },
    dot: { width: 7, height: 7, borderRadius: 2 },
    legendCopy: { flex: 1, minWidth: 0 },
    legendText: { color: colors.text, fontSize: 9, fontWeight: "800" },
    legendAmount: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
    legendValue: { color: colors.textSoft, fontSize: 9, fontWeight: "900" },
  });
