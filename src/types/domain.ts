export type ThemeName = 'light' | 'dark';

export type TabName = 'overview' | 'finance' | 'reports' | 'tasks' | 'profile' | 'settings';

export type ReportPeriod = 'month' | 'quarter' | 'year';

export type MoneyType = 'income' | 'expense';

export type TaskStatus = 'todo' | 'progress' | 'done';

export type Task = {
  id: string;
  title: string;
  due: string;
  tag: string;
  status: TaskStatus;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: MoneyType;
  category: string;
  date: string;
};

export type PlannedPayment = {
  id: string;
  title: string;
  amountMin: number;
  amountMax: number;
  due: string;
  category: string;
  stage: 'required' | 'reserve';
};

export type Profile = {
  name: string;
  destination: string;
  program: string;
  startDate: string;
  currencyRate: number;
};

export type AppData = {
  themeName: ThemeName;
  profile: Profile;
  tasks: Task[];
  transactions: Transaction[];
};

export type AnalyticsTotals = {
  income: number;
  fixedExpenses: number;
  plannedMin: number;
  plannedMax: number;
  leftMin: number;
  leftMax: number;
  doneTasks: number;
  taskProgress: number;
};
