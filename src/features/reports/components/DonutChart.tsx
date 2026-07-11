import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import Svg, { Circle } from "react-native-svg";
import { Surface } from "../../../components/ui/Surface";
import type { AppPalette } from "../../../theme/tokens";

type DonutChartProps = {
  colors: AppPalette;
  title: string;
  data: { label: string; value: number }[];
};

const chartColors = ["accent", "green", "amber", "blue", "red"] as const;

export function DonutChart({ colors, title, data }: DonutChartProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const styles = createStyles(colors);
  const total = Math.max(
    data.reduce((sum, item) => sum + item.value, 0),
    1,
  );
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Surface colors={colors} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle
            cx="60"
            cy="60"
            r={radius}
            stroke={colors.surfaceSoft}
            strokeWidth="16"
            fill="none"
          />
          {data.map((item, index) => {
            const percent = item.value / total;
            const dash = `${circumference * percent} ${circumference}`;
            const currentOffset = offset;
            offset += circumference * percent;
            return (
              <Circle
                key={item.label}
                cx="60"
                cy="60"
                r={radius}
                stroke={colors[chartColors[index % chartColors.length]]}
                strokeWidth="16"
                fill="none"
                strokeDasharray={dash}
                strokeDashoffset={-currentOffset}
                strokeLinecap="round"
                rotation="-90"
                origin="60,60"
                onPress={() => setSelectedIndex(index)}
              />
            );
          })}
        </Svg>
        <View style={styles.center}>
          <Text style={styles.centerValue}>
            {Math.round(((data[selectedIndex]?.value || 0) / total) * 100)}%
          </Text>
          <Text style={styles.centerLabel} numberOfLines={1}>
            {data[selectedIndex]?.label || "—"}
          </Text>
        </View>
        <View style={styles.legend}>
          {data.map((item, index) => (
            <Pressable
              key={item.label}
              style={[
                styles.legendRow,
                selectedIndex === index && styles.legendRowOn,
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      colors[chartColors[index % chartColors.length]],
                  },
                ]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
              <Text style={styles.legendValue}>
                {Math.round((item.value / total) * 100)}%
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Surface>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    card: {
      padding: 14,
      gap: 12,
    },
    title: {
      color: colors.text,
      fontWeight: "900",
      fontSize: 16,
    },
    body: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    legend: {
      flex: 1,
      gap: 8,
    },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    legendRowOn: {
      backgroundColor: colors.accentSoft,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    center: {
      position: "absolute",
      left: 24,
      top: 39,
      width: 72,
      alignItems: "center",
    },
    centerValue: { color: colors.text, fontSize: 14, fontWeight: "900" },
    centerLabel: {
      color: colors.textFaint,
      fontSize: 7,
      maxWidth: 62,
      marginTop: 2,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      flex: 1,
      color: colors.textSoft,
      fontSize: 12,
      fontWeight: "800",
    },
    legendValue: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "900",
    },
  });
