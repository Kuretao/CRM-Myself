import { Check, Circle, Clock3 } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Surface } from "../../../components/ui/Surface";
import type { AppPalette } from "../../../theme/tokens";
import type { Task, TaskStatus } from "../../../types/domain";

type TaskListProps = {
  colors: AppPalette;
  items: Task[];
  onToggle: (id: string) => void;
};

const statusLabel: Record<TaskStatus, string> = {
  todo: "todo",
  progress: "in progress",
  done: "done",
};

export function TaskList({ colors, items, onToggle }: TaskListProps) {
  const styles = createStyles(colors);

  return (
    <Surface colors={colors}>
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          style={[styles.row, index < items.length - 1 && styles.divider]}
          onPress={() => onToggle(item.id)}
        >
          <View
            style={[styles.check, item.status === "done" && styles.doneCheck]}
          >
            {item.status === "done" ? (
              <Check color="#FFFFFF" size={16} />
            ) : item.status === "progress" ? (
              <Clock3 color={colors.amber} size={16} />
            ) : (
              <Circle color={colors.textFaint} size={16} />
            )}
          </View>
          <View style={styles.copy}>
            <Text
              style={[styles.title, item.status === "done" && styles.doneTitle]}
            >
              {item.title}
            </Text>
            <Text style={styles.meta}>
              {item.due}
              {item.time ? ` · ${item.time}` : ""} · {item.tag}
            </Text>
          </View>
          <Text
            style={[
              styles.status,
              item.status === "progress" && styles.progress,
              item.status === "done" && styles.done,
            ]}
          >
            {statusLabel[item.status]}
          </Text>
        </Pressable>
      ))}
    </Surface>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    row: {
      minHeight: 62,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    check: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.surfaceSoft,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    doneCheck: {
      backgroundColor: colors.green,
      borderColor: colors.green,
    },
    copy: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontWeight: "800",
      fontSize: 15,
    },
    doneTitle: {
      color: colors.textFaint,
      textDecorationLine: "line-through",
    },
    meta: {
      color: colors.textFaint,
      fontSize: 12,
      marginTop: 2,
    },
    status: {
      color: colors.textFaint,
      fontWeight: "800",
      fontSize: 11,
      textTransform: "uppercase",
    },
    progress: {
      color: colors.amber,
    },
    done: {
      color: colors.green,
    },
  });
