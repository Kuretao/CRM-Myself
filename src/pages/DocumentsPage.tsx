import {
  AlertTriangle,
  Check,
  FilePlus2,
  FolderLock,
  Search,
  Trash2,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { DateTimePickerField } from "../components/ui/DateTimePickerField";
import { SelectField } from "../components/ui/SelectField";
import { Surface } from "../components/ui/Surface";
import { TextField } from "../components/ui/TextField";
import { loadDocuments, saveDocuments } from "../features/documents/storage";
import type {
  DocumentCategory,
  DocumentStatus,
  PersonalDocument,
} from "../features/documents/types";
import type { AppPalette } from "../theme/tokens";

const statusOptions = [
  { value: "missing", label: "Нет документа" },
  { value: "preparing", label: "В процессе" },
  { value: "ready", label: "Готов" },
  { value: "expired", label: "Просрочен" },
] as const;
const categoryOptions = [
  { value: "travel", label: "Поездка" },
  { value: "study", label: "Учёба" },
  { value: "housing", label: "Жильё" },
  { value: "health", label: "Здоровье" },
  { value: "finance", label: "Финансы" },
] as const;

export function DocumentsPage({ colors }: { colors: AppPalette }) {
  const s = css(colors);
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | DocumentStatus>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<DocumentStatus>("preparing");
  const [category, setCategory] = useState<DocumentCategory>("travel");
  const [expiresAt, setExpiresAt] = useState("31.07.2026");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadDocuments()
      .then(setDocuments)
      .finally(() => setLoaded(true));
  }, []);
  useEffect(() => {
    if (loaded) saveDocuments(documents).catch(() => undefined);
  }, [documents, loaded]);

  const filtered = useMemo(
    () =>
      documents.filter((item) => {
        const matchesStatus = filter === "all" || item.status === filter;
        const text =
          `${item.title} ${item.contact} ${item.location} ${item.note}`.toLowerCase();
        return matchesStatus && text.includes(query.toLowerCase());
      }),
    [documents, filter, query],
  );
  const ready = documents.filter((item) => item.status === "ready").length;
  const risks = documents.filter(
    (item) => item.status === "missing" || item.status === "expired",
  ).length;

  const addDocument = () => {
    if (!title.trim()) return;
    setDocuments((current) => [
      {
        id: `doc-${Date.now()}`,
        title: title.trim(),
        category,
        status,
        expiresAt,
        contact,
        location,
        note: "",
      },
      ...current,
    ]);
    setTitle("");
    setContact("");
    setLocation("");
    setFormOpen(false);
  };

  return (
    <View style={s.page}>
      <View style={s.heading}>
        <View>
          <Text style={s.kicker}>PERSONAL CRM · SECURE INDEX</Text>
          <Text style={s.title}>Документы</Text>
          <Text style={s.sub}>
            Сроки, статусы и контакты по переезду в одном месте.
          </Text>
        </View>
        <Pressable
          style={s.primary}
          onPress={() => setFormOpen((value) => !value)}
        >
          <FilePlus2 size={15} color="#03101F" />
          <Text style={s.primaryText}>Добавить</Text>
        </Pressable>
      </View>
      <View style={s.metrics}>
        <Metric
          colors={colors}
          icon={FolderLock}
          label="Всего документов"
          value={documents.length}
          tone={colors.accent}
        />
        <Metric
          colors={colors}
          icon={Check}
          label="Полностью готовы"
          value={ready}
          tone={colors.green}
        />
        <Metric
          colors={colors}
          icon={AlertTriangle}
          label="Требуют внимания"
          value={risks}
          tone={colors.red}
        />
      </View>
      {formOpen && (
        <Surface colors={colors} style={s.form}>
          <View style={s.formRow}>
            <View style={s.grow}>
              <Text style={s.fieldLabel}>Название</Text>
              <TextField
                colors={colors}
                value={title}
                onChangeText={setTitle}
                placeholder="Например, справка 086/у"
              />
            </View>
            <SelectField
              colors={colors}
              label="Категория"
              value={category}
              options={[...categoryOptions]}
              onChange={setCategory}
            />
            <SelectField
              colors={colors}
              label="Статус"
              value={status}
              options={[...statusOptions]}
              onChange={setStatus}
            />
          </View>
          <View style={s.formRow}>
            <DateTimePickerField
              colors={colors}
              label="Действует до"
              date={expiresAt}
              onChangeDate={setExpiresAt}
              showTime={false}
            />
            <View style={s.grow}>
              <Text style={s.fieldLabel}>Контакт</Text>
              <TextField
                colors={colors}
                value={contact}
                onChangeText={setContact}
                placeholder="Организация или человек"
              />
            </View>
            <View style={s.grow}>
              <Text style={s.fieldLabel}>Где хранится</Text>
              <TextField
                colors={colors}
                value={location}
                onChangeText={setLocation}
                placeholder="Оригинал / облако / папка"
              />
            </View>
            <Pressable style={s.save} onPress={addDocument}>
              <Check size={15} color="#03101F" />
              <Text style={s.saveText}>Сохранить</Text>
            </Pressable>
          </View>
        </Surface>
      )}
      <Surface colors={colors} style={s.workspace}>
        <View style={s.toolbar}>
          <View style={s.search}>
            <Search size={14} color={colors.textFaint} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Найти документ или контакт"
              placeholderTextColor={colors.textFaint}
              style={s.searchInput}
            />
          </View>
          <View style={s.filters}>
            {(["all", "ready", "preparing", "missing", "expired"] as const).map(
              (value) => (
                <Pressable
                  key={value}
                  onPress={() => setFilter(value)}
                  style={[s.filter, filter === value && s.filterOn]}
                >
                  <Text
                    style={[s.filterText, filter === value && s.filterTextOn]}
                  >
                    {value === "all"
                      ? "Все"
                      : statusOptions.find((item) => item.value === value)
                          ?.label}
                  </Text>
                </Pressable>
              ),
            )}
          </View>
        </View>
        <View style={s.tableHead}>
          <Text style={[s.th, { flex: 1.5 }]}>ДОКУМЕНТ</Text>
          <Text style={s.th}>КАТЕГОРИЯ</Text>
          <Text style={s.th}>СТАТУС</Text>
          <Text style={s.th}>ДЕЙСТВУЕТ ДО</Text>
          <Text style={s.th}>КОНТАКТ / ХРАНЕНИЕ</Text>
          <View style={{ width: 30 }} />
        </View>
        {filtered.map((item) => (
          <View key={item.id} style={s.row}>
            <View style={{ flex: 1.5 }}>
              <Text style={s.docTitle}>{item.title}</Text>
              <Text style={s.note}>{item.note || "Без заметки"}</Text>
            </View>
            <Text style={s.cell}>
              {categoryOptions.find((x) => x.value === item.category)?.label}
            </Text>
            <Pressable
              style={{ flex: 1 }}
              onPress={() =>
                setDocuments((current) =>
                  current.map((doc) =>
                    doc.id === item.id
                      ? {
                          ...doc,
                          status:
                            doc.status === "ready" ? "preparing" : "ready",
                        }
                      : doc,
                  ),
                )
              }
            >
              <Text
                style={[s.badge, { color: statusColor(item.status, colors) }]}
              >
                {statusOptions.find((x) => x.value === item.status)?.label}
              </Text>
            </Pressable>
            <Text style={s.cell}>{item.expiresAt}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.cellStrong}>{item.contact || "—"}</Text>
              <Text style={s.note}>{item.location || "Место не указано"}</Text>
            </View>
            <Pressable
              style={s.delete}
              onPress={() =>
                setDocuments((current) =>
                  current.filter((doc) => doc.id !== item.id),
                )
              }
            >
              <Trash2 size={14} color={colors.textFaint} />
            </Pressable>
          </View>
        ))}
        {!filtered.length && (
          <Text style={s.empty}>По выбранному фильтру документов нет.</Text>
        )}
      </Surface>
    </View>
  );
}

