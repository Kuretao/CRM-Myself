import type { Account, PlannedPayment, Task, Transaction } from "../types/domain";

export const isPaidTuitionPlan = (item: PlannedPayment) => {
  const title = item.title.trim().toLowerCase();
  return (
    item.id === "plan-3" ||
    title === "учёба, первый семестр" ||
    title === "учеба, первый семестр" ||
    (title.includes("языковой год") &&
      (title.includes("первая половина") || title.includes("первый семестр")))
  );
};

export const isLegacyTuitionEstimate = (item: Transaction) => {
  const title = item.title.trim().toLowerCase().replaceAll("ё", "е");
  return (
    item.type === "expense" &&
    title.includes("языковой год") &&
    (title.includes("1 половина") || title.includes("первая половина"))
  );
};

export const calculateTotals = (
  transactions: Transaction[],
  planned: PlannedPayment[],
  tasks: Task[],
  accounts: Account[] = [],
) => {
  const income = transactions
    .filter((item) => item.type === "income" && !isLegacyTuitionEstimate(item))
    .reduce((sum, item) => sum + item.amount, 0);
  const fixedExpenses = transactions
    .filter((item) => item.type === "expense" && !isLegacyTuitionEstimate(item))
    .reduce((sum, item) => sum + item.amount, 0);
  const activePlanned = planned.filter(
    (item) => item.status === "planned" && !isPaidTuitionPlan(item),
  );
  const plannedExpenseMin = activePlanned
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amountMin, 0);
  const plannedExpenseMax = activePlanned
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amountMax, 0);
  const plannedIncomeMin = activePlanned
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amountMin, 0);
  const plannedIncomeMax = activePlanned
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amountMax, 0);
  const doneTasks = tasks.filter((item) => item.status === "done").length;
  const currentBalance = accounts.reduce((sum, account) => {
    if (account.currency !== "RUB" || account.type === "debt") return sum;
    return sum + account.balance;
  }, 0);

  return {
    currentBalance,
    income,
    fixedExpenses,
    plannedMin: plannedExpenseMin - plannedIncomeMax,
    plannedMax: plannedExpenseMax - plannedIncomeMin,
    leftMin: currentBalance + plannedIncomeMin - plannedExpenseMax,
    leftMax: currentBalance + plannedIncomeMax - plannedExpenseMin,
    doneTasks,
    taskProgress: tasks.length
      ? Math.round((doneTasks / tasks.length) * 100)
      : 0,
  };
};

export const groupExpensesByCategory = (
  transactions: Transaction[],
  planned: PlannedPayment[],
) => {
  const rows = [
    ...transactions.filter(
      (item) => item.type === "expense" && !isLegacyTuitionEstimate(item),
    ),
    ...planned
      .filter(
        (item) =>
          item.type === "expense" &&
          item.status === "planned" &&
          !isPaidTuitionPlan(item),
      )
      .map((item) => ({
        id: item.id,
        title: item.title,
        amount: (item.amountMin + item.amountMax) / 2,
        type: "expense" as const,
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
