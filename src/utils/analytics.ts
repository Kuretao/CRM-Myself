import type { Account, PlannedPayment, Task, TaskStatus, Transaction } from "../types/domain";
import { isPaidTuitionPlan } from "./finance";

const currentRubBalance = (accounts: Account[]) =>
  accounts.reduce((sum, account) => {
    if (account.currency !== "RUB" || account.type === "debt") return sum;
    return sum + account.balance;
  }, 0);

const dateValue = (value: string) => {
  const match = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).getTime() : Number.MAX_SAFE_INTEGER;
};

const shortDue = (value: string) => {
  const match = value.match(/^(\d{1,2})\.(\d{1,2})\./);
  return match ? `${match[1]}.${match[2]}` : value;
};

export const buildCashflowSeries = (
  _transactions: Transaction[],
  planned: PlannedPayment[],
  accounts: Account[] = [],
) => {
  let balance = currentRubBalance(accounts);
  const series = [{ label: "Сейчас", value: balance }];
  [...planned]
    .filter((item) => item.status === "planned" && !isPaidTuitionPlan(item))
    .sort((a, b) => dateValue(a.due) - dateValue(b.due))
    .forEach((item) => {
      const amount = item.type === "income" ? item.amountMax : -item.amountMax;
      balance += amount;
      series.push({ label: shortDue(item.due), value: balance });
    });
  return series;
};

export const buildScenarioRows = (
  _transactions: Transaction[],
  planned: PlannedPayment[],
  accounts: Account[] = [],
) => {
  const balance = currentRubBalance(accounts);
  const active = planned.filter(
    (item) => item.status === "planned" && !isPaidTuitionPlan(item),
  );
  const incomeMin = active.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amountMin, 0);
  const incomeMax = active.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amountMax, 0);
  const expenseMin = active.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amountMin, 0);
  const expenseMax = active.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amountMax, 0);
  const expectedIncome = (incomeMin + incomeMax) / 2;
  const expectedExpenses = (expenseMin + expenseMax) / 2;

  return [
    {
      title: "Осторожный",
      description: "Без неподтверждённых подарочных денег, расходы по верхней границе",
      value: balance + incomeMin - expenseMax,
      tone: "amber" as const,
    },
    {
      title: "Ожидаемый",
      description: "Средняя оценка всех запланированных поступлений и расходов",
      value: balance + expectedIncome - expectedExpenses,
      tone: "accent" as const,
    },
    {
      title: "Верхняя граница",
      description: "Все ожидаемые поступления пришли, расходы остались по плану",
      value: balance + incomeMax - expenseMin,
      tone: "green" as const,
    },
  ];
};

export const buildTaskStatusShare = (tasks: Task[]) => {
  const statuses: TaskStatus[] = ["todo", "progress", "done"];
  return statuses.map((status) => ({
    label: status === "todo" ? "Todo" : status === "progress" ? "Progress" : "Done",
    value: tasks.filter((task) => task.status === status).length,
  }));
};
