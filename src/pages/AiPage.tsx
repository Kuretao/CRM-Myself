import { Bot, Plus, Send, Sparkles } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Surface } from "../components/ui/Surface";
import { TextField } from "../components/ui/TextField";
import type { AppPalette } from "../theme/tokens";
import type { AiThread } from "../types/domain";
type Props = {
  colors: AppPalette;
  threads: AiThread[];
  draft: string;
  onChangeDraft: (v: string) => void;
  onSendDraft: () => void;
};
export function AiPage(p: Props) {
  const s = css(p.colors),
    thread = p.threads[0];
  const prompts = [
    "Проверь риски бюджета",
    "Что оплатить в первую очередь?",
    "Составь план до вылета",
  ];
  return (
    <View style={s.page}>
      <View style={s.head}>
        <View>
          <Text style={s.kicker}>NOVA INTELLIGENCE</Text>
          <Text style={s.title}>AI-помощник</Text>
          <Text style={s.sub}>
            Финансы, задачи и подготовка к переезду в одном контексте.
          </Text>
        </View>
        <Pressable style={s.new}>
          <Plus size={15} color="#03101F" />
          <Text style={s.newText}>Новый диалог</Text>
        </Pressable>
      </View>
      <Surface colors={p.colors} style={s.shell}>
        <View style={s.threads}>
          <View style={s.threadHead}>
            <Sparkles size={16} color={p.colors.accent} />
            <Text style={s.threadHeadText}>Диалоги</Text>
          </View>
          {p.threads.map((x) => (
            <View key={x.id} style={s.thread}>
              <Text style={s.threadTitle}>{x.title}</Text>
              <Text style={s.threadDate}>{x.updatedAt}</Text>
            </View>
          ))}
        </View>
        <View style={s.chat}>
          <View style={s.chatHead}>
            <View style={s.bot}>
              <Bot size={19} color={p.colors.accent} />
            </View>
            <View>
              <Text style={s.chatTitle}>{thread?.title || "Новый диалог"}</Text>
              <Text style={s.online}>● локальный помощник активен</Text>
            </View>
          </View>
          <ScrollView style={s.messages} contentContainerStyle={{ gap: 10 }}>
            {(thread?.messages || []).map((m) => (
              <View
                key={m.id}
                style={[
                  s.message,
                  m.role === "assistant" ? s.assistant : s.user,
                ]}
              >
                <Text style={s.role}>
                  {m.role === "assistant" ? "NOVA" : "ВЫ"}
                </Text>
                <Text style={s.messageText}>{m.content}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={s.prompts}>
            {prompts.map((x) => (
              <Pressable
                key={x}
                style={s.prompt}
                onPress={() => p.onChangeDraft(x)}
              >
                <Text style={s.promptText}>{x}</Text>
              </Pressable>
            ))}
          </View>
          <View style={s.composer}>
            <View style={{ flex: 1 }}>
              <TextField
                colors={p.colors}
                value={p.draft}
                onChangeText={p.onChangeDraft}
                placeholder="Спроси про бюджет, планы или задачи"
              />
            </View>
            <Pressable style={s.send} onPress={p.onSendDraft}>
              <Send size={17} color="#03101F" />
            </Pressable>
          </View>
        </View>
      </Surface>
    </View>
  );
}
const css = (c: AppPalette) =>
  StyleSheet.create({
    page: { flex: 1, height: "100%", padding: 22, gap: 14, minHeight: 0 },
    head: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    kicker: { color: c.textFaint, fontSize: 9, fontWeight: "800" },
    title: { color: c.text, fontSize: 25, fontWeight: "700", marginTop: 5 },
    sub: { color: c.textSoft, fontSize: 11, marginTop: 4 },
    new: {
      height: 36,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: c.accent,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    newText: { color: "#03101F", fontSize: 10, fontWeight: "800" },
    shell: {
      flex: 1,
      minHeight: 0,
      flexDirection: "row",
      overflow: "hidden",
    },
    threads: {
      width: 250,
      padding: 12,
      borderRightWidth: 1,
      borderRightColor: c.border,
      gap: 8,
    },
    threadHead: {
      height: 36,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    threadHeadText: { color: c.text, fontSize: 12, fontWeight: "800" },
    thread: {
      padding: 11,
      borderRadius: 8,
      backgroundColor: c.accentSoft,
      borderWidth: 1,
      borderColor: c.borderStrong,
    },
    threadTitle: { color: c.text, fontSize: 11, fontWeight: "700" },
    threadDate: { color: c.textFaint, fontSize: 8, marginTop: 3 },
    chat: { flex: 1, padding: 14, gap: 10 },
    chatHead: {
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    bot: {
      width: 34,
      height: 34,
      borderRadius: 8,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    chatTitle: { color: c.text, fontSize: 12, fontWeight: "800" },
    online: { color: c.green, fontSize: 8, marginTop: 3 },
    messages: { flex: 1 },
    message: {
      maxWidth: "72%",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    assistant: { alignSelf: "flex-start", backgroundColor: c.surfaceSoft },
    user: { alignSelf: "flex-end", backgroundColor: c.accentSoft },
    role: {
      color: c.textFaint,
      fontSize: 7,
      fontWeight: "900",
      marginBottom: 4,
    },
    messageText: { color: c.text, fontSize: 11, lineHeight: 17 },
    prompts: { flexDirection: "row", gap: 7 },
    prompt: {
      paddingHorizontal: 9,
      paddingVertical: 7,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
    },
    promptText: { color: c.textSoft, fontSize: 8, fontWeight: "700" },
    composer: { flexDirection: "row", gap: 8 },
    send: {
      width: 40,
      borderRadius: 8,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
  });
