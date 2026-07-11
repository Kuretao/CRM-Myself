import {
  BarChart3,
  Bot,
  CalendarClock,
  CheckSquare,
  FileCheck2,
  LayoutDashboard,
  Languages,
  PieChart,
  Settings,
  UserRound,
} from "lucide-react-native";
import type { TabName } from "../types/domain";

export const navigationItems: {
  key: TabName;
  label: string;
  hint: string;
  icon: typeof LayoutDashboard;
}[] = [
  {
    key: "overview",
    label: "Главная",
    hint: "банк и ближайшие платежи",
    icon: LayoutDashboard,
  },
  {
    key: "finance",
    label: "Финансы",
    hint: "операции и категории",
    icon: BarChart3,
  },
  {
    key: "planning",
    label: "Планирование",
    hint: "будущие доходы и расходы",
    icon: CalendarClock,
  },
  {
    key: "reports",
    label: "Аналитика",
    hint: "отчеты и сценарии",
    icon: PieChart,
  },
  { key: "tasks", label: "Задачи", hint: "личный kanban", icon: CheckSquare },
  {
    key: "chinese",
    label: "Китайский",
    hint: "уроки, словарь и практика",
    icon: Languages,
  },
  {
    key: "documents",
    label: "Документы",
    hint: "сроки и готовность",
    icon: FileCheck2,
  },
  { key: "ai", label: "NOVA AI", hint: "чат и инсайты", icon: Bot },
  { key: "profile", label: "Профиль", hint: "данные поездки", icon: UserRound },
  {
    key: "settings",
    label: "Настройки",
    hint: "тема и хранение",
    icon: Settings,
  },
];
