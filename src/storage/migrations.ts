import { DATA_SCHEMA_VERSION } from '../config/app';
import { defaultCategories, defaultPlannedItems, initialData } from '../data/seed';
import type { AppData, MoneyType, PlannedItem, TaskStatus, ThemeName } from '../types/domain';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;

const asNumber = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asArray = <T>(value: unknown, fallback: T[]) =>
  Array.isArray(value) ? value : fallback;

const asTheme = (value: unknown, fallback: ThemeName): ThemeName =>
  value === 'light' || value === 'dark' ? value : fallback;

const asMoneyType = (value: unknown, fallback: MoneyType): MoneyType =>
  value === 'income' || value === 'expense' ? value : fallback;

const asTaskStatus = (value: unknown, fallback: TaskStatus): TaskStatus =>
  value === 'todo' || value === 'progress' || value === 'done' ? value : fallback;

const migrateLegacyPlannedItem = (value: unknown, index: number): PlannedItem | null => {
  if (!isObject(value)) return null;
  const amountMin = asNumber(value.amountMin, NaN);
  const amountMax = asNumber(value.amountMax, amountMin);
  if (!Number.isFinite(amountMin) || !Number.isFinite(amountMax)) return null;

  const stage = value.stage === 'required' || value.stage === 'reserve' || value.stage === 'flexible'
    ? value.stage
    : 'flexible';
  const status = value.status === 'planned' || value.status === 'paid' || value.status === 'skipped'
    ? value.status
    : 'planned';

  return {
    id: asString(value.id, `plan-${Date.now()}-${index}`),
    title: asString(value.title, 'Плановая операция'),
    type: asMoneyType(value.type, 'expense'),
    amountMin,
    amountMax,
    due: asString(value.due, 'без даты'),
    category: asString(value.category, 'план'),
    stage,
    status,
    note: typeof value.note === 'string' ? value.note : undefined,
  };
};

export const normalizeAppData = (raw: unknown): AppData => {
  if (!isObject(raw)) return initialData;

  const legacyPlanned = asArray(raw.plannedItems, []).map(migrateLegacyPlannedItem).filter(Boolean) as PlannedItem[];
  const plannedItems = legacyPlanned.length ? legacyPlanned : defaultPlannedItems;
  const profile = isObject(raw.profile) ? raw.profile : {};

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
    accounts: asArray(raw.accounts, initialData.accounts),
    categories: asArray(raw.categories, defaultCategories),
    tasks: asArray(raw.tasks, initialData.tasks).map((task, index) => {
      if (!isObject(task)) return initialData.tasks[index] || initialData.tasks[0];
      return {
        id: asString(task.id, `task-${Date.now()}-${index}`),
        title: asString(task.title, 'Новая задача'),
        due: asString(task.due, 'без даты'),
        time: typeof task.time === 'string' ? task.time : undefined,
        tag: asString(task.tag, 'личное'),
        description: typeof task.description === 'string' ? task.description : undefined,
        priority: task.priority === 'low' || task.priority === 'medium' || task.priority === 'high' ? task.priority : 'medium',
        status: asTaskStatus(task.status, 'todo'),
      };
    }),
    transactions: asArray(raw.transactions, initialData.transactions).map((transaction, index) => {
      if (!isObject(transaction)) return initialData.transactions[index] || initialData.transactions[0];
      return {
        id: asString(transaction.id, `tr-${Date.now()}-${index}`),
        title: asString(transaction.title, 'Операция'),
        amount: Math.max(0, asNumber(transaction.amount, 0)),
        type: asMoneyType(transaction.type, 'expense'),
        category: asString(transaction.category, 'прочее'),
        date: asString(transaction.date, 'без даты'),
        accountId: typeof transaction.accountId === 'string' ? transaction.accountId : undefined,
        note: typeof transaction.note === 'string' ? transaction.note : undefined,
        plannedItemId: typeof transaction.plannedItemId === 'string' ? transaction.plannedItemId : undefined,
      };
    }),
    plannedItems,
    aiThreads: asArray(raw.aiThreads, initialData.aiThreads),
  };
};
