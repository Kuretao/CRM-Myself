import { Bot, Send, Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Surface } from '../components/ui/Surface';
import { TextField } from '../components/ui/TextField';
import { Body, Muted } from '../components/ui/Typography';
import type { AppPalette } from '../theme/tokens';
import type { AiThread } from '../types/domain';

type AiPageProps = {
  colors: AppPalette;
  threads: AiThread[];
  draft: string;
  onChangeDraft: (value: string) => void;
  onSendDraft: () => void;
};

export function AiPage({ colors, threads, draft, onChangeDraft, onSendDraft }: AiPageProps) {
  const styles = createStyles(colors);
  const activeThread = threads[0];

  return (
    <>
      <SectionHeader colors={colors} title="AI workspace" subtitle="chat foundation" />
      <Surface colors={colors} style={styles.shell}>
        <View style={styles.threadList}>
          <View style={styles.threadHead}>
            <Sparkles color={colors.accent} size={18} />
            <Body colors={colors} style={styles.threadTitle}>Диалоги</Body>
          </View>
          {threads.map((thread) => (
            <View key={thread.id} style={styles.threadItem}>
              <Text style={styles.threadName}>{thread.title}</Text>
              <Text style={styles.threadDate}>{thread.updatedAt}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chat}>
          <View style={styles.chatHead}>
            <View style={styles.botIcon}>
              <Bot color={colors.accent} size={20} />
            </View>
            <View style={styles.chatCopy}>
              <Body colors={colors} style={styles.chatTitle}>{activeThread?.title || 'Новый диалог'}</Body>
              <Muted colors={colors}>Заготовка под будущего помощника по финансам, задачам и планированию.</Muted>
            </View>
          </View>

          <View style={styles.messages}>
            {(activeThread?.messages || []).map((message) => (
              <View key={message.id} style={[styles.message, message.role === 'assistant' && styles.assistantMessage]}>
                <Text style={styles.messageRole}>{message.role}</Text>
                <Text style={styles.messageText}>{message.content}</Text>
              </View>
            ))}
          </View>

          <View style={styles.composer}>
            <View style={styles.input}>
              <TextField colors={colors} value={draft} onChangeText={onChangeDraft} placeholder="Спроси про расходы, задачи или план месяца" />
            </View>
            <Button colors={colors} label="" icon={<Send color="#FFFFFF" size={18} />} onPress={onSendDraft} />
          </View>
        </View>
      </Surface>
    </>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    shell: {
      overflow: 'hidden',
    },
    threadList: {
      padding: 12,
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    threadHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    threadTitle: {
      fontWeight: '900',
    },
    threadItem: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      padding: 10,
    },
    threadName: {
      color: colors.text,
      fontWeight: '900',
      fontSize: 13,
    },
    threadDate: {
      color: colors.textFaint,
      fontSize: 11,
      marginTop: 3,
    },
    chat: {
      padding: 12,
      gap: 12,
    },
    chatHead: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    botIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    chatCopy: {
      flex: 1,
    },
    chatTitle: {
      fontWeight: '900',
    },
    messages: {
      gap: 8,
    },
    message: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      padding: 11,
    },
    assistantMessage: {
      backgroundColor: colors.accentSoft,
    },
    messageRole: {
      color: colors.textFaint,
      fontSize: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    messageText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    composer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    input: {
      flex: 1,
    },
  });
