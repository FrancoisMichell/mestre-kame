// Configurações para dias da semana

export const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo", short: "Dom" },
  { value: 1, label: "Segunda", short: "Seg" },
  { value: 2, label: "Terça", short: "Ter" },
  { value: 3, label: "Quarta", short: "Qua" },
  { value: 4, label: "Quinta", short: "Qui" },
  { value: 5, label: "Sexta", short: "Sex" },
  { value: 6, label: "Sábado", short: "Sáb" },
] as const;

export const getDayLabel = (day: number): string => {
  return DAYS_OF_WEEK[day]?.label || "Desconhecido";
};

export const getDayShort = (day: number): string => {
  return DAYS_OF_WEEK[day]?.short || "?";
};

export const formatDays = (days: number[]): string => {
  return days.sort().map(getDayShort).join(", ");
};

export const formatTime = (time: string): string => {
  // Formato esperado: "HH:mm"
  return time;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
};
