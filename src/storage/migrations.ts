import { DATA_SCHEMA_VERSION } from "../config/app";
import {
  currentSnapshotTasks,
  currentSnapshotTransactions,
  defaultCategories,
  defaultPlannedItems,
  initialData,
} from "../data/seed";
import type {
  AppData,
  MoneyType,
  PlannedItem,
  Task,
  TaskStatus,
  ThemeName,
  Transaction,
} from "../types/domain";
import { isLegacyTuitionEstimate, isPaidTuitionPlan } from "../utils/finance";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const asString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;
const asNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;
const asArray = <T>(value: unknown, fallback: T[]) =>
  Array.isArray(value) ? value : fallback;
const asTheme = (value: unknown, fallback: ThemeName): ThemeName =>
  value === "light" || value === "dark" ? value : fallback;
const asMoneyType = (value: unknown, fallback: MoneyType): MoneyType =>
  value === "income" || value === "expense" ? value : fallback;
const asTaskStatus = (value: unknown, fallback: TaskStatus): TaskStatus =>
  value === "todo" || value === "progress" || value === "done" ? value : fallback;

const migratePlannedItem = (value: unknown, index: number): PlannedItem | null => {
  if (!isObject(value)) return null;
  const amountMin = asNumber(value.amountMin, NaN);
  const amountMax = asNumber(value.amountMax, amountMin);
  if (!Number.isFinite(amountMin) || !Number.isFinite(amountMax)) return null;
  const stage = value.stage === "required" || value.stage === "reserve" || value.stage === "flexible" ? value.stage : "flexible";
  const status = value.status === "planned" || value.status === "paid" || value.status === "skipped" ? value.status : "planned";
  return {
    id: asString(value.id, `plan-${Date.now()}-${index}`),
    title: asString(value.title, "Плановая операция"),
    type: asMoneyType(value.type, "expense"),
    amountMin,
    amountMax,
    due: asString(value.due, "без даты"),
    category: asString(value.category, "план"),
    stage,
    status,
    note: typeof value.note === "string" ? value.note : undefined,
  };
};

const migrateTask = (value: unknown, index: number): Task => {
  if (!isObject(value)) return initialData.tasks[index] || initialData.tasks[0];
  return {
    id: asString(value.id, `task-${Date.now()}-${index}`),
    title: asString(value.title, "Новая задача"),
    due: asString(value.due, "без даты"),
    time: typeof value.time === "string" ? value.time : undefined,
    tag: asString(value.tag, "личное"),
    description: typeof value.description === "string" ? value.description : undefined,
    priority: value.priority === "low" || value.priority === "medium" || value.priority === "high" ? value.priority : "medium",
    status: asTaskStatus(value.status, "todo"),
  };
};

const migrateTransaction = (value: unknown, index: number): Transaction => {
  if (!isObject(value)) return initialData.transactions[index] || initialData.transactions[0];
  return {
    id: asString(value.id, `tr-${Date.now()}-${index}`),
    title: asString(value.title, "Операция"),
    amount: Math.max(0, asNumber(value.amount, 0)),
    type: asMoneyType(value.type, "expense"),
    category: asString(value.category, "прочее"),
    date: asString(value.date, "без даты"),
    accountId: typeof value.accountId === "string" ? value.accountId : undefined,
    note: typeof value.note === "string" ? value.note : undefined,
    plannedItemId: typeof value.plannedItemId === "string" ? value.plannedItemId : undefined,
  };
};

const oldPlanIds = new Set(["plan-1", "plan-2", "plan-3", "plan-4", "plan-5", "plan-6"]);
[
  "snapshot-plan-dentist",
  "snapshot-plan-flight-hotel",
  "snapshot-plan-advance",
  "snapshot-plan-dorm",
  "snapshot-plan-birthday",
  "snapshot-plan-side-job",
  "snapshot-plan-salary",
  "snapshot-plan-income-september",
  "snapshot-plan-visa",
  "snapshot-plan-insurance",
].forEach((id) => oldPlanIds.add(id));
const oldTaskIds = new Set(["task-1", "task-2", "task-3", "task-4"]);
const oldTransactionIds = new Set(["tr-1", "tr-2", "tr-3", "tr-4", "tr-5", "tr-6"]);

export const normalizeAppData = (raw: unknown): AppData => {
  if (!isObject(raw)) return initialData;
  const sourceVersion = asNumber(raw.schemaVersion, 1);
  const upgradingSnapshot = sourceVersion < DATA_SCHEMA_VERSION;
  const profile = isObject(raw.profile) ? raw.profile : {};

  const rawPlannedItems = asArray(raw.plannedItems, [])
    .map(migratePlannedItem)
    .filter(Boolean)
    .filter((item) => !isPaidTuitionPlan(item as PlannedItem)) as PlannedItem[];
  const plannedItems = upgradingSnapshot
    ? [
        ...defaultPlannedItems,
        ...rawPlannedItems.filter(
          (item) =>
            !oldPlanIds.has(item.id) &&
            !defaultPlannedItems.some((snapshot) => snapshot.id === item.id),
        ),
      ]
    : rawPlannedItems.length
      ? rawPlannedItems
      : defaultPlannedItems;

  const rawTasks = asArray(raw.tasks, initialData.tasks).map(migrateTask);
  const tasks = upgradingSnapshot
    ? [
        ...currentSnapshotTasks,
        ...rawTasks.filter(
          (task) =>
            !oldTaskIds.has(task.id) &&
            !currentSnapshotTasks.some((snapshot) => snapshot.id === task.id),
        ),
      ]
    : rawTasks;

  const rawTransactions = asArray(raw.transactions, initialData.transactions)
    .map(migrateTransaction)
    .filter((transaction) => !isLegacyTuitionEstimate(transaction));
  const transactions = upgradingSnapshot
    ? [
        ...rawTransactions.filter(
          (transaction) =>
            !oldTransactionIds.has(transaction.id) &&
            !currentSnapshotTransactions.some((snapshot) => snapshot.id === transaction.id),
        ),
        ...currentSnapshotTransactions,
      ]
    : rawTransactions;

  const rawAccounts = asArray(raw.accounts, initialData.accounts);
  const accounts = upgradingSnapshot
    ? initialData.accounts.map((fallback) => {
        const existing = rawAccounts.find(
          (account) => isObject(account) && account.id === fallback.id,
        );
        return fallback.id === "acc-main-card"
          ? fallback
          : isObject(existing)
            ? ({ ...fallback, ...existing } as typeof fallback)
            : fallback;
      })
    : rawAccounts;

  const rawCategories = asArray(raw.categories, defaultCategories);
  const categories = upgradingSnapshot
    ? [
        ...defaultCategories,
        ...rawCategories.filter(
          (category) =>
            isObject(category) &&
            !defaultCategories.some((fallback) => fallback.id === category.id),
        ),
      ]
    : rawCategories;

  return {
    ...initialData,
    schemaVersion: DATA_SCHEMA_VERSION,
    themeName: asTheme(raw.themeName, initialData.themeName),
    profile: {
      ...initialData.profile,
      name: asString(profile.name, initialData.profile.name),
      destination: asString(profile.destination, initialData.profile.destination),
      program: asString(profile.program, initialData.profile.program),
      startDate: asString(profile.startDate, initialData.profile.startDate),
      currencyRate: asNumber(profile.currencyRate, initialData.profile.currencyRate),
    },
    accounts,
    categories,
    tasks,
    transactions,
    plannedItems,
    aiThreads: asArray(raw.aiThreads, initialData.aiThreads),
  };
};
