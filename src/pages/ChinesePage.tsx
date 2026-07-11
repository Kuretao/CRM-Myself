import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowRight,
  BookOpen,
  Check,
  Languages,
  Search,
  Sparkles,
  Star,
  Table2,
  WholeWord,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { PracticeNotebook } from "../features/chinese/components/PracticeNotebook";
import { StudySession } from "../features/chinese/components/StudySession";
import { lessons, radicals, vocabulary } from "../features/chinese/data/course";
import type { ChineseLesson } from "../features/chinese/types";
import { Surface } from "../components/ui/Surface";
import type { AppPalette } from "../theme/tokens";

type Tab =
  "lessons" | "study" | "translate" | "practice" | "dictionary" | "radicals";
const PROGRESS_KEY = "nova-chinese-progress-v1";
const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "lessons", label: "Уроки", icon: BookOpen },
  { id: "study", label: "Тренировка", icon: Sparkles },
  { id: "translate", label: "Перевод", icon: Languages },
  { id: "practice", label: "Прописи", icon: WholeWord },
  { id: "dictionary", label: "Словарь", icon: Search },
  { id: "radicals", label: "Ключи", icon: Table2 },
];

export function ChinesePage({ colors }: { colors: AppPalette }) {
  const s = css(colors);
  const [tab, setTab] = useState<Tab>("lessons");
  const [completed, setCompleted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [mastered, setMastered] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<ChineseLesson>(
    lessons[0],
  );
  const [character, setCharacter] = useState("你");
  useEffect(() => {
    AsyncStorage.getItem(PROGRESS_KEY)
      .then((raw) => {
        if (raw) {
          const data = JSON.parse(raw);
          setCompleted(data.completed || []);
          setSaved(data.saved || []);
          setMastered(data.mastered || []);
          setReviewed(data.reviewed || 0);
        }
      })
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed, saved, mastered, reviewed }),
    ).catch(() => undefined);
  }, [completed, saved, mastered, reviewed]);
  const progress = Math.round((completed.length / lessons.length) * 100);
  const toggleSaved = (id: string) =>
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  return (
    <View style={s.page}>
      <View style={s.head}>
        <View>
          <Text style={s.kicker}>中文 LEARNING SPACE</Text>
          <Text style={s.title}>Китайский язык</Text>
          <Text style={s.sub}>
            Уроки, перевод, словарь и практика иероглифов.
          </Text>
        </View>
        <View style={s.progressWrap}>
          <View style={s.progressTop}>
            <Text style={s.progressLabel}>Прогресс курса</Text>
            <Text style={s.progressValue}>{progress}%</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={s.progressMeta}>
            {completed.length} из {lessons.length} уроков завершено
          </Text>
        </View>
      </View>
      <View style={s.tabs}>
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.id}
              style={[s.tab, tab === item.id && s.tabOn]}
              onPress={() => setTab(item.id)}
            >
              <Icon
                size={15}
                color={tab === item.id ? colors.accent : colors.textFaint}
              />
              <Text style={[s.tabText, tab === item.id && s.tabTextOn]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {tab === "lessons" && (
        <LessonsView
          colors={colors}
          selected={selectedLesson}
          onSelect={setSelectedLesson}
          completed={completed}
          onComplete={(id) =>
            setCompleted((current) =>
              current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
            )
          }
          saved={saved}
          onSave={toggleSaved}
        />
      )}{" "}
      {tab === "study" && (
        <Surface colors={colors} style={s.module}>
          <StudySession
            colors={colors}
            words={
              saved.length
                ? vocabulary.filter((word) => saved.includes(word.id))
                : vocabulary
            }
            mastered={mastered}
            onResult={(id, knew) => {
              setReviewed((value) => value + 1);
              setMastered((current) =>
                knew
                  ? current.includes(id)
                    ? current
                    : [...current, id]
                  : current.filter((item) => item !== id),
              );
            }}
          />
          <Text style={s.reviewedTotal}>Всего повторений: {reviewed}</Text>
        </Surface>
      )}{" "}
      {tab === "translate" && <Translator colors={colors} />}{" "}
      {tab === "practice" && (
        <Surface colors={colors} style={s.module}>
          <PracticeNotebook
            colors={colors}
            character={character}
            onChangeCharacter={setCharacter}
            choices={vocabulary.map((item) => item.hanzi[0])}
          />
        </Surface>
      )}{" "}
      {tab === "dictionary" && (
        <Dictionary colors={colors} saved={saved} onSave={toggleSaved} />
      )}{" "}
      {tab === "radicals" && <Radicals colors={colors} />}{" "}
    </View>
  );
}

