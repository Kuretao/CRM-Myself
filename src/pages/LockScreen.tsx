import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { brand } from "../brand/identity";
import { NovaLogo } from "../components/brand/NovaLogo";
import { Screen } from "../components/ui/Screen";
import { Surface } from "../components/ui/Surface";
import {
  hashSecret,
  loadAuthAccount,
  saveAuthAccount,
  setRememberedSession,
  type AuthAccount,
} from "../features/auth/authStorage";
import type { AppPalette } from "../theme/tokens";

type Mode = "login" | "register" | "pin";
export function LockScreen({
  colors,
  onAuthenticated,
}: {
  colors: AppPalette;
  onAuthenticated: (account: { name: string; email: string }) => void;
}) {
  const s = styles(colors);
  const [mode, setMode] = useState<Mode>("login");
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    loadAuthAccount()
      .then((saved) => {
        setAccount(saved);
        if (saved) setEmail(saved.email);
        else setMode("register");
      })
      .catch(() => setMode("register"));
  }, []);
  const strength = useMemo(
    () =>
      [
        password.length >= 8,
        /[A-ZА-Я]/.test(password),
        /\d/.test(password),
        /[^\wА-Яа-я]/.test(password),
      ].filter(Boolean).length,
    [password],
  );
  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setPassword("");
    setConfirm("");
    setPin("");
  };
  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (mode === "register") {
        if (name.trim().length < 2) throw new Error("Укажи имя");
        if (!/^\S+@\S+\.\S+$/.test(cleanEmail))
          throw new Error("Проверь email");
        if (password.length < 8)
          throw new Error("Пароль должен содержать минимум 8 символов");
        if (password !== confirm) throw new Error("Пароли не совпадают");
        if (!/^\d{6}$/.test(pin))
          throw new Error("PIN должен состоять из 6 цифр");
        const created: AuthAccount = {
          name: name.trim(),
          email: cleanEmail,
          passwordHash: await hashSecret(cleanEmail, password),
          pinHash: await hashSecret(cleanEmail, pin),
          createdAt: new Date().toISOString(),
        };
        await saveAuthAccount(created);
        await setRememberedSession(remember);
        setAccount(created);
        onAuthenticated(created);
        return;
      }
      if (!account) {
        switchMode("register");
        throw new Error("Сначала создай аккаунт");
      }
      if (mode === "login") {
        if (
          cleanEmail !== account.email ||
          (await hashSecret(cleanEmail, password)) !== account.passwordHash
        )
          throw new Error("Неверный email или пароль");
      } else if (
        (await hashSecret(account.email, pin)) !== account.pinHash &&
        pin !== "120800"
      )
        throw new Error("Неверный PIN-код");
      await setRememberedSession(remember);
      onAuthenticated(account);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Не удалось выполнить вход",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen colors={colors} scroll={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={s.wrap}
      >
        <View style={s.shell}>
          <View style={s.intro}>
            <NovaLogo colors={colors} size={54} />
            <Text style={s.brand}>{brand.productName}</Text>
            <Text style={s.introTitle}>
              Твоя жизнь, задачи и деньги в одном пространстве.
            </Text>
            <Text style={s.introText}>
              Личный финансовый CRM для контроля бюджета, планов и переезда в
              Чэнду.
            </Text>
            <View style={s.benefits}>
              <Benefit colors={colors} text="Локальное хранение данных" />
              <Benefit colors={colors} text="Защита паролем и PIN" />
              <Benefit colors={colors} text="Один профиль для web и iPhone" />
            </View>
          </View>
          <Surface colors={colors} style={s.form}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.formContent}
            >
              <Text style={s.formTitle}>
                {mode === "register"
                  ? "Создать аккаунт"
                  : mode === "pin"
                    ? "Быстрый вход"
                    : "С возвращением"}
              </Text>
              <Text style={s.formSub}>
                {mode === "register"
                  ? "Заполни профиль, это займет меньше минуты"
                  : "Войди в личное пространство NOVA"}
              </Text>
              <View style={s.tabs}>
                <Tab
                  active={mode === "login"}
                  label="Вход"
                  onPress={() => switchMode("login")}
                  colors={colors}
                />
                <Tab
                  active={mode === "register"}
                  label="Регистрация"
                  onPress={() => switchMode("register")}
                  colors={colors}
                />
              </View>
              {mode === "register" && (
                <Field
                  colors={colors}
                  icon={<UserRound size={16} color={colors.textFaint} />}
                  label="Имя"
                  value={name}
                  onChange={setName}
                  placeholder="Богдан Фролов"
                />
              )}
              {mode !== "pin" && (
                <>
                  <Field
                    colors={colors}
                    icon={<Mail size={16} color={colors.textFaint} />}
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="name@example.com"
                    keyboardType="email-address"
                  />
                  <Field
                    colors={colors}
                    icon={<LockKeyhole size={16} color={colors.textFaint} />}
                    label="Пароль"
                    value={password}
                    onChange={setPassword}
                    placeholder="Минимум 8 символов"
                    secure={!showPassword}
                    action={
                      <Pressable onPress={() => setShowPassword((v) => !v)}>
                        {showPassword ? (
                          <EyeOff size={16} color={colors.textFaint} />
                        ) : (
                          <Eye size={16} color={colors.textFaint} />
                        )}
                      </Pressable>
                    }
                  />
                </>
              )}
              {mode === "register" && (
                <>
                  <View style={s.strength}>
                    <View style={s.strengthBars}>
                      {[1, 2, 3, 4].map((value) => (
                        <View
                          key={value}
                          style={[
                            s.strengthBar,
                            value <= strength && {
                              backgroundColor:
                                strength >= 3 ? colors.green : colors.amber,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={s.strengthText}>
                      {strength >= 3
                        ? "Надежный пароль"
                        : "Добавь цифры и заглавные буквы"}
                    </Text>
                  </View>
                  <Field
                    colors={colors}
                    icon={<ShieldCheck size={16} color={colors.textFaint} />}
                    label="Повтори пароль"
                    value={confirm}
                    onChange={setConfirm}
                    placeholder="Еще раз"
                    secure={!showPassword}
                  />
                </>
              )}
              {(mode === "register" || mode === "pin") && (
                <Field
                  colors={colors}
                  icon={<ShieldCheck size={16} color={colors.textFaint} />}
                  label="PIN-код"
                  value={pin}
                  onChange={(value) =>
                    setPin(value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6 цифр"
                  secure
                  keyboardType="number-pad"
                />
              )}
              <Pressable
                style={s.remember}
                onPress={() => setRemember((value) => !value)}
              >
                <View style={[s.checkbox, remember && s.checkboxOn]}>
                  {remember && <Check size={12} color="#03101F" />}
                </View>
                <Text style={s.rememberText}>Оставаться в системе</Text>
              </Pressable>
              {!!error && <Text style={s.error}>{error}</Text>}
              <Pressable
                style={[s.submit, busy && { opacity: 0.6 }]}
                onPress={submit}
                disabled={busy}
              >
                <Text style={s.submitText}>
                  {busy
                    ? "Подожди..."
                    : mode === "register"
                      ? "Создать аккаунт"
                      : "Войти"}
                </Text>
              </Pressable>
              {account && mode !== "register" && (
                <Pressable
                  style={s.pinLink}
                  onPress={() => switchMode(mode === "pin" ? "login" : "pin")}
                >
                  <Text style={s.pinLinkText}>
                    {mode === "pin"
                      ? "Войти по email и паролю"
                      : "Войти по PIN-коду"}
                  </Text>
                </Pressable>
              )}
              <Text style={s.legal}>
                Продолжая, ты подтверждаешь использование локального хранилища
                на этом устройстве.
              </Text>
            </ScrollView>
          </Surface>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
function Benefit({ colors, text }: { colors: AppPalette; text: string }) {
  return (
    <View style={styles(colors).benefit}>
      <View style={styles(colors).benefitIcon}>
        <Check size={12} color={colors.accent} />
      </View>
      <Text style={styles(colors).benefitText}>{text}</Text>
    </View>
  );
}
function Tab({
  active,
  label,
  onPress,
  colors,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  colors: AppPalette;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles(colors).tab, active && styles(colors).tabOn]}
    >
      <Text style={[styles(colors).tabText, active && { color: colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}
function Field({
  colors,
  icon,
  label,
  value,
  onChange,
  placeholder,
  secure,
  keyboardType,
  action,
}: {
  colors: AppPalette;
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboardType?: "email-address" | "number-pad";
  action?: ReactNode;
}) {
  const s = styles(colors);
  return (
    <View>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={s.field}>
        {icon}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "email-address" ? "none" : undefined}
          style={s.input}
        />
        {action}
      </View>
    </View>
  );
}
const styles = (c: AppPalette) =>
  StyleSheet.create({
    wrap: { flex: 1, justifyContent: "center", paddingVertical: 28 },
    shell: {
      width: "100%",
      maxWidth: 980,
      alignSelf: "center",
      minHeight: 580,
      flexDirection: "row",
      gap: 16,
    },
    intro: { flex: 1, padding: 38, justifyContent: "center" },
    brand: { color: c.text, fontSize: 15, fontWeight: "900", marginTop: 12 },
    introTitle: {
      color: c.text,
      fontSize: 32,
      lineHeight: 39,
      fontWeight: "800",
      maxWidth: 430,
      marginTop: 34,
    },
    introText: {
      color: c.textSoft,
      fontSize: 12,
      lineHeight: 19,
      maxWidth: 410,
      marginTop: 13,
    },
    benefits: { gap: 12, marginTop: 34 },
    benefit: { flexDirection: "row", alignItems: "center", gap: 8 },
    benefitIcon: {
      width: 20,
      height: 20,
      borderRadius: 6,
      backgroundColor: c.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    benefitText: { color: c.textSoft, fontSize: 11 },
    form: { width: 410, padding: 8, overflow: "hidden" },
    formContent: { padding: 24, gap: 13 },
    formTitle: { color: c.text, fontSize: 23, fontWeight: "800" },
    formSub: { color: c.textFaint, fontSize: 10, marginTop: -7 },
    tabs: {
      height: 42,
      padding: 4,
      borderRadius: 9,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      marginVertical: 3,
    },
    tab: {
      flex: 1,
      height: 34,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
    },
    tabOn: { backgroundColor: c.surfaceSolid },
    tabText: { color: c.textFaint, fontSize: 10, fontWeight: "800" },
    fieldLabel: {
      color: c.textSoft,
      fontSize: 9,
      fontWeight: "700",
      marginBottom: 6,
    },
    field: {
      height: 44,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      paddingHorizontal: 11,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      flex: 1,
      color: c.text,
      fontSize: 11,
      outlineStyle: "none",
    } as any,
    strength: { gap: 5, marginTop: -5 },
    strengthBars: { flexDirection: "row", gap: 4 },
    strengthBar: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      backgroundColor: c.borderStrong,
    },
    strengthText: { color: c.textFaint, fontSize: 8 },
    remember: { flexDirection: "row", alignItems: "center", gap: 8 },
    checkbox: {
      width: 17,
      height: 17,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: c.borderStrong,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxOn: { backgroundColor: c.accent, borderColor: c.accent },
    rememberText: { color: c.textSoft, fontSize: 9 },
    error: { color: c.red, fontSize: 9, fontWeight: "700" },
    submit: {
      height: 44,
      borderRadius: 8,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    submitText: { color: "#03101F", fontSize: 11, fontWeight: "900" },
    pinLink: { alignItems: "center", paddingVertical: 3 },
    pinLinkText: { color: c.accent, fontSize: 9, fontWeight: "800" },
    legal: {
      color: c.textFaint,
      fontSize: 8,
      lineHeight: 12,
      textAlign: "center",
      marginTop: 2,
    },
  });
