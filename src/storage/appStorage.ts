import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../config/app';
import type { AppData } from '../types/domain';
import { normalizeAppData } from './migrations';

export const loadAppData = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeAppData(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveAppData = async (data: AppData) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeAppData(data)));
};
