import { Delete, RotateCcw, Undo2 } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import type { AppPalette } from "../../../theme/tokens";

type Point = { x: number; y: number };
export function PracticeNotebook({
  colors,
  character,
  onChangeCharacter,
  choices,
}: {
  colors: AppPalette;
  character: string;
  onChangeCharacter: (value: string) => void;
  choices: string[];
}) {
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const activeStroke = useRef<Point[]>([]);
  const [, redraw] = useState(0);
  const s = css(colors);
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          activeStroke.current = [
            { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY },
          ];
          redraw((v) => v + 1);
        },
        onPanResponderMove: (event) => {
          activeStroke.current.push({
            x: event.nativeEvent.locationX,
            y: event.nativeEvent.locationY,
          });
          redraw((v) => v + 1);
        },
        onPanResponderRelease: () => {
          if (activeStroke.current.length > 1)
            setStrokes((current) => [...current, activeStroke.current]);
          activeStroke.current = [];
          redraw((v) => v + 1);
        },
      }),
    [],
  );
  const allStrokes = activeStroke.current.length
    ? [...strokes, activeStroke.current]
    : strokes;
  const toPath = (points: Point[]) =>
    points
      .map(
        (point, index) =>
          `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
      )
      .join(" ");
  return (
    <View style={s.wrap}>
      <View style={s.toolbar}>
        <View>
          <Text style={s.title}>Тетрадь 米字格</Text>
          <Text style={s.subtitle}>Повтори форму и порядок штрихов</Text>
        </View>
        <View style={s.actions}>
          <Pressable
            style={s.tool}
            onPress={() => setStrokes((current) => current.slice(0, -1))}
          >
            <Undo2 size={15} color={colors.textSoft} />
            <Text style={s.toolText}>Штрих</Text>
          </Pressable>
          <Pressable style={s.tool} onPress={() => setStrokes([])}>
            <Delete size={15} color={colors.red} />
            <Text style={s.toolText}>Очистить</Text>
          </Pressable>
        </View>
      </View>
      <View style={s.characters}>
        {choices.slice(0, 10).map((item) => (
          <Pressable
            key={item}
            style={[s.characterChoice, item === character && s.characterOn]}
            onPress={() => {
              onChangeCharacter(item);
              setStrokes([]);
            }}
          >
            <Text
              style={[s.characterText, item === character && s.characterTextOn]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={s.paper} {...responder.panHandlers}>
        <Text style={s.ghost}>{character}</Text>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke={colors.red}
            strokeOpacity=".28"
            strokeDasharray="5 5"
          />
          <Line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={colors.red}
            strokeOpacity=".28"
            strokeDasharray="5 5"
          />
          <Line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke={colors.red}
            strokeOpacity=".18"
            strokeDasharray="4 6"
          />
          <Line
            x1="100%"
            y1="0"
            x2="0"
            y2="100%"
            stroke={colors.red}
            strokeOpacity=".18"
            strokeDasharray="4 6"
          />
          {allStrokes.map((points, index) => (
            <Path
              key={index}
              d={toPath(points)}
              fill="none"
              stroke={colors.mode === "dark" ? "#DFF3FF" : "#12345A"}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>
      <View style={s.paperFooter}>
        <Text style={s.hint}>Пиши пальцем или мышью поверх серого образца</Text>
        <Pressable style={s.reset} onPress={() => setStrokes([])}>
          <RotateCcw size={13} color={colors.accent} />
          <Text style={s.resetText}>Начать заново</Text>
        </Pressable>
      </View>
    </View>
  );
}
const css = (c: AppPalette) =>
  StyleSheet.create({
    wrap: { gap: 12 },
    toolbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: { color: c.text, fontSize: 14, fontWeight: "800" },
    subtitle: { color: c.textFaint, fontSize: 9, marginTop: 3 },
    actions: { flexDirection: "row", gap: 6 },
    tool: {
      height: 32,
      paddingHorizontal: 9,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    toolText: { color: c.textSoft, fontSize: 8, fontWeight: "700" },
    characters: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
    characterChoice: {
      width: 38,
      height: 38,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    characterOn: { backgroundColor: c.accent, borderColor: c.accent },
    characterText: { color: c.text, fontSize: 20, fontWeight: "600" },
    characterTextOn: { color: "#03101F" },
    paper: {
      height: 390,
      position: "relative",
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "rgba(255,104,120,.42)",
      borderRadius: 4,
      backgroundColor:
        c.mode === "dark" ? "rgba(236,245,255,.08)" : "rgba(255,255,255,.78)",
    },
    ghost: {
      position: "absolute",
      alignSelf: "center",
      top: 35,
      color: c.text,
      fontSize: 260,
      lineHeight: 310,
      fontWeight: "500",
      opacity: 0.1,
      userSelect: "none",
    } as any,
    paperFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    hint: { color: c.textFaint, fontSize: 8 },
    reset: { flexDirection: "row", alignItems: "center", gap: 5 },
    resetText: { color: c.accent, fontSize: 8, fontWeight: "800" },
  });
