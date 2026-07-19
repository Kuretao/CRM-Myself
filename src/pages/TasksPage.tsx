import {
  Calendar,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Focus,
  KanbanSquare,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { DateTimePickerField } from "../components/ui/DateTimePickerField";
import { SelectField } from "../components/ui/SelectField";
import { Surface } from "../components/ui/Surface";
import { TextField } from "../components/ui/TextField";
import type { AppPalette } from "../theme/tokens";
import type { Task, TaskStatus } from "../types/domain";

type CreateOptions = {
  tag: string;
  priority: "low" | "medium" | "high";
  status: TaskStatus;
};
type Props = {
  colors: AppPalette;
  tasks: Task[];
  taskTitle: string;
  taskDue: string;
  taskTime: string;
  doneTasks: number;
  onChangeTaskTitle: (value: string) => void;
  onChangeTaskDue: (value: string) => void;
  onChangeTaskTime: (value: string) => void;
  onAddTask: (options: CreateOptions) => void;
  onToggleTask: (id: string) => void;
};
type TaskView = "board" | "list" | "focus";
type TaskFilter = "all" | TaskStatus;

const columns: { status: TaskStatus; title: string; hint: string }[] = [
  { status: "todo", title: "Нужно сделать", hint: "Новые и ожидающие" },
  { status: "progress", title: "В работе", hint: "Текущий фокус" },
  { status: "done", title: "Готово", hint: "Закрытые задачи" },
];
const views: { id: TaskView; label: string; icon: typeof List }[] = [
  { id: "board", label: "Доска", icon: KanbanSquare },
  { id: "list", label: "Список", icon: List },
  { id: "focus", label: "Фокус", icon: Focus },
];

export function TasksPage(props: Props) {
  const { width } = useWindowDimensions();
  const stacked = width < 1080;
  const mobile = width < 720;
  const styles = css(props.colors, stacked, mobile);
  const [view, setView] = useState<TaskView>("board");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [tag, setTag] = useState("личное");
  const [priority, setPriority] = useState<CreateOptions["priority"]>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const visibleTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return props.tasks.filter((task) => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesQuery = !normalized || `${task.title} ${task.tag} ${task.description || ""}`.toLowerCase().includes(normalized);
      const matchesView = view !== "focus" || task.status !== "done";
      return matchesFilter && matchesQuery && matchesView;
    });
  }, [filter, props.tasks, query, view]);

  const createTask = () => {
    if (!props.taskTitle.trim()) return;
    props.onAddTask({ tag, priority, status });
    setFormOpen(false);
  };
  const completion = props.tasks.length ? Math.round((props.doneTasks / props.tasks.length) * 100) : 0;

  return (
    <View style={styles.page}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.kicker}>PERSONAL OPERATIONS</Text>
          <Text style={styles.title}>Задачи</Text>
          <Text style={styles.sub}>Планируй, фильтруй и двигай работу по статусам без лишних окон.</Text>
        </View>
        <Pressable style={styles.primary} onPress={() => setFormOpen((current) => !current)}>
          {formOpen ? <X size={15} color={props.colors.text} /> : <Plus size={15} color={props.colors.text} />}
          <Text style={styles.primaryText}>{formOpen ? "Закрыть форму" : "Новая задача"}</Text>
        </Pressable>
      </View>

      <View style={styles.workspace}>
        <Surface colors={props.colors} style={styles.navigator}>
          <View style={styles.navHead}>
            <Sparkles size={16} color={props.colors.text} />
            <View>
              <Text style={styles.navTitle}>Рабочий план</Text>
              <Text style={styles.navMeta}>{props.doneTasks} из {props.tasks.length} завершено</Text>
            </View>
          </View>
          <View style={styles.progressBlock}>
            <View style={styles.progressTop}><Text style={styles.progressLabel}>Общий прогресс</Text><Text style={styles.progressValue}>{completion}%</Text></View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${completion}%` }]} /></View>
          </View>
          <Text style={styles.navGroupTitle}>ПРЕДСТАВЛЕНИЯ</Text>
          {views.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <Pressable key={item.id} style={[styles.navItem, active && styles.navItemOn]} onPress={() => setView(item.id)}>
                <View style={[styles.navIcon, active && styles.navIconOn]}><Icon size={15} color={active ? props.colors.text : props.colors.textFaint} /></View>
                <Text style={[styles.navLabel, active && styles.navLabelOn]}>{item.label}</Text>
                <ChevronRight size={13} color={props.colors.textFaint} />
              </Pressable>
            );
          })}
          <View style={styles.filterBlock}>
            <View style={styles.filterTitle}><SlidersHorizontal size={13} color={props.colors.textFaint} /><Text style={styles.navGroupTitle}>ФИЛЬТР ПО СТАТУСУ</Text></View>
            {(["all", "todo", "progress", "done"] as TaskFilter[]).map((item) => {
              const labels: Record<TaskFilter, string> = { all: "Все задачи", todo: "Нужно сделать", progress: "В работе", done: "Готово" };
              const count = item === "all" ? props.tasks.length : props.tasks.filter((task) => task.status === item).length;
              return (
                <Pressable key={item} style={styles.filterRow} onPress={() => setFilter(item)}>
                  <View style={[styles.radio, filter === item && styles.radioOn]}>{filter === item && <View style={styles.radioCore} />}</View>
                  <Text style={[styles.filterLabel, filter === item && styles.filterLabelOn]}>{labels[item]}</Text>
                  <Text style={styles.filterCount}>{count}</Text>
                </Pressable>
              );
            })}
          </View>
        </Surface>

        <View style={styles.main}>
          <Surface colors={props.colors} style={styles.toolbar}>
            <View style={styles.search}>
              <Search size={14} color={props.colors.textFaint} />
              <TextInput value={query} onChangeText={setQuery} placeholder="Найти задачу или тег" placeholderTextColor={props.colors.textFaint} style={styles.searchInput} />
              {!!query && <Pressable onPress={() => setQuery("")}><X size={13} color={props.colors.textFaint} /></Pressable>}
            </View>
            <View style={styles.viewSwitch}>
              {views.map((item) => {
                const Icon = item.icon;
                return <Pressable key={item.id} accessibilityLabel={item.label} style={[styles.viewButton, view === item.id && styles.viewButtonOn]} onPress={() => setView(item.id)}><Icon size={14} color={view === item.id ? props.colors.text : props.colors.textFaint} /></Pressable>;
              })}
            </View>
          </Surface>

          {formOpen && (
            <Surface colors={props.colors} style={styles.creator}>
              <View style={styles.creatorHead}><View><Text style={styles.creatorTitle}>Новая задача</Text><Text style={styles.creatorHint}>Название обязательно, остальные поля можно изменить позже.</Text></View><Pressable style={styles.closeButton} onPress={() => setFormOpen(false)}><X size={14} color={props.colors.textFaint} /></Pressable></View>
              <View style={styles.formRow}>
                <View style={styles.titleInput}><Text style={styles.fieldLabel}>НАЗВАНИЕ</Text><TextField colors={props.colors} value={props.taskTitle} onChangeText={props.onChangeTaskTitle} placeholder="Например, загрузить билеты в документы" /></View>
                <DateTimePickerField colors={props.colors} label="Срок и время" date={props.taskDue} time={props.taskTime} onChangeDate={props.onChangeTaskDue} onChangeTime={props.onChangeTaskTime} />
              </View>
              <View style={styles.formRow}>
                <SelectField colors={props.colors} label="Категория" value={tag} onChange={setTag} options={[{ label: "Личное", value: "личное", color: props.colors.accent }, { label: "Финансы", value: "финансы", color: props.colors.green }, { label: "Документы", value: "документы", color: props.colors.amber }, { label: "Переезд", value: "переезд", color: props.colors.blue }]} />
                <SelectField colors={props.colors} label="Приоритет" value={priority} onChange={setPriority} options={[{ label: "Низкий", value: "low" }, { label: "Обычный", value: "medium" }, { label: "Высокий", value: "high", color: props.colors.red }]} />
                <SelectField colors={props.colors} label="Начальный статус" value={status} onChange={setStatus} options={[{ label: "Нужно сделать", value: "todo" }, { label: "В работе", value: "progress" }, { label: "Готово", value: "done" }]} />
                <Pressable style={styles.createButton} onPress={createTask}><Plus size={14} color={props.colors.text} /><Text style={styles.createButtonText}>Создать задачу</Text></Pressable>
              </View>
            </Surface>
          )}

          {view === "board" && (
            <View style={styles.board}>
              {columns.map((column) => {
                const tasks = visibleTasks.filter((task) => task.status === column.status);
                return (
                  <View key={column.status} style={styles.column}>
                    <View style={styles.columnHead}><View><Text style={styles.columnTitle}>{column.title}</Text><Text style={styles.columnHint}>{column.hint}</Text></View><View style={styles.count}><Text style={styles.countText}>{tasks.length}</Text></View></View>
                    {tasks.map((task) => <TaskCard key={task.id} task={task} colors={props.colors} onNext={() => props.onToggleTask(task.id)} />)}
                    {!tasks.length && <View style={styles.emptyColumn}><Text style={styles.emptyColumnText}>В этой колонке пока пусто</Text></View>}
                  </View>
                );
              })}
            </View>
          )}

          {view === "list" && (
            <Surface colors={props.colors} style={styles.listTable}>
              <View style={styles.listHead}><Text style={[styles.th, styles.taskCell]}>ЗАДАЧА</Text><Text style={styles.th}>СТАТУС</Text><Text style={styles.th}>СРОК</Text><Text style={styles.th}>ПРИОРИТЕТ</Text><View style={styles.actionCell} /></View>
              {visibleTasks.map((task) => <TaskRow key={task.id} task={task} colors={props.colors} onNext={() => props.onToggleTask(task.id)} />)}
              {!visibleTasks.length && <Text style={styles.emptyText}>По текущим фильтрам задач нет.</Text>}
            </Surface>
          )}

          {view === "focus" && (
            <View style={styles.focusGrid}>
              <Surface colors={props.colors} style={styles.focusIntro}><Focus size={20} color={props.colors.accent} /><Text style={styles.focusTitle}>Текущий фокус</Text><Text style={styles.focusText}>Здесь только незавершённые задачи. Начни с высокого приоритета и двигай статус кнопкой справа.</Text></Surface>
              <View style={styles.focusList}>{visibleTasks.sort((a, b) => (a.priority === "high" ? -1 : b.priority === "high" ? 1 : 0)).map((task) => <TaskCard key={task.id} task={task} colors={props.colors} onNext={() => props.onToggleTask(task.id)} wide />)}</View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function TaskCard({ task, colors, onNext, wide }: { task: Task; colors: AppPalette; onNext: () => void; wide?: boolean }) {
  const styles = css(colors, false);
  return (
    <Surface colors={colors} style={[styles.card, wide && styles.cardWide]}>
      <View style={styles.cardTop}>
        <StatusIcon task={task} colors={colors} />
        <Text style={[styles.priority, task.priority === "high" && { color: colors.red }]}>{priorityLabel(task.priority)}</Text>
      </View>
      <Text style={styles.cardTitle}>{task.title}</Text>
      {!!task.description && <Text style={styles.cardDescription} numberOfLines={2}>{task.description}</Text>}
      <View style={styles.cardMeta}><View style={styles.tag}><Text style={styles.tagText}>{task.tag}</Text></View><View style={styles.date}><Calendar size={11} color={colors.textFaint} /><Text style={styles.dateText}>{task.due}{task.time ? ` · ${task.time}` : ""}</Text></View></View>
      <Pressable style={styles.nextButton} onPress={onNext}><Text style={styles.nextText}>{task.status === "done" ? "Вернуть в план" : task.status === "progress" ? "Завершить" : "Начать работу"}</Text><ChevronRight size={13} color={colors.textSoft} /></Pressable>
    </Surface>
  );
}
function TaskRow({ task, colors, onNext }: { task: Task; colors: AppPalette; onNext: () => void }) {
  const styles = css(colors, false);
  return <View style={styles.listRow}><View style={[styles.taskCell, styles.rowTask]}><StatusIcon task={task} colors={colors} /><View style={styles.rowCopy}><Text style={styles.rowTitle}>{task.title}</Text><Text style={styles.rowTag}>{task.tag}</Text></View></View><Text style={styles.cell}>{statusLabel(task.status)}</Text><Text style={styles.cell}>{task.due}{task.time ? ` · ${task.time}` : ""}</Text><Text style={[styles.cell, task.priority === "high" && { color: colors.red }]}>{priorityLabel(task.priority)}</Text><Pressable style={styles.actionCell} onPress={onNext}><ChevronRight size={14} color={colors.textSoft} /></Pressable></View>;
}
function StatusIcon({ task, colors }: { task: Task; colors: AppPalette }) {
  return task.status === "done" ? <Check size={15} color={colors.green} /> : task.status === "progress" ? <Clock3 size={15} color={colors.amber} /> : <Circle size={15} color={colors.textFaint} />;
}
const priorityLabel = (priority?: Task["priority"]) => priority === "high" ? "ВЫСОКИЙ" : priority === "low" ? "НИЗКИЙ" : "ОБЫЧНЫЙ";
const statusLabel = (status: TaskStatus) => status === "todo" ? "Нужно сделать" : status === "progress" ? "В работе" : "Готово";

const css = (colors: AppPalette, stacked: boolean, mobile = false) => StyleSheet.create({
  page: { width: "100%", paddingTop: 20, paddingBottom: 28, gap: 14 },
  heading: { flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "stretch" : "flex-end", gap: 16 },
  kicker: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
  title: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 5 },
  sub: { color: colors.textSoft, fontSize: 10, marginTop: 4 },
  primary: { width: mobile ? "100%" : undefined, height: 38, paddingHorizontal: 13, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  primaryText: { color: colors.text, fontSize: 9, fontWeight: "900" },
  workspace: { flexDirection: stacked ? "column" : "row", gap: 12, alignItems: "flex-start" },
  navigator: { width: stacked ? "100%" : 230, padding: 11 },
  navHead: { minHeight: 48, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  navTitle: { color: colors.text, fontSize: 10, fontWeight: "900" },
  navMeta: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  progressBlock: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  progressTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressLabel: { color: colors.textSoft, fontSize: 8, fontWeight: "800" },
  progressValue: { color: colors.text, fontSize: 9, fontWeight: "900" },
  progressTrack: { height: 4, marginTop: 8, borderRadius: 2, backgroundColor: colors.surfaceSoft, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2, backgroundColor: colors.green },
  navGroupTitle: { color: colors.textFaint, fontSize: 7, fontWeight: "900", marginTop: 12, marginBottom: 5 },
  navItem: { minHeight: 44, paddingHorizontal: 6, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, borderWidth: 1, borderColor: "transparent" },
  navItemOn: { backgroundColor: colors.surfaceSoft, borderColor: colors.border },
  navIcon: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  navIconOn: { backgroundColor: colors.surfaceSolid },
  navLabel: { flex: 1, color: colors.textSoft, fontSize: 9, fontWeight: "800" },
  navLabelOn: { color: colors.text },
  filterBlock: { marginTop: 10, paddingTop: 1, borderTopWidth: 1, borderTopColor: colors.border },
  filterTitle: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterRow: { height: 34, paddingHorizontal: 6, flexDirection: "row", alignItems: "center", gap: 8 },
  radio: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  radioOn: { borderColor: colors.accent },
  radioCore: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  filterLabel: { flex: 1, color: colors.textFaint, fontSize: 8 },
  filterLabelOn: { color: colors.text, fontWeight: "800" },
  filterCount: { color: colors.textFaint, fontSize: 8, fontWeight: "800" },
  main: { flex: 1, width: stacked ? "100%" : undefined, minWidth: 0, gap: 10 },
  toolbar: { minHeight: 50, padding: 7, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", justifyContent: "space-between", gap: 8 },
  search: { flex: mobile ? undefined : 1, width: mobile ? "100%" : undefined, maxWidth: mobile ? undefined : 400, height: 34, paddingHorizontal: 9, borderRadius: 7, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft, flexDirection: "row", alignItems: "center", gap: 7 },
  searchInput: { flex: 1, color: colors.text, fontSize: 9, outlineStyle: "none" } as any,
  viewSwitch: { width: mobile ? "100%" : undefined, height: 34, padding: 3, flexDirection: "row", borderRadius: 7, backgroundColor: colors.surfaceSoft },
  viewButton: { flex: mobile ? 1 : undefined, width: mobile ? undefined : 30, height: 28, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  viewButtonOn: { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border },
  creator: { padding: 14, gap: 12, zIndex: 70 },
  creatorHead: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  creatorTitle: { color: colors.text, fontSize: 12, fontWeight: "900" },
  creatorHint: { color: colors.textFaint, fontSize: 8, marginTop: 3 },
  closeButton: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  formRow: { flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "flex-end", gap: 9 },
  titleInput: { flex: 1, minWidth: 220 },
  fieldLabel: { color: colors.textFaint, fontSize: 7, fontWeight: "900", marginBottom: 5 },
  createButton: { width: mobile ? "100%" : undefined, height: 46, paddingHorizontal: 12, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.borderStrong },
  createButtonText: { color: colors.text, fontSize: 8, fontWeight: "900" },
  board: { width: "100%", flexDirection: stacked ? "column" : "row", gap: 10, alignItems: "stretch" },
  column: { flex: stacked ? undefined : 1, width: stacked ? "100%" : undefined, gap: 8, minWidth: 0 },
  columnHead: { minHeight: 48, paddingHorizontal: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  columnTitle: { color: colors.text, fontSize: 10, fontWeight: "900" },
  columnHint: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  count: { width: 24, height: 24, borderRadius: 7, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  countText: { color: colors.textSoft, fontSize: 8, fontWeight: "900" },
  card: { padding: 12, gap: 9 },
  cardWide: { minHeight: 150 },
  cardTop: { flexDirection: "row", justifyContent: "space-between" },
  priority: { color: colors.textFaint, fontSize: 7, fontWeight: "900" },
  cardTitle: { color: colors.text, fontSize: 11, fontWeight: "800", lineHeight: 16 },
  cardDescription: { color: colors.textSoft, fontSize: 8, lineHeight: 12 },
  cardMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 7 },
  tag: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5, backgroundColor: colors.accentSoft },
  tagText: { color: colors.textSoft, fontSize: 7, fontWeight: "900" },
  date: { flexDirection: "row", alignItems: "center", gap: 4, minWidth: 0 },
  dateText: { color: colors.textFaint, fontSize: 7 },
  nextButton: { height: 30, paddingHorizontal: 8, borderRadius: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSoft },
  nextText: { color: colors.textSoft, fontSize: 7, fontWeight: "900" },
  emptyColumn: { minHeight: 76, borderRadius: 8, borderWidth: 1, borderStyle: "dashed", borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  emptyColumnText: { color: colors.textFaint, fontSize: 8 },
  listTable: { padding: 11 },
  listHead: { display: mobile ? "none" : "flex", minHeight: 34, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", borderRadius: 7, backgroundColor: colors.surfaceSoft },
  th: { flex: 1, color: colors.textFaint, fontSize: 7, fontWeight: "900" },
  taskCell: { flex: 1.5 },
  actionCell: { width: mobile ? "100%" : 34, height: 34, alignItems: mobile ? "flex-end" : "center", justifyContent: "center" },
  listRow: { minHeight: 58, paddingHorizontal: 8, paddingVertical: mobile ? 9 : 0, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", gap: mobile ? 7 : 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowTask: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowCopy: { flex: 1, minWidth: 0 },
  rowTitle: { color: colors.text, fontSize: 9, fontWeight: "800" },
  rowTag: { color: colors.textFaint, fontSize: 7, marginTop: 2 },
  cell: { flex: mobile ? undefined : 1, color: colors.textSoft, fontSize: 8 },
  emptyText: { color: colors.textFaint, fontSize: 8, textAlign: "center", padding: 28 },
  focusGrid: { flexDirection: stacked ? "column" : "row", gap: 10, alignItems: "flex-start" },
  focusIntro: { width: stacked ? "100%" : 230, padding: 15 },
  focusTitle: { color: colors.text, fontSize: 13, fontWeight: "900", marginTop: 12 },
  focusText: { color: colors.textSoft, fontSize: 8, lineHeight: 13, marginTop: 5 },
  focusList: { flex: 1, width: stacked ? "100%" : undefined, gap: 8 },
});
