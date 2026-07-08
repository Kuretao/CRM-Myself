import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../config/app';
import type { AppData } from '../types/domain';

export const loadAppData = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as Partial<AppData>;
};

export const saveAppData = async (data: AppData) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
