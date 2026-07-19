import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import type { DocumentAttachment } from "./types";

export const MAX_LOCAL_FILE_SIZE = 20 * 1024 * 1024;

const safeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");

export async function pickDocumentFile(): Promise<DocumentAttachment | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "application/pdf",
      "image/*",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    multiple: false,
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  const size = asset.size || 0;
  if (size > MAX_LOCAL_FILE_SIZE) throw new Error("Файл больше 20 МБ.");

  const directory = new Directory(Paths.document, "nova-documents");
  if (!directory.exists) directory.create({ intermediates: true });
  const source = new File(asset.uri);
  const destination = new File(directory, `${Date.now()}-${safeFileName(asset.name)}`);
  await source.copy(destination);

  return {
    name: asset.name,
    uri: destination.uri,
    mimeType: asset.mimeType || "application/octet-stream",
    size,
    addedAt: new Date().toISOString(),
  };
}