function LessonsView({
  colors,
  selected,
  onSelect,
  completed,
  onComplete,
  saved,
  onSave,
}: {
  colors: AppPalette;
  selected: ChineseLesson;
  onSelect: (lesson: ChineseLesson) => void;
  completed: string[];
  onComplete: (id: string) => void;
  saved: string[];
  onSave: (id: string) => void;
}) {
  const s = css(colors);
  const words = selected.vocabularyIds
    .map((id) => vocabulary.find((item) => item.id === id))
    .filter(Boolean) as typeof vocabulary;
  return (
    <View style={s.lessonGrid}>
      <View style={s.lessonList}>
        {lessons.map((lesson) => (
          <Pressable key={lesson.id} onPress={() => onSelect(lesson)}>
            <Surface
              colors={colors}
              style={[
                s.lessonCard,
                selected.id === lesson.id && s.lessonCardOn,
              ]}
            >
              <View style={s.lessonNumber}>
                <Text style={s.lessonIcon}>{lesson.icon}</Text>
              </View>
              <View style={s.lessonCopy}>
                <Text style={s.lessonOrder}>
                  УРОК {lesson.order} · {lesson.duration} МИН
                </Text>
                <Text style={s.lessonTitle}>{lesson.title}</Text>
                <Text style={s.lessonSub}>{lesson.subtitle}</Text>
              </View>
              {completed.includes(lesson.id) && (
                <View style={s.completeDot}>
                  <Check size={12} color="#03101F" />
                </View>
              )}
            </Surface>
          </Pressable>
        ))}
      </View>
      <Surface colors={colors} style={s.lessonDetail}>
        <View style={s.detailHead}>
          <View>
            <Text style={s.detailKicker}>УРОК {selected.order}</Text>
            <Text style={s.detailTitle}>{selected.title}</Text>
            <Text style={s.detailSub}>{selected.subtitle}</Text>
          </View>
          <Text style={s.heroHanzi}>{selected.icon}</Text>
        </View>
        <Text style={s.sectionTitle}>Коротко о главном</Text>
        {selected.theory.map((line, index) => (
          <View key={line} style={s.theoryRow}>
            <View style={s.theoryNumber}>
              <Text style={s.theoryNumberText}>{index + 1}</Text>
            </View>
            <Text style={s.theoryText}>{line}</Text>
          </View>
        ))}
        <Text style={s.sectionTitle}>Слова урока</Text>
        <View style={s.wordGrid}>
          {words.map((word) => (
            <View key={word.id} style={s.word}>
              <View>
                <Text style={s.wordHanzi}>{word.hanzi}</Text>
                <Text style={s.wordPinyin}>{word.pinyin}</Text>
              </View>
              <View style={s.wordCopy}>
                <Text style={s.wordRu}>{word.russian}</Text>
                <Text style={s.wordEn}>{word.english}</Text>
              </View>
              <Pressable onPress={() => onSave(word.id)}>
                <Star
                  size={14}
                  color={
                    saved.includes(word.id) ? colors.amber : colors.textFaint
                  }
                  fill={saved.includes(word.id) ? colors.amber : "transparent"}
                />
              </Pressable>
            </View>
          ))}
        </View>
        <Text style={s.sectionTitle}>Полезные фразы</Text>
        {selected.phrases.map((phrase) => (
          <View key={phrase.zh} style={s.phrase}>
            <Text style={s.phraseZh}>{phrase.zh}</Text>
            <Text style={s.phrasePinyin}>{phrase.pinyin}</Text>
            <View style={s.translationRow}>
              <Text style={s.phraseEn}>{phrase.en}</Text>
              <ArrowRight size={11} color={colors.textFaint} />
              <Text style={s.phraseRu}>{phrase.ru}</Text>
            </View>
          </View>
        ))}
        <View style={s.exercise}>
          <Text style={s.exerciseLabel}>ПРАКТИКА</Text>
          <Text style={s.exercisePrompt}>{selected.exercise.prompt}</Text>
          <Text style={s.exerciseAnswer}>
            Ответ: {selected.exercise.answer}
          </Text>
        </View>
        <Pressable
          style={[
            s.completeButton,
            completed.includes(selected.id) && s.completeButtonDone,
          ]}
          onPress={() => onComplete(selected.id)}
        >
          <Check
            size={15}
            color={completed.includes(selected.id) ? colors.green : "#03101F"}
          />
          <Text
            style={[
              s.completeButtonText,
              completed.includes(selected.id) && { color: colors.green },
            ]}
          >
            {completed.includes(selected.id)
              ? "Урок завершен"
              : "Завершить урок"}
          </Text>
        </Pressable>
      </Surface>
    </View>
  );
}

