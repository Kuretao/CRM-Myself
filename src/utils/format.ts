export const formatRub = (value: number) =>
  `${Math.round(value).toLocaleString('ru-RU')} ₽`;

export const formatRange = (min: number, max: number) => {
  if (Math.round(min) === Math.round(max)) {
    return formatRub(min);
  }
  return `${formatRub(min)} - ${formatRub(max)}`;
};

export const percent = (value: number, max: number) =>
  `${Math.max(4, Math.min(100, Math.round((value / Math.max(max, 1)) * 100)))}%` as const;
