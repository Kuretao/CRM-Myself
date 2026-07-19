import {
  AlertCircle,
  Check,
  Clock3,
  Eye,
  FilePlus2,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Paperclip,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { DateTimePickerField } from "../components/ui/DateTimePickerField";
import { SelectField } from "../components/ui/SelectField";
import { Surface } from "../components/ui/Surface";
import { TextField } from "../components/ui/TextField";
import { DocumentPreview } from "../features/documents/components/DocumentPreview";
import { pickDocumentFile } from "../features/documents/filePicker";
import { loadDocuments, saveDocuments } from "../features/documents/storage";
import type { DocumentAttachment, DocumentCategory, DocumentStatus, PersonalDocument } from "../features/documents/types";
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
type CategoryFilter = "all" | DocumentCategory;
type StatusFilter = "all" | DocumentStatus;

export function DocumentsPage({ colors }: { colors: AppPalette }) {
  const { width } = useWindowDimensions();
  const stacked = width < 1080;
  const mobile = width < 720;
  const styles = css(colors, stacked, mobile);
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<PersonalDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<DocumentStatus>("preparing");
  const [category, setCategory] = useState<DocumentCategory>("travel");
  const [expiresAt, setExpiresAt] = useState("31.12.2026");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("NOVA Files");
  const [note, setNote] = useState("");
  const [attachment, setAttachment] = useState<DocumentAttachment | undefined>();

  useEffect(() => {
    loadDocuments().then(setDocuments).finally(() => setLoaded(true));
  }, []);
  useEffect(() => {
    if (loaded) saveDocuments(documents).catch(() => undefined);
  }, [documents, loaded]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return documents.filter((item) => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const text = `${item.title} ${item.contact} ${item.location} ${item.note} ${item.attachment?.name || ""}`.toLowerCase();
      return matchesCategory && matchesStatus && (!normalized || text.includes(normalized));
    });
  }, [categoryFilter, documents, query, statusFilter]);

  const attachFile = async (autoCreate = false) => {
    setUploading(true);
    setUploadError("");
    try {
      const file = await pickDocumentFile();
      if (!file) return;
      if (autoCreate) {
        const inferredCategory = categoryFilter === "all" ? "travel" : categoryFilter;
        const newDocument: PersonalDocument = {
          id: `doc-${Date.now()}`,
          title: file.name.replace(/\.[^.]+$/, ""),
          category: inferredCategory,
          status: "ready",
          expiresAt: "без срока",
          contact: "",
          location: "NOVA Files",
          note: "Загружено в хранилище",
          attachment: file,
        };
        setDocuments((current) => [newDocument, ...current]);
        setSelected(newDocument);
      } else {
        setAttachment(file);
        if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
        setStatus("ready");
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Не удалось загрузить файл.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setStatus("preparing");
    setCategory("travel");
    setExpiresAt("31.12.2026");
    setContact("");
    setLocation("NOVA Files");
    setNote("");
    setAttachment(undefined);
    setUploadError("");
  };
  const addDocument = () => {
    if (!title.trim()) return;
    setDocuments((current) => [{ id: `doc-${Date.now()}`, title: title.trim(), category, status, expiresAt, contact, location, note, attachment }, ...current]);
    resetForm();
    setFormOpen(false);
  };
  const ready = documents.filter((item) => item.status === "ready").length;
  const withFiles = documents.filter((item) => item.attachment).length;
  const risks = documents.filter((item) => item.status === "missing" || item.status === "expired").length;

  return (
    <View style={styles.page}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.kicker}>NOVA SECURE INDEX</Text>
          <Text style={styles.title}>Документы</Text>
          <Text style={styles.sub}>Загружай файлы, контролируй сроки и открывай вложения внутри платформы.</Text>
        </View>
        <View style={styles.headingActions}>
          <Pressable style={styles.secondary} onPress={() => { setFormOpen((current) => !current); setUploadError(""); }}><FilePlus2 size={14} color={colors.textSoft} /><Text style={styles.secondaryText}>{formOpen ? "Закрыть форму" : "Новая запись"}</Text></Pressable>
          <Pressable style={styles.primary} onPress={() => attachFile(true)} disabled={uploading}><Upload size={14} color={colors.text} /><Text style={styles.primaryText}>{uploading ? "Загрузка..." : "Загрузить файл"}</Text></Pressable>
        </View>
      </View>
      {!!uploadError && <View style={styles.errorBar}><AlertCircle size={14} color={colors.red} /><Text style={styles.errorText}>{uploadError}</Text><Pressable onPress={() => setUploadError("")}><X size={13} color={colors.red} /></Pressable></View>}

      <View style={styles.workspace}>
        <Surface colors={colors} style={styles.navigator}>
          <View style={styles.navHead}><FolderOpen size={16} color={colors.text} /><View><Text style={styles.navTitle}>Личный архив</Text><Text style={styles.navMeta}>{withFiles} файлов в хранилище</Text></View></View>
          <View style={styles.storageCard}><View style={styles.storageTop}><Text style={styles.storageLabel}>Готовность архива</Text><Text style={styles.storageValue}>{documents.length ? Math.round((ready / documents.length) * 100) : 0}%</Text></View><View style={styles.storageTrack}><View style={[styles.storageFill, { width: `${documents.length ? Math.round((ready / documents.length) * 100) : 0}%` }]} /></View></View>
          <Text style={styles.navGroupTitle}>КАТЕГОРИИ</Text>
          <CategoryRow colors={colors} active={categoryFilter === "all"} label="Все документы" count={documents.length} onPress={() => setCategoryFilter("all")} />
          {categoryOptions.map((item) => <CategoryRow key={item.value} colors={colors} active={categoryFilter === item.value} label={item.label} count={documents.filter((document) => document.category === item.value).length} onPress={() => setCategoryFilter(item.value)} />)}
          <View style={styles.statusBlock}>
            <Text style={styles.navGroupTitle}>СОСТОЯНИЕ</Text>
            <StatusSummary colors={colors} icon={Check} label="Готово" value={ready} tone={colors.green} />
            <StatusSummary colors={colors} icon={AlertCircle} label="Требуют внимания" value={risks} tone={colors.red} />
            <StatusSummary colors={colors} icon={Paperclip} label="С вложениями" value={withFiles} tone={colors.accent} />
          </View>
          <View style={styles.securityNote}><ShieldCheck size={16} color={colors.green} /><View style={styles.navCopy}><Text style={styles.securityTitle}>Локальное хранение</Text><Text style={styles.securityText}>Файлы остаются в приложении до подключения сервера.</Text></View></View>
        </Surface>

        <View style={styles.main}>
          <Surface colors={colors} style={styles.toolbar}>
            <View style={styles.search}><Search size={14} color={colors.textFaint} /><TextInput value={query} onChangeText={setQuery} placeholder="Найти документ, файл или контакт" placeholderTextColor={colors.textFaint} style={styles.searchInput} />{!!query && <Pressable onPress={() => setQuery("")}><X size={13} color={colors.textFaint} /></Pressable>}</View>
            <View style={styles.filters}>{(["all", "ready", "preparing", "missing", "expired"] as StatusFilter[]).map((item) => <Pressable key={item} style={[styles.filter, statusFilter === item && styles.filterOn]} onPress={() => setStatusFilter(item)}><Text style={[styles.filterText, statusFilter === item && styles.filterTextOn]}>{item === "all" ? "Все" : statusOptions.find((option) => option.value === item)?.label}</Text></Pressable>)}</View>
          </Surface>

          {formOpen && (
            <Surface colors={colors} style={styles.form}>
              <View style={styles.formHead}><View><Text style={styles.formTitle}>Карточка документа</Text><Text style={styles.formHint}>Можно создать напоминание без файла или сразу прикрепить оригинал.</Text></View><Pressable style={styles.closeButton} onPress={() => { setFormOpen(false); resetForm(); }}><X size={14} color={colors.textFaint} /></Pressable></View>
              <View style={styles.formRow}>
                <View style={styles.grow}><Text style={styles.fieldLabel}>НАЗВАНИЕ</Text><TextField colors={colors} value={title} onChangeText={setTitle} placeholder="Например, авиабилеты в Чэнду" /></View>
                <SelectField colors={colors} label="Категория" value={category} options={[...categoryOptions]} onChange={setCategory} />
                <SelectField colors={colors} label="Статус" value={status} options={[...statusOptions]} onChange={setStatus} />
              </View>
              <View style={styles.formRow}>
                <DateTimePickerField colors={colors} label="Действует до" date={expiresAt} onChangeDate={setExpiresAt} showTime={false} />
                <View style={styles.grow}><Text style={styles.fieldLabel}>КОНТАКТ</Text><TextField colors={colors} value={contact} onChangeText={setContact} placeholder="Организация или человек" /></View>
                <View style={styles.grow}><Text style={styles.fieldLabel}>ХРАНЕНИЕ</Text><TextField colors={colors} value={location} onChangeText={setLocation} placeholder="NOVA Files / оригинал" /></View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.grow}><Text style={styles.fieldLabel}>ЗАМЕТКА</Text><TextField colors={colors} value={note} onChangeText={setNote} placeholder="Номер, комментарий или следующий шаг" /></View>
                <Pressable style={styles.attachButton} onPress={() => attachFile(false)} disabled={uploading}><Paperclip size={14} color={colors.textSoft} /><View><Text style={styles.attachTitle}>{attachment ? attachment.name : "Прикрепить файл"}</Text><Text style={styles.attachMeta}>{attachment ? formatSize(attachment.size) : "PDF, изображение, DOCX"}</Text></View></Pressable>
                <Pressable style={styles.saveButton} onPress={addDocument}><Check size={14} color={colors.text} /><Text style={styles.saveText}>Сохранить</Text></Pressable>
              </View>
            </Surface>
          )}

          <Surface colors={colors} style={styles.table}>
            <View style={styles.tableHead}><Text style={[styles.th, styles.documentCell]}>ДОКУМЕНТ</Text><Text style={styles.th}>КАТЕГОРИЯ</Text><Text style={styles.th}>СТАТУС</Text><Text style={styles.th}>СРОК</Text><Text style={styles.th}>ФАЙЛ</Text><View style={styles.actionsCell} /></View>
            {filtered.map((item) => (
              <View key={item.id} style={styles.row}>
                <Pressable style={[styles.documentCell, styles.documentInfo]} onPress={() => item.attachment && setSelected(item)}>
                  <View style={styles.typeIcon}>{item.attachment?.mimeType.startsWith("image/") ? <ImageIcon size={15} color={colors.textSoft} /> : <FileText size={15} color={colors.textSoft} />}</View>
                  <View style={styles.navCopy}><Text style={styles.documentTitle} numberOfLines={1}>{item.title}</Text><Text style={styles.note} numberOfLines={1}>{item.note || item.contact || "Без заметки"}</Text></View>
                </Pressable>
                <Text style={styles.cell}>{categoryOptions.find((option) => option.value === item.category)?.label}</Text>
                <Pressable style={styles.cellPressable} onPress={() => setDocuments((current) => current.map((document) => document.id === item.id ? { ...document, status: document.status === "ready" ? "preparing" : "ready" } : document))}><View style={[styles.statusDot, { backgroundColor: statusColor(item.status, colors) }]} /><Text style={[styles.cellStrong, { color: statusColor(item.status, colors) }]}>{statusOptions.find((option) => option.value === item.status)?.label}</Text></Pressable>
                <View style={styles.cellPressable}><Clock3 size={12} color={colors.textFaint} /><Text style={styles.cell}>{item.expiresAt}</Text></View>
                <Pressable style={styles.fileCell} onPress={() => item.attachment && setSelected(item)} disabled={!item.attachment}><Paperclip size={12} color={item.attachment ? colors.accent : colors.textFaint} /><View style={styles.navCopy}><Text style={[styles.cellStrong, !item.attachment && { color: colors.textFaint }]} numberOfLines={1}>{item.attachment?.name || "Без файла"}</Text>{item.attachment && <Text style={styles.note}>{formatSize(item.attachment.size)}</Text>}</View></Pressable>
                <View style={styles.actionsCell}>{item.attachment && <Pressable accessibilityLabel="Открыть документ" style={styles.rowAction} onPress={() => setSelected(item)}><Eye size={14} color={colors.textSoft} /></Pressable>}<Pressable accessibilityLabel="Удалить документ" style={styles.rowAction} onPress={() => setDocuments((current) => current.filter((document) => document.id !== item.id))}><Trash2 size={14} color={colors.textFaint} /></Pressable></View>
              </View>
            ))}
            {!filtered.length && <View style={styles.empty}><FileText size={24} color={colors.textFaint} /><Text style={styles.emptyTitle}>Документы не найдены</Text><Text style={styles.emptyText}>Измени фильтр или загрузи новый файл.</Text></View>}
          </Surface>
        </View>
      </View>
      <DocumentPreview colors={colors} document={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

function CategoryRow({ colors, active, label, count, onPress }: { colors: AppPalette; active: boolean; label: string; count: number; onPress: () => void }) {
  const styles = css(colors, false);
  return <Pressable style={[styles.categoryRow, active && styles.categoryRowOn]} onPress={onPress}><FolderOpen size={14} color={active ? colors.text : colors.textFaint} /><Text style={[styles.categoryLabel, active && styles.categoryLabelOn]}>{label}</Text><Text style={styles.categoryCount}>{count}</Text></Pressable>;
}
function StatusSummary({ colors, icon: Icon, label, value, tone }: { colors: AppPalette; icon: typeof Check; label: string; value: number; tone: string }) {
  const styles = css(colors, false);
  return <View style={styles.summaryRow}><Icon size={13} color={tone} /><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>;
}
const statusColor = (status: DocumentStatus, colors: AppPalette) => status === "ready" ? colors.green : status === "preparing" ? colors.amber : colors.red;
const formatSize = (size: number) => size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} МБ` : `${Math.max(1, Math.round(size / 1024))} КБ`;

const css = (colors: AppPalette, stacked: boolean, mobile = false) => StyleSheet.create({
  page: { width: "100%", paddingTop: 20, paddingBottom: 28, gap: 14 },
  heading: { flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "stretch" : "flex-end", gap: 16 },
  kicker: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
  title: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 5 },
  sub: { color: colors.textSoft, fontSize: 10, marginTop: 4 },
  headingActions: { width: mobile ? "100%" : undefined, flexDirection: "row", gap: 8 },
  primary: { flex: mobile ? 1 : undefined, height: 38, paddingHorizontal: 13, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.accentSoft },
  primaryText: { color: colors.text, fontSize: 9, fontWeight: "900" },
  secondary: { flex: mobile ? 1 : undefined, height: 38, paddingHorizontal: 12, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  secondaryText: { color: colors.textSoft, fontSize: 9, fontWeight: "800" },
  errorBar: { minHeight: 38, paddingHorizontal: 11, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: `${colors.red}66`, backgroundColor: `${colors.red}14` },
  errorText: { flex: 1, color: colors.red, fontSize: 8, fontWeight: "800" },
  workspace: { flexDirection: stacked ? "column" : "row", gap: 12, alignItems: "flex-start" },
  navigator: { width: stacked ? "100%" : 230, padding: 11 },
  navHead: { minHeight: 48, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  navTitle: { color: colors.text, fontSize: 10, fontWeight: "900" },
  navMeta: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  navCopy: { flex: 1, minWidth: 0 },
  storageCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  storageTop: { flexDirection: "row", justifyContent: "space-between" },
  storageLabel: { color: colors.textSoft, fontSize: 8, fontWeight: "800" },
  storageValue: { color: colors.text, fontSize: 9, fontWeight: "900" },
  storageTrack: { height: 4, marginTop: 8, borderRadius: 2, backgroundColor: colors.surfaceSoft, overflow: "hidden" },
  storageFill: { height: "100%", borderRadius: 2, backgroundColor: colors.green },
  navGroupTitle: { color: colors.textFaint, fontSize: 7, fontWeight: "900", marginTop: 12, marginBottom: 5 },
  categoryRow: { height: 36, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 7, borderWidth: 1, borderColor: "transparent" },
  categoryRowOn: { backgroundColor: colors.surfaceSoft, borderColor: colors.border },
  categoryLabel: { flex: 1, color: colors.textSoft, fontSize: 8, fontWeight: "800" },
  categoryLabelOn: { color: colors.text },
  categoryCount: { color: colors.textFaint, fontSize: 8, fontWeight: "900" },
  statusBlock: { marginTop: 10, paddingTop: 1, borderTopWidth: 1, borderTopColor: colors.border },
  summaryRow: { height: 32, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 7 },
  summaryLabel: { flex: 1, color: colors.textSoft, fontSize: 8 },
  summaryValue: { color: colors.text, fontSize: 8, fontWeight: "900" },
  securityNote: { marginTop: 10, minHeight: 60, padding: 9, borderRadius: 8, flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: colors.surfaceSoft },
  securityTitle: { color: colors.text, fontSize: 8, fontWeight: "900" },
  securityText: { color: colors.textFaint, fontSize: 7, lineHeight: 11, marginTop: 3 },
  main: { flex: 1, width: stacked ? "100%" : undefined, minWidth: 0, gap: 10 },
  toolbar: { minHeight: 50, padding: 7, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", justifyContent: "space-between", gap: 8 },
  search: { flex: mobile ? undefined : 1, width: mobile ? "100%" : undefined, maxWidth: mobile ? undefined : 390, height: 34, paddingHorizontal: 9, borderRadius: 7, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft, flexDirection: "row", alignItems: "center", gap: 7 },
  searchInput: { flex: 1, color: colors.text, fontSize: 9, outlineStyle: "none" } as any,
  filters: { flexDirection: "row", flexWrap: mobile ? "wrap" : "nowrap", gap: 3 },
  filter: { height: 30, paddingHorizontal: 8, borderRadius: 6, justifyContent: "center" },
  filterOn: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border },
  filterText: { color: colors.textFaint, fontSize: 7, fontWeight: "800" },
  filterTextOn: { color: colors.text },
  form: { padding: 14, gap: 11, zIndex: 70 },
  formHead: { flexDirection: "row", justifyContent: "space-between" },
  formTitle: { color: colors.text, fontSize: 12, fontWeight: "900" },
  formHint: { color: colors.textFaint, fontSize: 8, marginTop: 3 },
  closeButton: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  formRow: { flexDirection: mobile ? "column" : "row", gap: 9, alignItems: mobile ? "stretch" : "flex-end" },
  grow: { flex: 1, minWidth: 0 },
  fieldLabel: { color: colors.textFaint, fontSize: 7, fontWeight: "900", marginBottom: 5 },
  attachButton: { width: mobile ? "100%" : undefined, minWidth: mobile ? 0 : 210, height: 46, paddingHorizontal: 11, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft },
  attachTitle: { color: colors.text, fontSize: 8, fontWeight: "900", maxWidth: 165 },
  attachMeta: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  saveButton: { width: mobile ? "100%" : undefined, height: 46, paddingHorizontal: 13, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.accentSoft },
  saveText: { color: colors.text, fontSize: 8, fontWeight: "900" },
  table: { padding: 11 },
  tableHead: { display: mobile ? "none" : "flex", minHeight: 34, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", borderRadius: 7, backgroundColor: colors.surfaceSoft },
  th: { flex: 1, color: colors.textFaint, fontSize: 7, fontWeight: "900" },
  documentCell: { flex: mobile ? undefined : 1.45, width: mobile ? "100%" : undefined },
  row: { minHeight: 64, paddingHorizontal: 8, paddingVertical: mobile ? 10 : 0, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", gap: mobile ? 8 : 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  documentInfo: { flexDirection: "row", alignItems: "center", gap: 8 },
  typeIcon: { width: 30, height: 30, borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSoft },
  documentTitle: { color: colors.text, fontSize: 9, fontWeight: "900" },
  note: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  cell: { flex: mobile ? undefined : 1, color: colors.textSoft, fontSize: 8 },
  cellStrong: { color: colors.text, fontSize: 8, fontWeight: "800" },
  cellPressable: { flex: mobile ? undefined : 1, minHeight: mobile ? 22 : undefined, flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  fileCell: { flex: mobile ? undefined : 1, minHeight: mobile ? 24 : undefined, flexDirection: "row", alignItems: "center", gap: 7 },
  actionsCell: { width: mobile ? "100%" : 66, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  rowAction: { width: 30, height: 30, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  empty: { padding: 36, alignItems: "center" },
  emptyTitle: { color: colors.text, fontSize: 10, fontWeight: "900", marginTop: 9 },
  emptyText: { color: colors.textFaint, fontSize: 8, marginTop: 3 },
});
