import { Calendar, Check, Circle, Clock3, Plus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/ui/Button";
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
  onChangeTaskTitle: (v: string) => void;
  onChangeTaskDue: (v: string) => void;
  onChangeTaskTime: (v: string) => void;
  onAddTask: (options: CreateOptions) => void;
  onToggleTask: (id: string) => void;
};
const columns: { status: TaskStatus; title: string; hint: string }[] = [
  { status: "todo", title: "Нужно сделать", hint: "Новые и ожидающие" },
  { status: "progress", title: "В работе", hint: "Текущий фокус" },
  { status: "done", title: "Готово", hint: "Закрытые задачи" },
];

export function TasksPage(p: Props) {
  const s = css(p.colors);
  const [tag, setTag] = useState("личное");
  const [priority, setPriority] = useState<CreateOptions["priority"]>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const create = () => p.onAddTask({ tag, priority, status });
  return (
    <View style={s.page}>
      <View style={s.head}>
        <View>
          <Text style={s.kicker}>PERSONAL OPERATIONS</Text>
          <Text style={s.title}>Задачи</Text>
          <Text style={s.sub}>
            {p.doneTasks} из {p.tasks.length} закрыто · нажми карточку, чтобы
            сменить статус
          </Text>
        </View>
        <Button
          colors={p.colors}
          label="Создать задачу"
          icon={<Plus size={15} color="#03101F" />}
          onPress={create}
        />
      </View>
      <Surface colors={p.colors} style={s.creator}>
        <View style={s.titleInput}>
          <TextField
            colors={p.colors}
            value={p.taskTitle}
            onChangeText={p.onChangeTaskTitle}
            placeholder="Что нужно сделать?"
          />
        </View>
        <DateTimePickerField
          colors={p.colors}
          label="Срок и время"
          date={p.taskDue}
          time={p.taskTime}
          onChangeDate={p.onChangeTaskDue}
          onChangeTime={p.onChangeTaskTime}
        />
        <SelectField
          colors={p.colors}
          label="Категория"
          value={tag}
          onChange={setTag}
          options={[
            { label: "Личное", value: "личное", color: p.colors.accent },
            { label: "Финансы", value: "финансы", color: p.colors.green },
            { label: "Документы", value: "документы", color: p.colors.amber },
            { label: "Переезд", value: "переезд", color: p.colors.blue },
          ]}
        />
        <SelectField
          colors={p.colors}
          label="Приоритет"
          value={priority}
          onChange={setPriority}
          options={[
            { label: "Низкий", value: "low" },
            { label: "Обычный", value: "medium" },
            { label: "Высокий", value: "high", color: p.colors.red },
          ]}
        />
        <SelectField
          colors={p.colors}
          label="Статус"
          value={status}
          onChange={setStatus}
          options={[
            { label: "Нужно сделать", value: "todo" },
            { label: "В работе", value: "progress" },
            { label: "Готово", value: "done" },
          ]}
        />
        <Pressable style={s.add} onPress={create}>
          <Plus size={17} color="#03101F" />
        </Pressable>
      </Surface>
      <View style={s.board}>
        {columns.map((column) => (
          <View key={column.status} style={s.column}>
            <View style={s.columnHead}>
              <View>
                <Text style={s.columnTitle}>{column.title}</Text>
                <Text style={s.columnHint}>{column.hint}</Text>
              </View>
              <View style={s.count}>
                <Text style={s.countText}>
                  {
                    p.tasks.filter((task) => task.status === column.status)
                      .length
                  }
                </Text>
              </View>
            </View>
            {p.tasks
              .filter((task) => task.status === column.status)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  colors={p.colors}
                  onPress={() => p.onToggleTask(task.id)}
                />
              ))}
          </View>
        ))}
      </View>
    </View>
  );
}
function TaskCard({
  task,
  colors,
  onPress,
}: {
  task: Task;
  colors: AppPalette;
  onPress: () => void;
}) {
  const s = css(colors);
  return (
    <Pressable onPress={onPress}>
      <Surface colors={colors} style={s.card}>
        <View style={s.cardTop}>
          {task.status === "done" ? (
            <Check size={15} color={colors.green} />
          ) : task.status === "progress" ? (
            <Clock3 size={15} color={colors.amber} />
          ) : (
            <Circle size={15} color={colors.textFaint} />
          )}
          <Text
            style={[
              s.priority,
              task.priority === "high" && { color: colors.red },
            ]}
          >
            {task.priority === "high"
              ? "ВЫСОКИЙ"
              : task.priority === "low"
                ? "НИЗКИЙ"
                : "ОБЫЧНЫЙ"}
          </Text>
        </View>
        <Text style={s.cardTitle}>{task.title}</Text>
        <View style={s.cardFoot}>
          <View style={s.tag}>
            <Text style={s.tagText}>{task.tag}</Text>
          </View>
          <View style={s.date}>
            <Calendar size={11} color={colors.textFaint} />
            <Text style={s.dateText}>
              {task.due}
              {task.time ? ` · ${task.time}` : ""}
            </Text>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}
const css = (c: AppPalette) =>
  StyleSheet.create({
    page: { paddingTop: 22, gap: 14 },
    head: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    kicker: { color: c.textFaint, fontSize: 9, fontWeight: "800" },
    title: { color: c.text, fontSize: 25, fontWeight: "700", marginTop: 5 },
    sub: { color: c.textSoft, fontSize: 11, marginTop: 4 },
    creator: {
      padding: 8,
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      zIndex: 60,
    },
    titleInput: { flex: 1, minWidth: 180 },
    add: {
      width: 46,
      height: 46,
      borderRadius: 8,
      backgroundColor: c.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    board: {
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-start",
      zIndex: 1,
    },
    column: { flex: 1, gap: 9 },
    columnHead: {
      height: 48,
      paddingHorizontal: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    columnTitle: { color: c.text, fontSize: 12, fontWeight: "800" },
    columnHint: { color: c.textFaint, fontSize: 9, marginTop: 2 },
    count: {
      width: 25,
      height: 25,
      borderRadius: 7,
      backgroundColor: c.surfaceSolid,
      alignItems: "center",
      justifyContent: "center",
    },
    countText: { color: c.textSoft, fontSize: 10, fontWeight: "800" },
    card: { padding: 13, gap: 11 },
    cardTop: { flexDirection: "row", justifyContent: "space-between" },
    priority: { color: c.textFaint, fontSize: 7, fontWeight: "900" },
    cardTitle: {
      color: c.text,
      fontSize: 12,
      fontWeight: "700",
      lineHeight: 17,
    },
    cardFoot: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tag: {
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 5,
      backgroundColor: c.accentSoft,
    },
    tagText: { color: c.accent, fontSize: 8, fontWeight: "800" },
    date: { flexDirection: "row", alignItems: "center", gap: 4 },
    dateText: { color: c.textFaint, fontSize: 8 },
  });
