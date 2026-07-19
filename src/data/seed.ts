import { CNY_RATE, DATA_SCHEMA_VERSION } from "../config/app";
import type { AppData, Category, PlannedItem, Task, Transaction } from "../types/domain";
import { importedOperations } from "./importedOperations";

export const defaultCategories: Category[] = [
  { id: "cat-bank", title: "Банк", kind: "income", color: "#66829D" },
  { id: "cat-work", title: "Работа", kind: "income", color: "#4F9077" },
  { id: "cat-extra", title: "Дополнительно", kind: "income", color: "#819CB8" },
  { id: "cat-docs", title: "Документы", kind: "expense", color: "#B0894E" },
  { id: "cat-study", title: "Учёба", kind: "expense", color: "#7B8293" },
  { id: "cat-move", title: "Переезд", kind: "expense", color: "#637D9B" },
  { id: "cat-home", title: "Жильё", kind: "expense", color: "#4F9077" },
  { id: "cat-life", title: "Жизнь", kind: "expense", color: "#B85E67" },
  { id: "cat-tasks", title: "Личное", kind: "task", color: "#9098A2" },
];

export const defaultPlannedItems: PlannedItem[] = [
  {
    id: "snapshot-plan-income-september",
    title: "Поступления до 1 сентября",
    type: "income",
    amountMin: 255000,
    amountMax: 255000,
    due: "01.09.2026",
    category: "Работа",
    stage: "required",
    status: "planned",
    note: "Общая подтверждённая сумма поверх текущих 11 000 ₽",
  },
  {
    id: "snapshot-plan-flight-hotel",
    title: "Перелёт и отель до заселения",
    type: "expense",
    amountMin: 75000,
    amountMax: 75000,
    due: "20.07.2026",
    category: "Переезд",
    stage: "required",
    status: "planned",
    note: "Билеты и проживание до 3 августа",
  },
  {
    id: "snapshot-plan-dorm",
    title: "Общежитие",
    type: "expense",
    amountMin: 1150 * CNY_RATE,
    amountMax: 1150 * CNY_RATE,
    due: "03.08.2026",
    category: "Жильё",
    stage: "required",
    status: "planned",
    note: `1150 CNY по курсу ${CNY_RATE}`,
  },
  {
    id: "snapshot-plan-visa",
    title: "Студенческая виза X1",
    type: "expense",
    amountMin: 6500,
    amountMax: 6500,
    due: "31.08.2026",
    category: "Документы",
    stage: "required",
    status: "planned",
    note: "Последняя зафиксированная оценка визового сбора",
  },
  {
    id: "snapshot-plan-insurance",
    title: "Медицинская страховка",
    type: "expense",
    amountMin: 500 * CNY_RATE,
    amountMax: 700 * CNY_RATE,
    due: "31.08.2026",
    category: "Документы",
    stage: "required",
    status: "planned",
    note: `500–700 CNY по курсу ${CNY_RATE}`,
  },
];

export const currentSnapshotTasks: Task[] = [
  { id: "snapshot-task-dentist", title: "Сходить к стоматологу", due: "16.07.2026", tag: "здоровье", priority: "high", status: "progress" },
  { id: "snapshot-task-flight", title: "Купить билеты и забронировать отель", due: "20.07.2026", tag: "переезд", priority: "high", status: "todo" },
  { id: "snapshot-task-dorm", title: "Оплатить общежитие 1150 ¥", due: "03.08.2026", tag: "жильё", priority: "medium", status: "todo" },
  { id: "snapshot-task-documents", title: "Загрузить билеты и бронь в документы", due: "после покупки", tag: "документы", priority: "medium", status: "todo" },
];

export const currentSnapshotTransactions: Transaction[] = [
  {
    id: "snapshot-tuition-semester-1",
    title: "Учёба, первый семестр",
    amount: 99000,
    type: "expense",
    category: "Учёба",
    date: "16.07.2026",
    accountId: "acc-main-card",
    note: "Оплачено полностью",
  },
];

export const initialData: AppData = {
  schemaVersion: DATA_SCHEMA_VERSION,
  themeName: "dark",
  profile: {
    name: "Богдан Фролов",
    destination: "Чэнду, Китай",
    program: "Языковой год",
    startDate: "01.09.2026",
    currencyRate: CNY_RATE,
  },
  accounts: [
    { id: "acc-main-card", title: "Основная карта", type: "card", currency: "RUB", balance: 11000 },
    { id: "acc-cash", title: "Наличные", type: "cash", currency: "RUB", balance: 0 },
  ],
  categories: defaultCategories,
  tasks: currentSnapshotTasks,
  transactions: [...importedOperations, ...currentSnapshotTransactions],
  plannedItems: defaultPlannedItems,
  aiThreads: [
    {
      id: "ai-thread-1",
      title: "Финансовый разбор",
      createdAt: "2026-07-08",
      updatedAt: "2026-07-16",
      messages: [
        {
          id: "ai-msg-1",
          role: "assistant",
          content: "Я помогу разобрать расходы, спланировать месяц и найти финансовые риски.",
          createdAt: "2026-07-08",
        },
      ],
    },
  ],
};
