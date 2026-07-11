import AsyncStorage from "@react-native-async-storage/async-storage";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";

const ACCOUNT_KEY = "nova-auth-account-v1";
const SESSION_KEY = "nova-auth-session-v1";

export type AuthAccount = {
  name: string;
  email: string;
  passwordHash: string;
  pinHash: string;
  createdAt: string;
};
const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const hashSecret = (email: string, value: string) =>
  digestStringAsync(
    CryptoDigestAlgorithm.SHA256,
    `${normalizeEmail(email)}:${value}:nova-ledger`,
  );
export const loadAuthAccount = async (): Promise<AuthAccount | null> => {
  const raw = await AsyncStorage.getItem(ACCOUNT_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const saveAuthAccount = async (account: AuthAccount) =>
  AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
export const setRememberedSession = async (remember: boolean) =>
  remember
    ? AsyncStorage.setItem(SESSION_KEY, "active")
    : AsyncStorage.removeItem(SESSION_KEY);
export const hasRememberedSession = async () =>
  (await AsyncStorage.getItem(SESSION_KEY)) === "active";
export const clearAuthSession = async () =>
  AsyncStorage.removeItem(SESSION_KEY);
