import { CNY_RATE, DATA_SCHEMA_VERSION } from '../config/app';
import type { AppData, Category, PlannedItem } from '../types/domain';

export const defaultCategories: Category[] = [
  { id: 'cat-bank', title: 'банк', kind: 'income', color: '#8D86FF' },
  { id: 'cat-work', title: 'работа', kind: 'income', color: '#72D39A' },
  { id: 'cat-extra', title: 'дополнительно', kind: 'income', color: '#86A9FF' },
  { id: 'cat-docs', title: 'документы', kind: 'expense', color: '#E9B969' },
  { id: 'cat-study', title: 'учеба', kind: 'expense', color: '#8D86FF' },
  { id: 'cat-move', title: 'переезд', kind: 'expense', color: '#86A9FF' },
  { id: 'cat-home', title: 'жилье', kind: 'expense', color: '#72D39A' },
  { id: 'cat-life', title: 'жизнь', kind: 'expense', color: '#FF7D85' },
  { id: 'cat-tasks', title: 'личное', kind: 'task', color: '#A6ABC2' },
];

export const defaultPlannedItems: PlannedItem[] = [
  { id: 'plan-1', title: 'Медицинская страховка', type: 'expense', amountMin: 500 * CNY_RATE, amountMax: 700 * CNY_RATE, due: 'июль', category: 'документы', stage: 'required', status: 'planned' },
  { id: 'plan-2', title: 'Визовый сбор', type: 'expense', amountMin: 6500, amountMax: 6500, due: 'июль', category: 'документы', stage: 'required', status: 'planned' },
  { id: 'plan-3', title: 'Языковой год, 1 половина', type: 'expense', amountMin: 8000 * CNY_RATE, amountMax: 8000 * CNY_RATE, due: 'до старта', category: 'учеба', stage: 'required', status: 'planned' },
  { id: 'plan-4', title: 'Вид на жительство', type: 'expense', amountMin: 350 * CNY_RATE, amountMax: 350 * CNY_RATE, due: 'после приезда', category: 'документы', stage: 'required', status: 'planned' },
  { id: 'plan-5', title: 'Общага на 2 месяца', type: 'expense', amountMin: (6500 / 12) * 2 * CNY_RATE, amountMax: ((6500 + 3000) / 12) * 2 * CNY_RATE, due: 'первые 2 месяца', category: 'жилье', stage: 'required', status: 'planned' },
  { id: 'plan-6', title: 'Резерв жизни на 2 месяца', type: 'expense', amountMin: 70000, amountMax: 90000, due: 'август-сентябрь', category: 'жизнь', stage: 'reserve', status: 'planned' },
];

export const initialData: AppData = {
  schemaVersion: DATA_SCHEMA_VERSION,
  themeName: 'dark',
  profile: {
    name: 'Богдан Фролов',
    destination: 'Чэнду, Китай',
    program: 'Языковой год',
    startDate: '01.09.2026',
    currencyRate: CNY_RATE,
  },
  accounts: [
    { id: 'acc-main-card', title: 'Основная карта', type: 'card', currency: 'RUB', balance: 20000 },
    { id: 'acc-cash', title: 'Наличные', type: 'cash', currency: 'RUB', balance: 0 },
  ],
  categories: defaultCategories,
  tasks: [
    { id: 'task-1', title: 'Закрыть доп', due: 'до вылета', tag: 'финансы', priority: 'high', status: 'todo' },
    { id: 'task-2', title: 'Оплатить перелет', due: '15-20 июля', tag: 'переезд', priority: 'high', status: 'progress' },
    { id: 'task-3', title: 'Оплатить остаток услуг', due: '15 июля', tag: 'договор', priority: 'medium', status: 'todo' },
    { id: 'task-4', title: 'Проверить страховку и визу', due: 'июль', tag: 'документы', priority: 'medium', status: 'todo' },
  ],
  transactions: [
    { id: 'tr-1', title: 'Баланс на карте', amount: 20000, type: 'income', category: 'банк', date: 'сейчас', accountId: 'acc-main-card' },
    { id: 'tr-2', title: 'Зарплаты июль-август', amount: 272000, type: 'income', category: 'работа', date: 'июль-август', accountId: 'acc-main-card' },
    { id: 'tr-3', title: 'Дополнительные поступления', amount: 100000, type: 'income', category: 'дополнительно', date: 'июль-август', accountId: 'acc-main-card' },
    { id: 'tr-4', title: 'Доп', amount: 60000, type: 'expense', category: 'долги', date: 'июль', accountId: 'acc-main-card' },
    { id: 'tr-5', title: 'Остаток услуг', amount: 30000, type: 'expense', category: 'договор', date: '15 июля', accountId: 'acc-main-card' },
    { id: 'tr-6', title: 'Перелет туда', amount: 30000, type: 'expense', category: 'переезд', date: '15-20 июля', accountId: 'acc-main-card' },
  ],
  plannedItems: defaultPlannedItems,
  aiThreads: [
    {
      id: 'ai-thread-1',
      title: 'Финансовый разбор',
      createdAt: '2026-07-08',
      updatedAt: '2026-07-08',
      messages: [
        {
          id: 'ai-msg-1',
          role: 'assistant',
          content: 'Я буду помогать разбирать расходы, планировать месяц и находить финансовые риски.',
          createdAt: '2026-07-08',
        },
      ],
    },
  ],
};