function Metric({
  colors,
  icon: Icon,
  label,
  value,
  tone,
}: {
  colors: AppPalette;
  icon: typeof FolderLock;
  label: string;
  value: number;
  tone: string;
}) {
  const s = css(colors);
  return (
    <Surface colors={colors} style={s.metric}>
      <View style={[s.metricIcon, { backgroundColor: `${tone}22` }]}>
        <Icon size={17} color={tone} />
      </View>
      <View>
        <Text style={s.metricValue}>{value}</Text>
        <Text style={s.metricLabel}>{label}</Text>
      </View>
    </Surface>
  );
}
const statusColor = (status: DocumentStatus, c: AppPalette) =>
  status === "ready" ? c.green : status === "preparing" ? c.amber : c.red;
const css = (c: AppPalette) =>
  StyleSheet.create({
    page: { paddingTop: 22, paddingBottom: 30, gap: 12 },
    heading: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    kicker: { color: c.textFaint, fontSize: 8, fontWeight: "900" },
    title: { color: c.text, fontSize: 25, fontWeight: "800", marginTop: 5 },
    sub: { color: c.textSoft, fontSize: 10, marginTop: 4 },
    primary: {
      height: 38,
      paddingHorizontal: 14,
      borderRadius: 8,
      backgroundColor: c.accent,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    primaryText: { color: "#03101F", fontSize: 9, fontWeight: "900" },
    metrics: { flexDirection: "row", gap: 10 },
    metric: {
      flex: 1,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    metricIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    metricValue: { color: c.text, fontSize: 17, fontWeight: "900" },
    metricLabel: { color: c.textFaint, fontSize: 8, marginTop: 2 },
    form: { padding: 14, gap: 10 },
    formRow: { flexDirection: "row", gap: 9, alignItems: "flex-end" },
    grow: { flex: 1 },
    fieldLabel: {
      color: c.textFaint,
      fontSize: 8,
      fontWeight: "700",
      marginBottom: 5,
    },
    save: {
      height: 46,
      paddingHorizontal: 13,
      borderRadius: 8,
      backgroundColor: c.accent,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    saveText: { color: "#03101F", fontSize: 8, fontWeight: "900" },
    workspace: { padding: 14 },
    toolbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 12,
    },
    search: {
      width: 260,
      height: 36,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceSoft,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    searchInput: {
      flex: 1,
      color: c.text,
      fontSize: 9,
      outlineStyle: "none",
    } as any,
    filters: { flexDirection: "row", gap: 4 },
    filter: {
      height: 34,
      paddingHorizontal: 10,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 7,
    },
    filterOn: { backgroundColor: c.accentSoft },
    filterText: { color: c.textFaint, fontSize: 8, fontWeight: "700" },
    filterTextOn: { color: c.accent },
    tableHead: {
      minHeight: 34,
      paddingHorizontal: 9,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.surfaceSolid,
      borderRadius: 7,
    },
    th: { flex: 1, color: c.textFaint, fontSize: 7, fontWeight: "900" },
    row: {
      minHeight: 62,
      paddingHorizontal: 9,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    docTitle: { color: c.text, fontSize: 10, fontWeight: "800" },
    note: { color: c.textFaint, fontSize: 7, marginTop: 3 },
    cell: { flex: 1, color: c.textSoft, fontSize: 8 },
    cellStrong: { color: c.text, fontSize: 8, fontWeight: "700" },
    badge: { alignSelf: "flex-start", fontSize: 8, fontWeight: "900" },
    delete: {
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    empty: {
      color: c.textFaint,
      textAlign: "center",
      padding: 30,
      fontSize: 9,
    },
  });
