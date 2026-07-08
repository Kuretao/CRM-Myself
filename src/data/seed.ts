import { CNY_RATE } from '../config/app';
import type { AppData, PlannedPayment } from '../types/domain';

export const initialData: AppData = {
  themeName: 'dark',
  profile: {
    name: 'Богдан Фролов',
    destination: 'Чэнду, Китай',
    program: 'Языковой год',
    startDate: '01.09.2026',
    currencyRate: CNY_RATE,
  },
  tasks: [
    { id: 'task-1', title: 'Закрыть доп', due: 'до вылета', tag: 'финансы', status: 'todo' },
    { id: 'task-2', title: 'Оплатить перелет', due: '15-20 июля', tag: 'переезд', status: 'progress' },
    { id: 'task-3', title: 'Оплатить остаток услуг', due: '15 июля', tag: 'договор', status: 'todo' },
    { id: 'task-4', title: 'Проверить страховку и визу', due: 'июль', tag: 'документы', status: 'todo' },
  ],
  transactions: [
    { id: 'tr-1', title: 'Баланс на карте', amount: 20000, type: 'income', category: 'банк', date: 'сейчас' },
    { id: 'tr-2', title: 'Зарплаты июль-август', amount: 272000, type: 'income', category: 'работа', date: 'июль-август' },
    { id: 'tr-3', title: 'Дополнительные поступления', amount: 100000, type: 'income', category: 'дополнительно', date: 'июль-август' },
    { id: 'tr-4', title: 'Доп', amount: 60000, type: 'expense', category: 'долги', date: 'июль' },
    { id: 'tr-5', title: 'Остаток услуг', amount: 30000, type: 'expense', category: 'договор', date: '15 июля' },
    { id: 'tr-6', title: 'Перелет туда', amount: 30000, type: 'expense', category: 'переезд', date: '15-20 июля' },
  ],
};

export const plannedPayments: PlannedPayment[] = [
  { id: 'plan-1', title: 'Медицинская страховка', amountMin: 500 * CNY_RATE, amountMax: 700 * CNY_RATE, due: 'июль', category: 'документы', stage: 'required' },
  { id: 'plan-2', title: 'Визовый сбор', amountMin: 6500, amountMax: 6500, due: 'июль', category: 'документы', stage: 'required' },
  { id: 'plan-3', title: 'Языковой год, 1 половина', amountMin: 8000 * CNY_RATE, amountMax: 8000 * CNY_RATE, due: 'до старта', category: 'учеба', stage: 'required' },
  { id: 'plan-4', title: 'Вид на жительство', amountMin: 350 * CNY_RATE, amountMax: 350 * CNY_RATE, due: 'после приезда', category: 'документы', stage: 'required' },
  { id: 'plan-5', title: 'Общага на 2 месяца', amountMin: (6500 / 12) * 2 * CNY_RATE, amountMax: ((6500 + 3000) / 12) * 2 * CNY_RATE, due: 'первые 2 месяца', category: 'жилье', stage: 'required' },
  { id: 'plan-6', title: 'Резерв жизни на 2 месяца', amountMin: 70000, amountMax: 90000, due: 'август-сентябрь', category: 'жизнь', stage: 'reserve' },
];
