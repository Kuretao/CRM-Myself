import { Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TextField } from '../components/ui/TextField';
import { TaskList } from '../features/tasks/components/TaskList';
import type { AppPalette } from '../theme/tokens';
import type { Task } from '../types/domain';

type TasksPageProps = {
  colors: AppPalette;
  tasks: Task[];
  taskTitle: string;
  doneTasks: number;
  onChangeTaskTitle: (value: string) => void;
  onAddTask: () => void;
  onToggleTask: (id: string) => void;
};

export function TasksPage({
  colors,
  tasks,
  taskTitle,
  doneTasks,
  onChangeTaskTitle,
  onAddTask,
  onToggleTask,
}: TasksPageProps) {
  const styles = createStyles();
  return (
    <>
      <SectionHeader colors={colors} title="Задачи" subtitle={`${doneTasks} из ${tasks.length} закрыто`} />
      <View style={styles.formRow}>
        <View style={styles.input}>
          <TextField colors={colors} value={taskTitle} onChangeText={onChangeTaskTitle} placeholder="Новая задача" />
        </View>
        <Button colors={colors} label="" icon={<Plus color="#FFFFFF" size={20} />} onPress={onAddTask} />
      </View>
      <TaskList colors={colors} items={tasks} onToggle={onToggleTask} />
    </>
  );
}

const createStyles = () =>
  StyleSheet.create({
    formRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginBottom: 12,
    },
    input: {
      flex: 1,
    },
  });
