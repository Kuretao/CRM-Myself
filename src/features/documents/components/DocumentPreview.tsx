import { ExternalLink, FileText, X } from "lucide-react-native";
import { Image, Linking, Modal, Pressable, StyleSheet, Text, View } from "react-native";
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

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.head}>
            <View style={styles.fileIcon}><FileText size={17} color={colors.textSoft} /></View>
            <View style={styles.copy}><Text style={styles.title}>{document.title}</Text><Text style={styles.meta}>{attachment.name}</Text></View>
            <Pressable style={styles.iconButton} onPress={() => Linking.openURL(attachment.uri)}><ExternalLink size={15} color={colors.textSoft} /></Pressable>
            <Pressable style={styles.iconButton} onPress={onClose}><X size={16} color={colors.textSoft} /></Pressable>
          </View>
          <View style={styles.viewer}>
            {isImage ? <Image source={{ uri: attachment.uri }} resizeMode="contain" style={styles.image} /> : <View style={styles.unsupported}><FileText size={34} color={colors.textFaint} /><Text style={styles.unsupportedTitle}>Предпросмотр файла</Text><Text style={styles.unsupportedText}>Для этого формата используется системный просмотрщик.</Text><Pressable style={styles.openButton} onPress={() => Linking.openURL(attachment.uri)}><ExternalLink size={14} color={colors.text} /><Text style={styles.openText}>Открыть файл</Text></Pressable></View>}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const css = (colors: AppPalette) => StyleSheet.create({
  overlay: { flex: 1, padding: 18, backgroundColor: "rgba(0,0,0,.56)", alignItems: "center", justifyContent: "center" },
  modal: { width: "94%", height: "88%", maxWidth: 1120, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceSolid },
  head: { height: 62, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  fileIcon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSoft },
  copy: { flex: 1, minWidth: 0 },
  title: { color: colors.text, fontSize: 11, fontWeight: "900" },
  meta: { color: colors.textFaint, fontSize: 8, marginTop: 2 },
  iconButton: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  viewer: { flex: 1, padding: 10, backgroundColor: colors.bgDeep },
  image: { width: "100%", height: "100%" },
  unsupported: { flex: 1, alignItems: "center", justifyContent: "center" },
  unsupportedTitle: { color: colors.text, fontSize: 13, fontWeight: "900", marginTop: 12 },
  unsupportedText: { color: colors.textSoft, fontSize: 9, marginTop: 4 },
  openButton: { height: 38, marginTop: 14, paddingHorizontal: 13, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceSoft },
  openText: { color: colors.text, fontSize: 9, fontWeight: "900" },
});
