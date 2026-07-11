import type {
  PlannedPayment,
  Task,
  TaskStatus,
  Transaction,
} from "../types/domain";

export const buildCashflowSeries = (
  transactions: Transaction[],
  planned: PlannedPayment[],
) => {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const paidExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const activePlanned = planned.filter((item) => item.status === "planned");
  const plannedIncome = activePlanned
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amountMax, 0);
  const requiredPlan = activePlanned
    .filter((item) => item.type === "expense" && item.stage === "required")
    .reduce((sum, item) => sum + item.amountMax, 0);

  const reservePlan = activePlanned
    .filter((item) => item.type === "expense" && item.stage === "reserve")
    .reduce((sum, item) => sum + item.amountMax, 0);

  return [
    { label: "Банк", value: income },
    { label: "Факт", value: income - paidExpenses },
    { label: "План+", value: income + plannedIncome - paidExpenses },
    {
      label: "Обяз.",
      value: income + plannedIncome - paidExpenses - requiredPlan,
    },
    {
      label: "Резерв",
      value: income + plannedIncome - paidExpenses - requiredPlan - reservePlan,
    },
  ];
};

export const buildScenarioRows = (
  transactions: Transaction[],
  planned: PlannedPayment[],
) => {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const fixedExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const activePlanned = planned.filter((item) => item.status === "planned");
  const plannedIncomeMax = activePlanned
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amountMax, 0);
  const requiredMax = activePlanned
    .filter((item) => item.type === "expense" && item.stage === "required")
    .reduce((sum, item) => sum + item.amountMax, 0);
  const reserveMax = activePlanned
    .filter((item) => item.type === "expense" && item.stage === "reserve")
    .reduce((sum, item) => sum + item.amountMax, 0);
  const base = income + plannedIncomeMax - fixedExpenses;

  return [
    {
      title: "Только закрытые и обязательные",
      description: "Доп, договор, перелет, учеба, документы, общага",
      value: base - requiredMax,
      tone: "green" as const,
    },
    {
      title: "С резервом на жизнь",
      description: "Первые 2 месяца еды, транспорта, связи и мелочей",
      value: base - requiredMax - reserveMax,
      tone: "accent" as const,
    },
    {
      title: "Стресс +20 000 ₽",
      description: "Если перелет/документы выйдут дороже плана",
      value: base - requiredMax - reserveMax - 20000,
      tone: "amber" as const,
    },
  ];
};

export const buildTaskStatusShare = (tasks: Task[]) => {
  const statuses: TaskStatus[] = ["todo", "progress", "done"];
  return statuses.map((status) => ({
    label:
      status === "todo" ? "Todo" : status === "progress" ? "Progress" : "Done",
    value: tasks.filter((task) => task.status === status).length,
  }));
};