function Translator({ colors }: { colors: AppPalette }) {
  const s = css(colors);
  const [direction, setDirection] = useState<"ru-zh" | "zh-ru">("ru-zh");
  const [query, setQuery] = useState("");
  const entries = useMemo(
    () => [
      ...vocabulary.map((word) => ({
        ru: word.russian.split(";")[0],
        en: word.english.split(";")[0],
        zh: word.hanzi,
        pinyin: word.pinyin,
      })),
      ...lessons.flatMap((lesson) =>
        lesson.phrases.map((phrase) => ({
          ru: phrase.ru.replace(/[.!?]/g, ""),
          en: phrase.en.replace(/[.!?]/g, ""),
          zh: phrase.zh.replace(/[。！？]/g, ""),
          pinyin: phrase.pinyin,
        })),
      ),
    ],
    [],
  );
  const result = useMemo(() => {
    const clean = query
      .trim()
      .toLowerCase()
      .replace(/[.!?。！？]/g, "");
    if (!clean) return null;
    return direction === "ru-zh"
      ? entries.find((item) => item.ru.toLowerCase() === clean)
      : entries.find((item) => item.zh === clean);
  }, [query, direction, entries]);
  return (
    <View style={s.translatorGrid}>
      <Surface colors={colors} style={s.translateInput}>
        <View style={s.direction}>
          <Pressable
            style={[s.directionButton, direction === "ru-zh" && s.directionOn]}
            onPress={() => {
              setDirection("ru-zh");
              setQuery("");
            }}
          >
            <Text style={s.directionText}>RU → EN → 中文</Text>
          </Pressable>
          <Pressable
            style={[s.directionButton, direction === "zh-ru" && s.directionOn]}
            onPress={() => {
              setDirection("zh-ru");
              setQuery("");
            }}
          >
            <Text style={s.directionText}>中文 → EN → RU</Text>
          </Pressable>
        </View>
        <Text style={s.inputLabel}>
          {direction === "ru-zh" ? "Текст на русском" : "中文文本"}
        </Text>
        <TextInput
          multiline
          value={query}
          onChangeText={setQuery}
          placeholder={
            direction === "ru-zh"
              ? "Например: Сколько это стоит?"
              : "例如：这个多少钱"
          }
          placeholderTextColor={colors.textFaint}
          style={s.translateTextArea}
        />
        <Text style={s.translatorHint}>
          Офлайн-перевод по словам и фразам курса · {entries.length} записей
        </Text>
      </Surface>
      <Surface colors={colors} style={s.translateResult}>
        <Text style={s.resultKicker}>ЦЕПОЧКА ПЕРЕВОДА</Text>
        {result ? (
          <>
            {direction === "ru-zh" ? (
              <>
                <TranslationStep colors={colors} code="RU" value={result.ru} />
                <Chain />
                <TranslationStep colors={colors} code="EN" value={result.en} />
                <Chain />
                <TranslationStep
                  colors={colors}
                  code="中文"
                  value={result.zh}
                  sub={result.pinyin}
                />
              </>
            ) : (
              <>
                <TranslationStep
                  colors={colors}
                  code="中文"
                  value={result.zh}
                  sub={result.pinyin}
                />
                <Chain />
                <TranslationStep colors={colors} code="EN" value={result.en} />
                <Chain />
                <TranslationStep colors={colors} code="RU" value={result.ru} />
              </>
            )}
          </>
        ) : (
          <View style={s.emptyResult}>
            <Languages size={32} color={colors.textFaint} />
            <Text style={s.emptyTitle}>
              {query ? "Фразы пока нет в базе" : "Начни вводить текст"}
            </Text>
            <Text style={s.emptyText}>
              {query
                ? "Свободный перевод потребует подключения внешнего API. Попробуй слово или фразу из уроков."
                : "Здесь появятся английский промежуточный слой, китайский перевод и pinyin."}
            </Text>
          </View>
        )}
      </Surface>
    </View>
  );
}
function TranslationStep({
  colors,
  code,
  value,
  sub,
}: {
  colors: AppPalette;
  code: string;
  value: string;
  sub?: string;
}) {
  const s = css(colors);
  return (
    <View style={s.translationStep}>
      <Text style={s.stepCode}>{code}</Text>
      <Text style={[s.stepValue, code === "中文" && s.stepChinese]}>
        {value}
      </Text>
      {sub && <Text style={s.stepSub}>{sub}</Text>}
    </View>
  );
}
function Chain() {
  return (
    <View
      style={{
        height: 20,
        width: 1,
        backgroundColor: "rgba(120,170,220,.25)",
        marginLeft: 19,
      }}
    />
  );
}

