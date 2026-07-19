import { Delete, Eye, EyeOff, Undo2 } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import type { AppPalette } from "../../../theme/tokens";
import { SpeakButton } from "./SpeakButton";

type Point = { x: number; y: number };
type Stroke = Point[];
type Mode = "trace" | "copy" | "blank";
const CELLS = 6;

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
  const [mode, setMode] = useState<Mode>("trace");
  const [cell, setCell] = useState(0);
  const [strokesByCell, setStrokesByCell] = useState<Stroke[][]>(
    Array.from({ length: CELLS }, () => []),
  );
  const activeStroke = useRef<Stroke>([]);
  const [, redraw] = useState(0);
  const s = css(colors);
  const clear = () => setStrokesByCell(Array.from({ length: CELLS }, () => []));
  const setCharacter = (value: string) => {
    onChangeCharacter(value);
    setCell(0);
    clear();
  };
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          activeStroke.current = [{ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }];
          redraw((value) => value + 1);
        },
        onPanResponderMove: (event) => {
          activeStroke.current.push({ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY });
          redraw((value) => value + 1);
        },
        onPanResponderRelease: () => {
          if (activeStroke.current.length > 1) {
            const completedStroke = [...activeStroke.current];
            setStrokesByCell((current) =>
              current.map((strokes, index) =>
                index === cell ? [...strokes, completedStroke] : strokes,
              ),
            );
          }
          activeStroke.current = [];
          redraw((value) => value + 1);
        },
      }),
    [cell],
  );
  const visibleStrokes = activeStroke.current.length
    ? [...strokesByCell[cell], activeStroke.current]
    : strokesByCell[cell];
  return (
    <View style={s.wrap}>
      <View style={s.toolbar}>
        <View style={s.heading}>
          <Text style={s.title}>Тетрадь для прописи</Text>
          <Text style={s.subtitle}>Выбери знак, обведи образец, затем напиши сам</Text>
        </View>
        <View style={s.actions}>
          <SpeakButton colors={colors} text={character} />
          <Pressable style={s.tool} onPress={() => setStrokesByCell((current) => current.map((strokes, index) => index === cell ? strokes.slice(0, -1) : strokes))}>
            <Undo2 size={15} color={colors.textSoft} />
          </Pressable>
          <Pressable style={s.tool} onPress={clear}>
            <Delete size={15} color={colors.red} />
          </Pressable>
        </View>
      </View>
      <View style={s.characters}>
        {Array.from(new Set(choices)).slice(0, 12).map((item) => (
          <Pressable key={item} style={[s.characterChoice, item === character && s.characterOn]} onPress={() => setCharacter(item)}>
            <Text style={[s.characterText, item === character && s.characterTextOn]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={s.modeRow}>
        {(["trace", "copy", "blank"] as Mode[]).map((item) => {
          const label = item === "trace" ? "Обводка" : item === "copy" ? "Образец" : "Чистый лист";
          const Icon = item === "blank" ? EyeOff : Eye;
          return <Pressable key={item} onPress={() => setMode(item)} style={[s.mode, mode === item && s.modeOn]}><Icon size={13} color={mode === item ? colors.accent : colors.textFaint} /><Text style={[s.modeText, mode === item && s.modeTextOn]}>{label}</Text></Pressable>;
        })}
      </View>
      <View style={s.notebook}>
        <View style={s.marginLine} />
        <View style={s.grid}>
          {Array.from({ length: CELLS }, (_, index) => (
            <Pressable key={index} onPress={() => setCell(index)} style={[s.cell, index === cell && s.cellActive]}>
              {(mode === "trace" || (mode === "copy" && index === 0)) && <Text style={s.ghost}>{character}</Text>}
              <View style={s.horizontal} /><View style={s.vertical} /><View style={s.diagonalA} /><View style={s.diagonalB} />
              {index === cell && <View style={StyleSheet.absoluteFill} {...responder.panHandlers}><Svg style={StyleSheet.absoluteFill} width="100%" height="100%">{visibleStrokes.map((points, strokeIndex) => <Path key={strokeIndex} d={toPath(points)} fill="none" stroke={colors.mode === "dark" ? "#ECF8FF" : "#173A63"} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />)}</Svg></View>}
            </Pressable>
          ))}
        </View>
      </View>
      <View style={s.footer}><Text style={s.hint}>Клетка {cell + 1} из {CELLS} · после каждого варианта выбери следующую</Text><Text style={s.tip}>Лучше медленно и ровно, чем быстро</Text></View>
    </View>
  );
}

const toPath = (points: Point[]) => points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
const css = (c: AppPalette) => StyleSheet.create({
  wrap: { gap: 12 }, toolbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, heading: { flex: 1 }, title: { color: c.text, fontSize: 15, fontWeight: "800" }, subtitle: { color: c.textFaint, fontSize: 9, marginTop: 3 }, actions: { flexDirection: "row", gap: 6 }, tool: { width: 30, height: 30, borderRadius: 7, borderWidth: 1, borderColor: c.border, backgroundColor: c.surfaceSolid, alignItems: "center", justifyContent: "center" }, characters: { flexDirection: "row", gap: 6, flexWrap: "wrap" }, characterChoice: { width: 37, height: 37, borderRadius: 7, borderWidth: 1, borderColor: c.border, backgroundColor: c.surfaceSoft, alignItems: "center", justifyContent: "center" }, characterOn: { backgroundColor: c.accent, borderColor: c.accent }, characterText: { color: c.text, fontSize: 20, fontWeight: "600" }, characterTextOn: { color: "#03101F" }, modeRow: { flexDirection: "row", gap: 6 }, mode: { height: 31, paddingHorizontal: 9, borderRadius: 7, flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: c.border, backgroundColor: c.surfaceSoft }, modeOn: { borderColor: c.accent, backgroundColor: c.accentSoft }, modeText: { color: c.textFaint, fontSize: 8, fontWeight: "800" }, modeTextOn: { color: c.accent }, notebook: { borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,104,120,.38)", overflow: "hidden", padding: 11, paddingLeft: 23, backgroundColor: c.mode === "dark" ? "rgba(239,246,255,.07)" : "rgba(255,255,255,.76)", position: "relative" }, marginLine: { position: "absolute", left: 15, top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,104,120,.42)" }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 9 }, cell: { width: "31.9%", aspectRatio: 1, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,104,120,.3)", backgroundColor: "rgba(255,255,255,.02)", position: "relative" }, cellActive: { borderColor: c.accent, borderWidth: 2 }, ghost: { position: "absolute", alignSelf: "center", top: "4%", color: c.text, fontSize: 72, lineHeight: 91, fontWeight: "500", opacity: 0.11, userSelect: "none" } as any, horizontal: { position: "absolute", top: "50%", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,104,120,.27)", borderStyle: "dashed" }, vertical: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,104,120,.27)", borderStyle: "dashed" }, diagonalA: { position: "absolute", height: 1, width: "142%", left: "-21%", top: "50%", transform: [{ rotate: "45deg" }], backgroundColor: "rgba(255,104,120,.17)", borderStyle: "dashed" }, diagonalB: { position: "absolute", height: 1, width: "142%", left: "-21%", top: "50%", transform: [{ rotate: "-45deg" }], backgroundColor: "rgba(255,104,120,.17)", borderStyle: "dashed" }, footer: { flexDirection: "row", justifyContent: "space-between", gap: 12 }, hint: { flex: 1, color: c.textFaint, fontSize: 8 }, tip: { color: c.accent, fontSize: 8, fontWeight: "700" },
});
