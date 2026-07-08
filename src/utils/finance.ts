import type { PlannedPayment, Task, Transaction } from '../types/domain';

export const calculateTotals = (transactions: Transaction[], planned: PlannedPayment[], tasks: Task[]) => {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const fixedExpenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
  const activePlanned = planned.filter((item) => item.status === 'planned');
  const plannedExpenseMin = activePlanned
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amountMin, 0);
  const plannedExpenseMax = activePlanned
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amountMax, 0);
  const plannedIncomeMin = activePlanned
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amountMin, 0);
  const plannedIncomeMax = activePlanned
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amountMax, 0);
  const doneTasks = tasks.filter((item) => item.status === 'done').length;

  return {
    income,
    fixedExpenses,
    plannedMin: plannedExpenseMin - plannedIncomeMax,
    plannedMax: plannedExpenseMax - plannedIncomeMin,
    leftMin: income + plannedIncomeMin - fixedExpenses - plannedExpenseMax,
    leftMax: income + plannedIncomeMax - fixedExpenses - plannedExpenseMin,
    doneTasks,
    taskProgress: tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0,
  };
};

export const groupExpensesByCategory = (transactions: Transaction[], planned: PlannedPayment[]) => {
  const rows = [
    ...transactions.filter((item) => item.type === 'expense'),
    ...planned.filter((item) => item.type === 'expense' && item.status === 'planned').map((item) => ({
      id: item.id,
      title: item.title,
      amount: (item.amountMin + item.amountMax) / 2,
      type: 'expense' as const,
      category: item.category,
      date: item.due,
    })),
  ];

  const map = rows.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};
