import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialDocuments } from "./data";
import type { PersonalDocument } from "./types";

const KEY = "nova-documents-v1";

export async function loadDocuments() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return initialDocuments;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? (parsed as PersonalDocument[])
      : initialDocuments;
  } catch {
    return initialDocuments;
  }
}

export async function saveDocuments(documents: PersonalDocument[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(documents));
}
