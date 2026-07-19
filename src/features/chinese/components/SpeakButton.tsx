import * as Speech from "expo-speech";
import { Volume2, VolumeX } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import type { AppPalette } from "../../../theme/tokens";

export function SpeakButton({
  colors,
  text,
  pinyin = false,
  compact = false,
}: {
  colors: AppPalette;
  text: string;
  pinyin?: boolean;
  compact?: boolean;
}) {
  const [speaking, setSpeaking] = useState(false);
  const speak = async () => {
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }
    await Speech.stop();
    setSpeaking(true);
    Speech.speak(text, {
      language: "zh-CN",
      rate: pinyin ? 0.62 : 0.78,
      useApplicationAudioSession: false,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };
  return (
    <Pressable
      onPress={speak}
      accessibilityRole="button"
      accessibilityLabel={pinyin ? "Прослушать pinyin" : "Прослушать китайское произношение"}
      style={[
        styles.button,
        compact && styles.compact,
        { borderColor: colors.border, backgroundColor: colors.surfaceSolid },
      ]}
    >
      {speaking ? (
        <VolumeX size={compact ? 13 : 15} color={colors.accent} />
      ) : (
        <Volume2 size={compact ? 13 : 15} color={colors.accent} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  compact: { width: 25, height: 25, borderRadius: 6 },
});
