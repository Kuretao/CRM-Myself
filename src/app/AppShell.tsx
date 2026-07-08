import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Appearance, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { PIN_CODE } from '../config/app';
import { initialData, plannedPayments } from '../data/seed';
import { AppHeader } from '../components/layout/AppHeader';
import { Sidebar } from '../components/layout/Sidebar';
import { TabBar } from '../components/layout/TabBar';
import { Screen } from '../components/ui/Screen';
import { LockScreen } from '../pages/LockScreen';
import { FinancePage } from '../pages/FinancePage';
import { OverviewPage } from '../pages/OverviewPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TasksPage } from '../pages/TasksPage';
import { loadAppData, saveAppData } from '../storage/appStorage';
import { getPalette } from '../theme/tokens';
import type { AppData, MoneyType, TabName, Task, ThemeName, Transaction } from '../types/domain';
import { buildCashflowSeries, buildScenarioRows, buildTaskStatusShare } from '../utils/analytics';
import { calculateTotals, groupExpensesByCategory } from '../utils/finance';

export function AppShell() {
  const systemTheme = Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
  const [data, setData] = useState<AppData>({ ...initialData, themeName: systemTheme as ThemeName });
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<TabName>('overview');
  const [taskTitle, setTaskTitle] = useState('');
  const [transactionTitle, setTransactionTitle] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState<MoneyType>('expense');
  const { width } = useWindowDimensions();

  const isDesktop = width >= 980;
  const colors = useMemo(() => getPalette(data.themeName), [data.themeName]);
  const styles = useMemo(() => createStyles(), []);

  useEffect(() => {
    loadAppData()
      .then((saved) => {
        if (!saved) return;
        setData((current) => ({
          ...current,
          ...saved,
          profile: { ...current.profile, ...saved.profile },
          tasks: saved.tasks?.length ? saved.tasks : current.tasks,
          transactions: saved.transactions?.length ? saved.transactions : current.transactions,
        }));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    saveAppData(data).catch(() => undefined);
  }, [data]);

  const totals = useMemo(
    () => calculateTotals(data.transactions, plannedPayments, data.tasks),
    [data.tasks, data.transactions],
  );

  const chartItems = useMemo(
    () => groupExpensesByCategory(data.transactions, plannedPayments),
    [data.transactions],
  );

  const cashflow = useMemo(
    () => buildCashflowSeries(data.transactions, plannedPayments),
    [data.transactions],
  );

  const scenarios = useMemo(
    () => buildScenarioRows(data.transactions, plannedPayments),
    [data.transactions],
  );

  const taskShare = useMemo(() => buildTaskStatusShare(data.tasks), [data.tasks]);

  const handlePinSubmit = () => {
    if (pin === PIN_CODE) {
      setUnlocked(true);
      setPin('');
      setPinError('');
      return;
    }
    setPinError('Код не подошел');
    setPin('');
  };

  const toggleTheme = () => {
    setData((current) => ({
      ...current,
      themeName: current.themeName === 'dark' ? 'light' : 'dark',
    }));
  };

  const addTask = () => {
    const title = taskTitle.trim();
    if (!title) return;
    const task: Task = {
      id: `task-${Date.now()}`,
      title,
      due: 'без даты',
      tag: 'личное',
      status: 'todo',
    };
    setData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
    setTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== id) return task;
        if (task.status === 'todo') return { ...task, status: 'progress' };
        if (task.status === 'progress') return { ...task, status: 'done' };
        return { ...task, status: 'todo' };
      }),
    }));
  };

  const addTransaction = () => {
    const title = transactionTitle.trim();
    const amount = Number(transactionAmount.replace(',', '.'));
    if (!title || !Number.isFinite(amount) || amount <= 0) return;

    const transaction: Transaction = {
      id: `tr-${Date.now()}`,
      title,
      amount,
      type: transactionType,
      category: transactionType === 'income' ? 'новый доход' : 'новый расход',
      date: 'сегодня',
    };

    setData((current) => ({ ...current, transactions: [transaction, ...current.transactions] }));
    setTransactionTitle('');
    setTransactionAmount('');
  };

  const resetData = () => {
    setData({ ...initialData, themeName: data.themeName });
    setActiveTab('overview');
  };

  const page = (
    <>
      {activeTab === 'overview' && (
        <OverviewPage colors={colors} profile={data.profile} totals={totals} planned={plannedPayments} />
      )}
      {activeTab === 'finance' && (
        <FinancePage
          colors={colors}
          transactions={data.transactions}
          chartItems={chartItems}
          transactionTitle={transactionTitle}
          transactionAmount={transactionAmount}
          transactionType={transactionType}
          onChangeTitle={setTransactionTitle}
          onChangeAmount={setTransactionAmount}
          onChangeType={setTransactionType}
          onAddTransaction={addTransaction}
        />
      )}
      {activeTab === 'reports' && (
        <ReportsPage
          colors={colors}
          cashflow={cashflow}
          expenseShare={chartItems}
          taskShare={taskShare}
          scenarios={scenarios}
        />
      )}
      {activeTab === 'tasks' && (
        <TasksPage
          colors={colors}
          tasks={data.tasks}
          taskTitle={taskTitle}
          doneTasks={totals.doneTasks}
          onChangeTaskTitle={setTaskTitle}
          onAddTask={addTask}
          onToggleTask={toggleTask}
        />
      )}
      {activeTab === 'profile' && <ProfilePage colors={colors} profile={data.profile} />}
      {activeTab === 'settings' && (
        <SettingsPage
          colors={colors}
          themeName={data.themeName}
          onToggleTheme={toggleTheme}
          onResetData={resetData}
        />
      )}
    </>
  );

  if (!unlocked) {
    return (
      <>
        <StatusBar style={data.themeName === 'dark' ? 'light' : 'dark'} />
        <LockScreen
          colors={colors}
          pin={pin}
          error={pinError}
          onChangePin={(value) => {
            setPin(value);
            setPinError('');
          }}
          onSubmit={handlePinSubmit}
        />
      </>
    );
  }

  if (isDesktop) {
    return (
      <>
        <StatusBar style={data.themeName === 'dark' ? 'light' : 'dark'} />
        <Screen colors={colors} scroll={false} padded={false}>
          <View style={styles.desktopShell}>
            <Sidebar colors={colors} activeTab={activeTab} profile={data.profile} onChangeTab={setActiveTab} />
            <ScrollView contentContainerStyle={styles.desktopContent} showsVerticalScrollIndicator={false}>
              <AppHeader colors={colors} themeName={data.themeName} onToggleTheme={toggleTheme} />
              {page}
            </ScrollView>
          </View>
        </Screen>
      </>
    );
  }

  return (
    <>
      <StatusBar style={data.themeName === 'dark' ? 'light' : 'dark'} />
      <Screen colors={colors}>
        <AppHeader colors={colors} themeName={data.themeName} onToggleTheme={toggleTheme} />
        <TabBar colors={colors} activeTab={activeTab} onChangeTab={setActiveTab} />
        {page}
      </Screen>
    </>
  );
}

const createStyles = () =>
  StyleSheet.create({
    desktopShell: {
      flex: 1,
      flexDirection: 'row',
    },
    desktopContent: {
      width: '100%',
      maxWidth: 1180,
      alignSelf: 'center',
      paddingHorizontal: 28,
      paddingBottom: 42,
    },
  });
