import { ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { Surface } from "../../../components/ui/Surface";
import type { AppPalette } from "../../../theme/tokens";
import { formatRub } from "../../../utils/format";

type Point = { label: string; value: number };
type LineChartProps = {
  colors: AppPalette;
  title: string;
  data: Point[];
};

export function LineChart({ colors, title, data }: LineChartProps) {
  const [selectedIndex, setSelectedIndex] = useState(Math.max(data.length - 1, 0));
  const styles = createStyles(colors);
  const width = 720;
  const height = 230;
  const paddingX = 34;
  const paddingY = 28;

  useEffect(() => {
    setSelectedIndex((current) => Math.min(current, Math.max(data.length - 1, 0)));
  }, [data.length]);

  const chart = useMemo(() => {
    const values = data.map((item) => item.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const spread = Math.max(max - min, 1);
    const points = data.map((item, index) => ({
      ...item,
      x: paddingX + (index / Math.max(data.length - 1, 1)) * (width - paddingX * 2),
      y: paddingY + (1 - (item.value - min) / spread) * (height - paddingY * 2),
    }));
    const line = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
    const area = points.length
      ? `${line} L ${points.at(-1)?.x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : "";
    return { points, line, area, min, max };
  }, [data]);

  const selected = chart.points[selectedIndex];
  const step = (direction: number) =>
    setSelectedIndex((current) => Math.max(0, Math.min(data.length - 1, current + direction)));

  return (
    <Surface colors={colors} style={styles.card}>
      <View style={styles.head}>
        <View>
          <Text style={styles.eyebrow}>ИНТЕРАКТИВНЫЙ ПРОГНОЗ</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.selectionBox}>
          <View>
            <Text style={styles.selectedLabel}>{selected?.label || "Нет данных"}</Text>
            <Text style={styles.value}>{formatRub(selected?.value || 0)}</Text>
          </View>
          <View style={styles.stepper}>
            <Pressable accessibilityLabel="Предыдущая точка" style={styles.stepButton} onPress={() => step(-1)}>
              <ChevronLeft size={14} color={colors.textSoft} />
            </Pressable>
            <Pressable accessibilityLabel="Следующая точка" style={styles.stepButton} onPress={() => step(1)}>
              <ChevronRight size={14} color={colors.textSoft} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.chartWrap}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="cashflowArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.accent} stopOpacity="0.32" />
              <Stop offset="1" stopColor={colors.accent} stopOpacity="0.01" />
            </LinearGradient>
          </Defs>
          {[0, 1, 2, 3].map((row) => {
            const y = paddingY + (row / 3) * (height - paddingY * 2);
            return <Line key={row} x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke={colors.border} strokeWidth="1" />;
          })}
          {!!chart.area && <Path d={chart.area} fill="url(#cashflowArea)" />}
          {!!chart.line && <Path d={chart.line} fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
          {selected && (
            <G>
              <Line x1={selected.x} x2={selected.x} y1={paddingY - 4} y2={height - paddingY} stroke={colors.borderStrong} strokeWidth="1" strokeDasharray="4 5" />
              <Circle cx={selected.x} cy={selected.y} r="9" fill={colors.accentSoft} />
              <Circle cx={selected.x} cy={selected.y} r="4" fill={colors.accent} stroke={colors.surfaceSolid} strokeWidth="2" />
            </G>
          )}
          {chart.points.map((point, index) => {
            const segmentWidth = (width - paddingX * 2) / Math.max(data.length, 1);
            return (
              <Rect
                key={`${point.label}-${index}`}
                x={Math.max(paddingX, point.x - segmentWidth / 2)}
                y="0"
                width={segmentWidth}
                height={height}
                fill="transparent"
                onPress={() => setSelectedIndex(index)}
              />
            );
          })}
        </Svg>
        <View style={styles.chartHint}>
          <MousePointer2 size={11} color={colors.textFaint} />
          <Text style={styles.chartHintText}>Нажми на участок графика</Text>
        </View>
      </View>

      <View style={styles.labels}>
        {chart.points.map((point, index) => (
          <Pressable key={`${point.label}-label`} style={[styles.labelItem, selectedIndex === index && styles.labelItemOn]} onPress={() => setSelectedIndex(index)}>
            <Text style={[styles.label, selectedIndex === index && styles.labelOn]} numberOfLines={1}>{point.label}</Text>
            <Text style={styles.labelValue} numberOfLines={1}>{formatRub(point.value)}</Text>
          </Pressable>
        ))}
      </View>
    </Surface>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    card: { padding: 16, gap: 12, minHeight: 390 },
    head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
    eyebrow: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
    title: { color: colors.text, fontWeight: "900", fontSize: 14, marginTop: 4 },
    selectionBox: { minWidth: 182, minHeight: 50, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft },
    selectedLabel: { color: colors.textFaint, fontSize: 8, fontWeight: "800" },
    value: { color: colors.text, fontWeight: "900", fontSize: 13, marginTop: 2 },
    stepper: { flexDirection: "row", gap: 4 },
    stepButton: { width: 26, height: 26, borderRadius: 6, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSolid },
    chartWrap: { position: "relative", borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft, overflow: "hidden" },
    chartHint: { position: "absolute", top: 9, left: 11, flexDirection: "row", alignItems: "center", gap: 5 },
    chartHintText: { color: colors.textFaint, fontSize: 7, fontWeight: "700" },
    labels: { flexDirection: "row", gap: 5 },
    labelItem: { flex: 1, minWidth: 0, minHeight: 40, paddingHorizontal: 7, paddingVertical: 6, borderRadius: 7, borderWidth: 1, borderColor: "transparent" },
    labelItemOn: { backgroundColor: colors.accentSoft, borderColor: colors.border },
    label: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
    labelOn: { color: colors.text },
    labelValue: { color: colors.textSoft, fontSize: 8, fontWeight: "800", marginTop: 3 },
  });
