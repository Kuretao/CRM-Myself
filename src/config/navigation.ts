import { BarChart3, Bot, CalendarClock, CheckSquare, LayoutDashboard, PieChart, Settings, UserRound } from 'lucide-react-native';
import type { TabName } from '../types/domain';

export const navigationItems: { key: TabName; label: string; hint: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Обзор', hint: 'банк и ближайшие платежи', icon: LayoutDashboard },
  { key: 'finance', label: 'Финансы', hint: 'операции и категории', icon: BarChart3 },
  { key: 'planning', label: 'План', hint: 'будущие доходы и расходы', icon: CalendarClock },
  { key: 'reports', label: 'Отчеты', hint: 'аналитика и сценарии', icon: PieChart },
  { key: 'tasks', label: 'Задачи', hint: 'личный kanban', icon: CheckSquare },
  { key: 'ai', label: 'AI', hint: 'чат и инсайты', icon: Bot },
  { key: 'profile', label: 'Профиль', hint: 'данные поездки', icon: UserRound },
  { key: 'settings', label: 'Настройки', hint: 'тема и storage', icon: Settings },
];