function Dictionary({
  colors,
  saved,
  onSave,
}: {
  colors: AppPalette;
  saved: string[];
  onSave: (id: string) => void;
}) {
  const s = css(colors);
  const [query, setQuery] = useState("");
  const filtered = vocabulary.filter((item) =>
    `${item.hanzi} ${item.pinyin} ${item.russian} ${item.english}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Surface colors={colors} style={s.module}>
      <View style={s.dictionaryHead}>
        <View>
          <Text style={s.moduleTitle}>Учебный словарь</Text>
          <Text style={s.moduleSub}>
            {filtered.length} слов · русский, английский, pinyin и 汉字
          </Text>
        </View>
        <View style={s.search}>
          <Search size={14} color={colors.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Найти слово"
            placeholderTextColor={colors.textFaint}
            style={s.searchInput}
          />
        </View>
      </View>
      <View style={s.tableHead}>
        <Text style={[s.th, { flex: 0.5 }]}>汉字</Text>
        <Text style={s.th}>PINYIN</Text>
        <Text style={s.th}>РУССКИЙ</Text>
        <Text style={s.th}>ENGLISH</Text>
        <Text style={[s.th, { flex: 0.5 }]}>HSK</Text>
        <Text style={[s.th, { width: 30 }]} />
      </View>
      {filtered.map((item) => (
        <View key={item.id} style={s.tableRow}>
          <Text style={[s.tdHanzi, { flex: 0.5 }]}>{item.hanzi}</Text>
          <Text style={s.tdPinyin}>{item.pinyin}</Text>
          <Text style={s.td}>{item.russian}</Text>
          <Text style={s.td}>{item.english}</Text>
          <View style={{ flex: 0.5 }}>
            <Text style={s.hsk}>HSK {item.hsk}</Text>
          </View>
          <Pressable style={{ width: 30 }} onPress={() => onSave(item.id)}>
            <Star
              size={14}
              color={saved.includes(item.id) ? colors.amber : colors.textFaint}
              fill={saved.includes(item.id) ? colors.amber : "transparent"}
            />
          </Pressable>
        </View>
      ))}
    </Surface>
  );
}
function Radicals({ colors }: { colors: AppPalette }) {
  const s = css(colors);
  return (
    <Surface colors={colors} style={s.module}>
      <View style={s.dictionaryHead}>
        <View>
          <Text style={s.moduleTitle}>Таблица ключей 部首</Text>
          <Text style={s.moduleSub}>
            20 базовых компонентов для понимания структуры иероглифов
          </Text>
        </View>
      </View>
      <View style={s.radicalGrid}>
        {radicals.map((item) => (
          <View key={item.number} style={s.radicalCard}>
            <Text style={s.radicalNumber}>№ {item.number}</Text>
            <Text style={s.radical}>{item.radical}</Text>
            <Text style={s.radicalPinyin}>
              {item.pinyin} · {item.strokes} черт.
            </Text>
            <Text style={s.radicalMeaning}>{item.meaningRu}</Text>
            <Text style={s.radicalEn}>{item.meaningEn}</Text>
            <Text style={s.radicalExamples}>{item.examples}</Text>
          </View>
        ))}
      </View>
    </Surface>
  );
}

const css = (c: AppPalette) =>
  StyleSheet.create({
    page: { paddingTop: 22, paddingBottom: 30, gap: 14 },
    head: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    kicker: { color: c.textFaint, fontSize: 9, fontWeight: "800" },
    title: { color: c.text, fontSize: 25, fontWeight: "700", marginTop: 5 },
    sub: { color: c.textSoft, fontSize: 11, marginTop: 4 },
    progressWrap: { width: 260 },
    progressTop: { flexDirection: "row", justifyContent: "space-between" },
    progressLabel: { color: c.textSoft, fontSize: 9, fontWeight: "700" },
    progressValue: { color: c.accent, fontSize: 10, fontWeight: "900" },
    progressTrack: {
      height: 5,
      borderRadius: 3,
      backgroundColor: c.surfaceSolid,
      marginTop: 7,
      overflow: "hidden",
    },
    progressFill: { height: "100%", backgroundColor: c.accent },
    progressMeta: { color: c.textFaint, fontSize: 8, marginTop: 5 },
    tabs: {
      height: 48,
      padding: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      flexDirection: "row",
      gap: 4,
    },
    tab: {
      flex: 1,
      borderRadius: 7,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    tabOn: { backgroundColor: c.accentSoft },
    tabText: { color: c.textFaint, fontSize: 9, fontWeight: "700" },
    tabTextOn: { color: c.accent },
    module: { padding: 16 },
    reviewedTotal: {
      color: c.textFaint,
      fontSize: 8,
      textAlign: "right",
      marginTop: 8,
    },
    lessonGrid: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
    lessonList: { width: 300, gap: 8 },
    lessonCard: {
      padding: 11,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    lessonCardOn: { borderColor: c.accent, backgroundColor: c.accentSoft },
    lessonNumber: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: c.surfaceSolid,
      alignItems: "center",
      justifyContent: "center",
    },
    lessonIcon: { color: c.text, fontSize: 20, fontWeight: "700" },
    lessonCopy: { flex: 1 },
    lessonOrder: { color: c.textFaint, fontSize: 7, fontWeight: "900" },
    lessonTitle: {
      color: c.text,
      fontSize: 11,
      fontWeight: "800",
      marginTop: 3,
    },
    lessonSub: { color: c.textFaint, fontSize: 8, marginTop: 2 },
    completeDot: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: c.green,
      alignItems: "center",
      justifyContent: "center",
    },
    lessonDetail: { flex: 1, padding: 18 },
    detailHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      paddingBottom: 15,
    },
    detailKicker: { color: c.accent, fontSize: 8, fontWeight: "900" },
    detailTitle: {
      color: c.text,
      fontSize: 22,
      fontWeight: "800",
      marginTop: 5,
    },
    detailSub: { color: c.textSoft, fontSize: 10, marginTop: 4 },
    heroHanzi: {
      color: c.accent,
      fontSize: 54,
      fontWeight: "600",
      opacity: 0.65,
    },
    sectionTitle: {
      color: c.text,
      fontSize: 11,
      fontWeight: "900",
      marginTop: 17,
      marginBottom: 8,
    },
    theoryRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 9,
      marginBottom: 7,
    },
    theoryNumber: {
      width: 20,
      height: 20,
      borderRadius: 6,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    theoryNumberText: { color: c.accent, fontSize: 8, fontWeight: "900" },
    theoryText: { flex: 1, color: c.textSoft, fontSize: 9, lineHeight: 15 },
    wordGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
    word: {
      width: "48.8%",
      minHeight: 62,
      padding: 9,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },
    wordHanzi: { color: c.text, fontSize: 20, fontWeight: "700" },
    wordPinyin: { color: c.accent, fontSize: 8, marginTop: 2 },
    wordCopy: { flex: 1 },
    wordRu: { color: c.text, fontSize: 9, fontWeight: "700" },
    wordEn: { color: c.textFaint, fontSize: 8, marginTop: 3 },
    phrase: {
      padding: 10,
      borderRadius: 7,
      backgroundColor: c.surfaceSoft,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 7,
    },
    phraseZh: { color: c.text, fontSize: 17, fontWeight: "700" },
    phrasePinyin: { color: c.accent, fontSize: 9, marginTop: 3 },
    translationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 5,
    },
    phraseEn: { color: c.textFaint, fontSize: 8 },
    phraseRu: { color: c.textSoft, fontSize: 8 },
    exercise: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: c.accentSoft,
      marginTop: 12,
    },
    exerciseLabel: { color: c.accent, fontSize: 7, fontWeight: "900" },
    exercisePrompt: {
      color: c.text,
      fontSize: 10,
      fontWeight: "700",
      marginTop: 5,
    },
    exerciseAnswer: { color: c.textFaint, fontSize: 8, marginTop: 5 },
    completeButton: {
      height: 38,
      borderRadius: 8,
      backgroundColor: c.accent,
      marginTop: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
    },
    completeButtonDone: {
      backgroundColor: c.surfaceSoft,
      borderWidth: 1,
      borderColor: c.green,
    },
    completeButtonText: { color: "#03101F", fontSize: 9, fontWeight: "900" },
    translatorGrid: { flexDirection: "row", gap: 12 },
    translateInput: { flex: 1, padding: 16 },
    translateResult: { flex: 1, padding: 16, minHeight: 390 },
    direction: {
      height: 38,
      padding: 4,
      borderRadius: 8,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      gap: 4,
    },
    directionButton: {
      flex: 1,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
    },
    directionOn: { backgroundColor: c.surfaceSolid },
    directionText: { color: c.textSoft, fontSize: 8, fontWeight: "800" },
    inputLabel: {
      color: c.textSoft,
      fontSize: 9,
      fontWeight: "800",
      marginTop: 18,
    },
    translateTextArea: {
      height: 190,
      marginTop: 7,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      padding: 12,
      color: c.text,
      fontSize: 12,
      textAlignVertical: "top",
      outlineStyle: "none",
    } as any,
    translatorHint: { color: c.textFaint, fontSize: 8, marginTop: 8 },
    resultKicker: {
      color: c.textFaint,
      fontSize: 8,
      fontWeight: "900",
      marginBottom: 14,
    },
    translationStep: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: c.surfaceSoft,
      borderWidth: 1,
      borderColor: c.border,
    },
    stepCode: { color: c.accent, fontSize: 7, fontWeight: "900" },
    stepValue: { color: c.text, fontSize: 13, fontWeight: "700", marginTop: 5 },
    stepChinese: { fontSize: 24 },
    stepSub: { color: c.accent, fontSize: 9, marginTop: 4 },
    emptyResult: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
    },
    emptyTitle: {
      color: c.text,
      fontSize: 12,
      fontWeight: "800",
      marginTop: 12,
    },
    emptyText: {
      color: c.textFaint,
      fontSize: 9,
      lineHeight: 14,
      textAlign: "center",
      marginTop: 6,
    },
    dictionaryHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 13,
    },
    moduleTitle: { color: c.text, fontSize: 14, fontWeight: "800" },
    moduleSub: { color: c.textFaint, fontSize: 9, marginTop: 3 },
    search: {
      width: 230,
      height: 36,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    searchInput: {
      flex: 1,
      color: c.text,
      fontSize: 9,
      outlineStyle: "none",
    } as any,
    tableHead: {
      height: 34,
      paddingHorizontal: 9,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.surfaceSolid,
      borderRadius: 7,
    },
    th: { flex: 1, color: c.textFaint, fontSize: 7, fontWeight: "900" },
    tableRow: {
      minHeight: 52,
      paddingHorizontal: 9,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    tdHanzi: { color: c.text, fontSize: 18, fontWeight: "700" },
    tdPinyin: { flex: 1, color: c.accent, fontSize: 9, fontWeight: "700" },
    td: { flex: 1, color: c.textSoft, fontSize: 8 },
    hsk: {
      alignSelf: "flex-start",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 5,
      backgroundColor: c.accentSoft,
      color: c.accent,
      fontSize: 7,
      fontWeight: "900",
    },
    radicalGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    radicalCard: {
      width: "19%",
      minHeight: 150,
      padding: 11,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
    },
    radicalNumber: { color: c.textFaint, fontSize: 7, fontWeight: "800" },
    radical: { color: c.text, fontSize: 31, fontWeight: "600", marginTop: 5 },
    radicalPinyin: { color: c.accent, fontSize: 8, marginTop: 3 },
    radicalMeaning: {
      color: c.text,
      fontSize: 9,
      fontWeight: "700",
      marginTop: 8,
    },
    radicalEn: { color: c.textFaint, fontSize: 8, marginTop: 2 },
    radicalExamples: { color: c.textSoft, fontSize: 13, marginTop: "auto" },
  });
