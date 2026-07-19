export type ThemeName = "light" | "dark";

export type TabName =
  | "overview"
  | "finance"
  | "planning"
  | "reports"
  | "tasks"
  | "chinese"
  | "documents"
  | "ai"
  | "profile"
  | "settings"
  | "notifications";

export type ReportPeriod = "month" | "quarter" | "year";

export type MoneyType = "income" | "expense";

export type TaskStatus = "todo" | "progress" | "done";

export type PlannedStatus = "planned" | "paid" | "skipped";

export type PlannedStage = "required" | "reserve" | "flexible";

export type AccountType = "cash" | "card" | "savings" | "debt";

export type CategoryKind = MoneyType | "task";

export type Task = {
  id: string;
  title: string;
  due: string;
  time?: string;
  tag: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status: TaskStatus;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: MoneyType;
  category: string;
  date: string;
  accountId?: string;
  note?: string;
  plannedItemId?: string;
};

export type PlannedItem = {
  id: string;
  title: string;
  type: MoneyType;
  amountMin: number;
  amountMax: number;
  due: string;
  category: string;
  stage: PlannedStage;
  status: PlannedStatus;
  note?: string;
};

export type PlannedPayment = PlannedItem;

export type Account = {
  id: string;
  title: string;
  type: AccountType;
  currency: "RUB" | "CNY" | "USD";
  balance: number;
};

export type Category = {
  id: string;
  title: string;
  kind: CategoryKind;
  color: string;
};

export type AiMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

export type AiThread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AiMessage[];
};

export type Profile = {
  name: string;
  destination: string;
  program: string;
  startDate: string;
  currencyRate: number;
};

export type AppData = {
  schemaVersion: number;
  themeName: ThemeName;
  profile: Profile;
  accounts: Account[];
  categories: Category[];
  tasks: Task[];
  transactions: Transaction[];
  plannedItems: PlannedItem[];
  aiThreads: AiThread[];
};

export type AnalyticsTotals = {
  currentBalance: number;
  income: number;
  fixedExpenses: number;
  plannedMin: number;
  plannedMax: number;
  leftMin: number;
  leftMax: number;
  doneTasks: number;
  taskProgress: number;
};
