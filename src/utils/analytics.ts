import type { PlannedPayment, Task, TaskStatus, Transaction } from '../types/domain';

export const buildCashflowSeries = (transactions: Transaction[], planned: PlannedPayment[]) => {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const paidExpenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const requiredPlan = planned
    .filter((item) => item.stage === 'required')
    .reduce((sum, item) => sum + item.amountMax, 0);

  const reservePlan = planned
    .filter((item) => item.stage === 'reserve')
    .reduce((sum, item) => sum + item.amountMax, 0);

  return [
    { label: 'Банк', value: income },
    { label: 'Факт', value: income - paidExpenses },
    { label: 'Обяз.', value: income - paidExpenses - requiredPlan },
    { label: 'Резерв', value: income - paidExpenses - requiredPlan - reservePlan },
  ];
};

export const buildScenarioRows = (transactions: Transaction[], planned: PlannedPayment[]) => {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const fixedExpenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
  const requiredMax = planned
    .filter((item) => item.stage === 'required')
    .reduce((sum, item) => sum + item.amountMax, 0);
  const reserveMax = planned
    .filter((item) => item.stage === 'reserve')
    .reduce((sum, item) => sum + item.amountMax, 0);

  return [
    {
      title: 'Только закрытые и обязательные',
      description: 'Доп, договор, перелет, учеба, документы, общага',
      value: income - fixedExpenses - requiredMax,
      tone: 'green' as const,
    },
    {
      title: 'С резервом на жизнь',
      description: 'Первые 2 месяца еды, транспорта, связи и мелочей',
      value: income - fixedExpenses - requiredMax - reserveMax,
      tone: 'accent' as const,
    },
    {
      title: 'Стресс +20 000 ₽',
      description: 'Если перелет/документы выйдут дороже плана',
      value: income - fixedExpenses - requiredMax - reserveMax - 20000,
      tone: 'amber' as const,
    },
  ];
};

export const buildTaskStatusShare = (tasks: Task[]) => {
  const statuses: TaskStatus[] = ['todo', 'progress', 'done'];
  return statuses.map((status) => ({
    label: status === 'todo' ? 'Todo' : status === 'progress' ? 'Progress' : 'Done',
    value: tasks.filter((task) => task.status === status).length,
  }));
};
