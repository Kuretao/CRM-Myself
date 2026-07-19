import { createElement } from "react";
import { ExternalLink, FileText, X } from "lucide-react-native";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { AppPalette } from "../../../theme/tokens";
import type { PersonalDocument } from "../types";

type Props = {
  colors: AppPalette;
  document: PersonalDocument | null;
  onClose: () => void;
};

export function DocumentPreview({ colors, document, onClose }: Props) {
  const styles = css(colors);
  const attachment = document?.attachment;
  if (!document || !attachment) return null;
  const isImage = attachment.mimeType.startsWith("image/");
  const isText = attachment.mimeType.startsWith("text/");
  const textContent = isText
    ? decodeTextDataUri(attachment.uri)
    : "";
  const openNewTab = () => window.open(attachment.uri, "_blank", "noopener,noreferrer");

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.head}>
            <View style={styles.fileIcon}><FileText size={17} color={colors.textSoft} /></View>
            <View style={styles.copy}><Text style={styles.title}>{document.title}</Text><Text style={styles.meta}>{attachment.name}</Text></View>
            <Pressable accessibilityLabel="Открыть в новой вкладке" style={styles.iconButton} onPress={openNewTab}><ExternalLink size={15} color={colors.textSoft} /></Pressable>
            <Pressable accessibilityLabel="Закрыть просмотр" style={styles.iconButton} onPress={onClose}><X size={16} color={colors.textSoft} /></Pressable>
          </View>
          <View style={styles.viewer}>
            {isImage
              ? <Image source={{ uri: attachment.uri }} resizeMode="contain" style={styles.image} />
              : isText
                ? createElement("pre", { style: { width: "100%", height: "100%", overflow: "auto", boxSizing: "border-box", margin: 0, padding: 24, borderRadius: 8, background: colors.mode === "dark" ? "#171C23" : "#FFFFFF", color: colors.text, whiteSpace: "pre-wrap", fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", fontSize: 14, lineHeight: 1.6 } }, textContent)
                : createElement("iframe", { src: attachment.uri, title: document.title, style: { width: "100%", height: "100%", border: 0, borderRadius: 8, background: "#fff" } })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const css = (colors: AppPalette) => StyleSheet.create({
  overlay: { flex: 1, padding: 18, backgroundColor: "rgba(0,0,0,.56)", alignItems: "center", justifyContent: "center" },
  modal: { width: "94%", height: "90%", maxWidth: 1180, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceSolid, shadowColor: "#000", shadowOpacity: .38, shadowRadius: 34 },
  head: { height: 62, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  fileIcon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSoft },
  copy: { flex: 1, minWidth: 0 },
  title: { color: colors.text, fontSize: 11, fontWeight: "900" },
  meta: { color: colors.textFaint, fontSize: 8, marginTop: 2 },
  iconButton: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  viewer: { flex: 1, padding: 10, backgroundColor: colors.bgDeep },
  image: { width: "100%", height: "100%" },
});

function decodeTextDataUri(uri: string) {
  try {
    const payload = uri.split(",").at(-1) || "";
    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return "Не удалось прочитать содержимое файла.";
  }
}
