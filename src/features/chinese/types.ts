export type LanguageCode = "ru" | "en" | "zh";
export type VocabularyItem = {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  russian: string;
  hsk: 1 | 2 | 3;
  radical: string;
  strokes: number;
  example: { zh: string; pinyin: string; en: string; ru: string };
};
export type ChineseLesson = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  duration: number;
  icon: string;
  theory: string[];
  vocabularyIds: string[];
  phrases: { zh: string; pinyin: string; en: string; ru: string }[];
  exercise: { prompt: string; answer: string };
};
export type RadicalItem = {
  number: number;
  radical: string;
  pinyin: string;
  meaningRu: string;
  meaningEn: string;
  strokes: number;
  examples: string;
};
