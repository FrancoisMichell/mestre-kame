// Tipos globais relacionados à API
// Usados em múltiplas entidades: students, classes, attendance, etc.

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Você pode adicionar outros tipos comuns aqui:
// export interface ApiError { ... }
// export interface ApiResponse<T> { ... }
