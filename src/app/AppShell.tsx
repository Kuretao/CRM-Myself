import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Appearance, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { PIN_CODE } from '../config/app';
import { initialData } from '../data/seed';
import { AppHeader } from '../components/layout/AppHeader';
import { Sidebar } from '../components/layout/Sidebar';
import { TabBar } from '../components/layout/TabBar';
import { Screen } from '../components/ui/Screen';
import { AiPage } from '../pages/AiPage';
import { LockScreen } from '../pages/LockScreen';
import { FinancePage } from '../pages/FinancePage';
import { OverviewPage } from '../pages/OverviewPage';
import { PlanningPage } from '../pages/PlanningPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TasksPage } from '../pages/TasksPage';
import { loadAppData, saveAppData } from '../storage/appStorage';
import { getPalette } from '../theme/tokens';
import type { AiMessage, AppData, MoneyType, PlannedItem, TabName, Task, ThemeName, Transaction } from '../types/domain';
import { buildCashflowSeries, buildScenarioRows, buildTaskStatusShare } from '../utils/analytics';
import { calculateTotals, groupExpensesByCategory } from '../utils/finance';

export function AppShell() {
  const systemTheme = Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
  const [data, setData] = useState<AppData>({ ...initialData, themeName: systemTheme as ThemeName });
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<TabName>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [transactionTitle, setTransactionTitle] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState<MoneyType>('expense');
  const [plannedTitle, setPlannedTitle] = useState('');
  const [plannedAmount, setPlannedAmount] = useState('');
  const [plannedDue, setPlannedDue] = useState('');
  const [plannedType, setPlannedType] = useState<MoneyType>('expense');
  const [aiDraft, setAiDraft] = useState('');
  const { width } = useWindowDimensions();

  const isDesktop = width >= 980;
  const isSidebarCollapsed = sidebarCollapsed || width < 1180;
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
          accounts: saved.accounts?.length ? saved.accounts : current.accounts,
          categories: saved.categories?.length ? saved.categories : current.categories,
          tasks: saved.tasks?.length ? saved.tasks : current.tasks,
          transactions: saved.transactions?.length ? saved.transactions : current.transactions,
          plannedItems: saved.plannedItems?.length ? saved.plannedItems : current.plannedItems,
          aiThreads: saved.aiThreads?.length ? saved.aiThreads : current.aiThreads,
        }));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    saveAppData(data).catch(() => undefined);
  }, [data]);

  const totals = useMemo(
    () => calculateTotals(data.transactions, data.plannedItems, data.tasks),
    [data.plannedItems, data.tasks, data.transactions],
  );

  const chartItems = useMemo(
    () => groupExpensesByCategory(data.transactions, data.plannedItems),
    [data.plannedItems, data.transactions],
  );

  const cashflow = useMemo(
    () => buildCashflowSeries(data.transactions, data.plannedItems),
    [data.plannedItems, data.transactions],
  );

  const scenarios = useMemo(
    () => buildScenarioRows(data.transactions, data.plannedItems),
    [data.plannedItems, data.transactions],
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
      due: taskDue.trim() || 'без даты',
      time: taskTime.trim() || undefined,
      tag: 'личное',
      priority: 'medium',
      status: 'todo',
    };
    setData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
    setTaskTitle('');
    setTaskDue('');
    setTaskTime('');
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
      accountId: data.accounts[0]?.id,
    };

    setData((current) => ({ ...current, transactions: [transaction, ...current.transactions] }));
    setTransactionTitle('');
    setTransactionAmount('');
  };

  const addPlannedItem = () => {
    const title = plannedTitle.trim();
    const amount = Number(plannedAmount.replace(',', '.'));
    if (!title || !Number.isFinite(amount) || amount <= 0) return;

    const plannedItem: PlannedItem = {
      id: `plan-${Date.now()}`,
      title,
      type: plannedType,
      amountMin: amount,
      amountMax: amount,
      due: plannedDue.trim() || 'без даты',
      category: plannedType === 'income' ? 'плановый доход' : 'плановый расход',
      stage: 'flexible',
      status: 'planned',
    };

    setData((current) => ({ ...current, plannedItems: [plannedItem, ...current.plannedItems] }));
    setPlannedTitle('');
    setPlannedAmount('');
    setPlannedDue('');
  };

  const markPlannedItemPaid = (id: string) => {
    const plannedItem = data.plannedItems.find((item) => item.id === id);
    if (!plannedItem) return;

    const transaction: Transaction = {
      id: `tr-${Date.now()}`,
      title: plannedItem.title,
      amount: plannedItem.amountMax,
      type: plannedItem.type,
      category: plannedItem.category,
      date: plannedItem.due,
      accountId: data.accounts[0]?.id,
      plannedItemId: plannedItem.id,
    };

    setData((current) => ({
      ...current,
      transactions: [transaction, ...current.transactions],
      plannedItems: current.plannedItems.map((item) =>
        item.id === id ? { ...item, status: 'paid' } : item,
      ),
    }));
  };

  const sendAiDraft = () => {
    const content = aiDraft.trim();
    if (!content) return;
    const now = new Date().toISOString();
    const userMessage: AiMessage = {
      id: `ai-msg-${Date.now()}`,
      role: 'user',
      content,
      createdAt: now,
    };
    const assistantMessage: AiMessage = {
      id: `ai-msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: 'AI-подключение еще не включено. Я сохраню этот запрос как контекст для будущего помощника.',
      createdAt: now,
    };

    setData((current) => {
      const [activeThread, ...restThreads] = current.aiThreads.length
        ? current.aiThreads
        : initialData.aiThreads;
      return {
        ...current,
        aiThreads: [
          {
            ...activeThread,
            updatedAt: now,
            messages: [...activeThread.messages, userMessage, assistantMessage],
          },
          ...restThreads,
        ],
      };
    });
    setAiDraft('');
  };

  const resetData = () => {
    setData({ ...initialData, themeName: data.themeName });
    setActiveTab('overview');
  };

  const page = (
    <>
      {activeTab === 'overview' && (
        <OverviewPage
          colors={colors}
          profile={data.profile}
          totals={totals}
          planned={data.plannedItems}
          aiDraft={aiDraft}
          onChangeAiDraft={setAiDraft}
          onSendAiDraft={sendAiDraft}
        />
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
      {activeTab === 'planning' && (
        <PlanningPage
          colors={colors}
          plannedItems={data.plannedItems}
          title={plannedTitle}
          amount={plannedAmount}
          due={plannedDue}
          type={plannedType}
          onChangeTitle={setPlannedTitle}
          onChangeAmount={setPlannedAmount}
          onChangeDue={setPlannedDue}
          onChangeType={setPlannedType}
          onAddPlannedItem={addPlannedItem}
          onMarkPlannedItemPaid={markPlannedItemPaid}
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
          taskDue={taskDue}
          taskTime={taskTime}
          doneTasks={totals.doneTasks}
          onChangeTaskTitle={setTaskTitle}
          onChangeTaskDue={setTaskDue}
          onChangeTaskTime={setTaskTime}
          onAddTask={addTask}
          onToggleTask={toggleTask}
        />
      )}
      {activeTab === 'ai' && (
        <AiPage
          colors={colors}
          threads={data.aiThreads}
          draft={aiDraft}
          onChangeDraft={setAiDraft}
          onSendDraft={sendAiDraft}
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
            <Sidebar
              colors={colors}
              activeTab={activeTab}
              profile={data.profile}
              collapsed={isSidebarCollapsed}
              onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
              onChangeTab={setActiveTab}
            />
            <ScrollView style={styles.desktopScroll} contentContainerStyle={styles.desktopContent} showsVerticalScrollIndicator={false}>
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
      <Screen colors={colors} scroll={false}>
        <AppHeader colors={colors} themeName={data.themeName} onToggleTheme={toggleTheme} />
        <ScrollView contentContainerStyle={styles.mobileContent} showsVerticalScrollIndicator={false}>
          {page}
        </ScrollView>
        <View style={styles.mobileTabWrap}>
          <TabBar colors={colors} activeTab={activeTab} onChangeTab={setActiveTab} />
        </View>
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
    desktopScroll: {
      flex: 1,
      height: '100%',
    },
    desktopContent: {
      width: '100%',
      maxWidth: 1440,
      alignSelf: 'center',
      minHeight: '100%',
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    mobileContent: {
      paddingBottom: 104,
    },
    mobileTabWrap: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 16,
    },
  });
