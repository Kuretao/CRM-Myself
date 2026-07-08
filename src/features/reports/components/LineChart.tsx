import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { Surface } from '../../../components/ui/Surface';
import type { AppPalette } from '../../../theme/tokens';
import { formatRub } from '../../../utils/format';

type LineChartProps = {
  colors: AppPalette;
  title: string;
  data: { label: string; value: number }[];
};

export function LineChart({ colors, title, data }: LineChartProps) {
  const styles = createStyles(colors);
  const width = 320;
  const height = 150;
  const padding = 18;
  const max = Math.max(...data.map((item) => item.value), 1);
  const min = Math.min(...data.map((item) => item.value), 0);
  const range = Math.max(max - min, 1);
  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = padding + (1 - (item.value - min) / range) * (height - padding * 2);
    return { x, y, ...item };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <Surface colors={colors} style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{formatRub(data[data.length - 1]?.value || 0)}</Text>
      </View>
      <View style={styles.chartWrap}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Polyline
            points={polyline}
            fill="none"
            stroke={colors.accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point) => (
            <Circle key={point.label} cx={point.x} cy={point.y} r="5" fill={colors.bg} stroke={colors.accent} strokeWidth="3" />
          ))}
        </Svg>
      </View>
      <View style={styles.labels}>
        {points.map((point) => (
          <View key={point.label} style={styles.labelItem}>
            <Text style={styles.label}>{point.label}</Text>
            <Text style={styles.labelValue}>{formatRub(point.value)}</Text>
          </View>
        ))}
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
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    title: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 16,
    },
    value: {
      color: colors.green,
      fontWeight: '900',
      fontSize: 14,
    },
    chartWrap: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      overflow: 'hidden',
    },
    labels: {
      flexDirection: 'row',
      gap: 8,
    },
    labelItem: {
      flex: 1,
    },
    label: {
      color: colors.textFaint,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    labelValue: {
      color: colors.textSoft,
      fontSize: 11,
      fontWeight: '800',
      marginTop: 2,
    },
  });
