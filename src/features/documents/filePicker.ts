import * as DocumentPicker from "expo-document-picker";
import type { DocumentAttachment } from "./types";

export const MAX_LOCAL_FILE_SIZE = 4 * 1024 * 1024;

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
    base64: true,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  const size = asset.size || 0;
  if (size > MAX_LOCAL_FILE_SIZE) {
    throw new Error("Файл больше 4 МБ. После подключения сервера лимит будет снят.");
  }
  const mimeType = asset.mimeType || "application/octet-stream";
  const uri = asset.base64
    ? asset.base64.startsWith("data:")
      ? asset.base64
      : `data:${mimeType};base64,${asset.base64}`
    : asset.uri;
  return {
    name: asset.name,
    uri,
    mimeType,
    size,
    addedAt: new Date().toISOString(),
  };
}
