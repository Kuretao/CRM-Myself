import { Check, RotateCcw, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import type { AppPalette } from "../../../theme/tokens";
import type { VocabularyItem } from "../types";

type Direction = "zh-ru" | "ru-zh";

export function StudySession({
  colors,
  words,
  mastered,
  onResult,
}: {
  colors: AppPalette;
  words: VocabularyItem[];
  mastered: string[];
  onResult: (id: string, knew: boolean) => void;
}) {
  const compact = useWindowDimensions().width < 760;
  const s = css(colors, compact);
  const [direction, setDirection] = useState<Direction>("zh-ru");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const queue = useMemo(
    () =>
      [...words].sort(
        (a, b) =>
          Number(mastered.includes(a.id)) - Number(mastered.includes(b.id)),
      ),
    [mastered, words],
  );
  const word = queue[index % queue.length];

  if (!word) return null;

  const answer = (knew: boolean) => {
    onResult(word.id, knew);
    setCorrect((value) => value + Number(knew));
    setAnswered((value) => value + 1);
    setIndex((value) => (value + 1) % queue.length);
    setRevealed(false);
  };

  const reset = () => {
    setIndex(0);
    setCorrect(0);
    setAnswered(0);
    setRevealed(false);
  };

  return (
    <View style={s.layout}>
      <View style={s.side}>
        <Text style={s.eyebrow}>ЕЖЕДНЕВНАЯ ПРАКТИКА</Text>
        <Text style={s.title}>Карточки слов</Text>
        <Text style={s.copy}>
          Сначала вспоминай ответ, затем открывай обратную сторону.
        </Text>
        <View style={s.segment}>
          <Pressable
            style={[s.segmentItem, direction === "zh-ru" && s.segmentOn]}
            onPress={() => setDirection("zh-ru")}
          >
            <Text style={s.segmentText}>中文 → RU</Text>
          </Pressable>
          <Pressable
            style={[s.segmentItem, direction === "ru-zh" && s.segmentOn]}
            onPress={() => setDirection("ru-zh")}
          >
            <Text style={s.segmentText}>RU → 中文</Text>
          </Pressable>
        </View>
        <View style={s.stats}>
          <Metric colors={colors} value={String(answered)} label="повторено" />
          <Metric
            colors={colors}
            value={
              answered ? `${Math.round((correct / answered) * 100)}%` : "—"
            }
            label="точность"
          />
          <Metric
            colors={colors}
            value={String(mastered.length)}
            label="освоено"
          />
        </View>
        <Pressable style={s.reset} onPress={reset}>
          <RotateCcw size={14} color={colors.textSoft} />
          <Text style={s.resetText}>Начать заново</Text>
        </Pressable>
      </View>
      <View style={s.cardArea}>
        <Pressable style={s.card} onPress={() => setRevealed(true)}>
          <Text style={s.counter}>
            {index + 1} / {queue.length}
          </Text>
          <Text style={direction === "zh-ru" ? s.hanzi : s.prompt}>
            {direction === "zh-ru" ? word.hanzi : word.russian.split(";")[0]}
          </Text>
          {direction === "zh-ru" && <Text style={s.pinyin}>{word.pinyin}</Text>}
          {revealed ? (
            <View style={s.answer}>
              <Text style={s.answerMain}>
                {direction === "zh-ru" ? word.russian : word.hanzi}
              </Text>
              <Text style={s.answerSecondary}>
                {word.english} · {word.pinyin}
              </Text>
              <Text style={s.example}>
                {word.example.zh} · {word.example.ru}
              </Text>
            </View>
          ) : (
            <Text style={s.tapHint}>Нажми, чтобы показать ответ</Text>
          )}
        </Pressable>
        <View style={s.actions}>
          <Pressable
            disabled={!revealed}
            style={[s.action, s.miss, !revealed && s.disabled]}
            onPress={() => answer(false)}
          >
            <X size={16} color={colors.red} />
            <Text style={[s.actionText, { color: colors.red }]}>Повторить</Text>
          </Pressable>
          <Pressable
            disabled={!revealed}
            style={[s.action, s.know, !revealed && s.disabled]}
            onPress={() => answer(true)}
          >
            <Check size={16} color={colors.green} />
            <Text style={[s.actionText, { color: colors.green }]}>Знаю</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Metric({
  colors,
  value,
  label,
}: {
  colors: AppPalette;
  value: string;
  label: string;
}) {
  const s = css(colors, false);
  return (
    <View style={s.metric}>
      <Text style={s.metricValue}>{value}</Text>
      <Text style={s.metricLabel}>{label}</Text>
    </View>
  );
}

const css = (c: AppPalette, compact: boolean) =>
  StyleSheet.create({
    layout: {
      flexDirection: compact ? "column" : "row",
      gap: 18,
      padding: compact ? 4 : 18,
    },
    side: { width: compact ? "100%" : 265 },
    eyebrow: { color: c.accent, fontSize: 8, fontWeight: "900" },
    title: { color: c.text, fontSize: 20, fontWeight: "800", marginTop: 7 },
    copy: { color: c.textSoft, fontSize: 10, lineHeight: 16, marginTop: 7 },
    segment: {
      flexDirection: "row",
      backgroundColor: c.surfaceSoft,
      borderRadius: 8,
      padding: 4,
      marginTop: 18,
    },
    segmentItem: {
      flex: 1,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
    },
    segmentOn: { backgroundColor: c.accentSoft },
    segmentText: { color: c.textSoft, fontSize: 8, fontWeight: "800" },
    stats: { flexDirection: "row", gap: 6, marginTop: 12 },
    metric: {
      flex: 1,
      padding: 9,
      borderRadius: 7,
      backgroundColor: c.surfaceSoft,
      borderWidth: 1,
      borderColor: c.border,
    },
    metricValue: { color: c.text, fontSize: 13, fontWeight: "900" },
    metricLabel: { color: c.textFaint, fontSize: 7, marginTop: 3 },
    reset: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      marginTop: 16,
    },
    resetText: { color: c.textSoft, fontSize: 9, fontWeight: "700" },
    cardArea: { flex: 1 },
    card: {
      minHeight: 330,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
    },
    counter: {
      position: "absolute",
      top: 14,
      right: 16,
      color: c.textFaint,
      fontSize: 8,
      fontWeight: "800",
    },
    hanzi: { color: c.text, fontSize: 64, fontWeight: "700" },
    prompt: {
      color: c.text,
      fontSize: 23,
      fontWeight: "800",
      textAlign: "center",
    },
    pinyin: { color: c.accent, fontSize: 13, marginTop: 7 },
    tapHint: { color: c.textFaint, fontSize: 9, marginTop: 28 },
    answer: {
      alignItems: "center",
      marginTop: 24,
      paddingTop: 18,
      borderTopWidth: 1,
      borderTopColor: c.border,
      width: "80%",
    },
    answerMain: {
      color: c.text,
      fontSize: 17,
      fontWeight: "800",
      textAlign: "center",
    },
    answerSecondary: { color: c.accent, fontSize: 9, marginTop: 5 },
    example: {
      color: c.textFaint,
      fontSize: 8,
      textAlign: "center",
      marginTop: 10,
    },
    actions: { flexDirection: "row", gap: 8, marginTop: 8 },
    action: {
      flex: 1,
      height: 42,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 7,
    },
    miss: { borderColor: c.red, backgroundColor: c.surfaceSoft },
    know: { borderColor: c.green, backgroundColor: c.surfaceSoft },
    disabled: { opacity: 0.35 },
    actionText: { fontSize: 9, fontWeight: "900" },
  });
