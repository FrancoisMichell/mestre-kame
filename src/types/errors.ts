// Tipos específicos para tratamento de erros na aplicação

/**
 * Erro genérico da aplicação
 */
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Erro de API HTTP
 */
export interface ApiError extends AppError {
  status: number;
  statusText: string;
  endpoint?: string;
}

/**
 * Erro de validação
 */
export interface ValidationError extends AppError {
  field?: string;
  errors?: Record<string, string>;
}

/**
 * Erro de autenticação
 */
export interface AuthError extends AppError {
  requiresLogin?: boolean;
  sessionExpired?: boolean;
}

/**
 * Erro de rede
 */
export interface NetworkError extends AppError {
  isOffline?: boolean;
  timeout?: boolean;
}

/**
 * Tipo união de todos os erros
 */
export type ApplicationError =
  | ApiError
  | ValidationError
  | AuthError
  | NetworkError
  | AppError;

/**
 * Type guards para verificar tipos de erro
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as ApiError).status === "number"
  );
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("field" in error || "errors" in error)
  );
};

export const isAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("requiresLogin" in error || "sessionExpired" in error)
  );
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("isOffline" in error || "timeout" in error)
  );
};

/**
 * Resposta de erro da API (formato padrão)
 */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  details?: unknown;
}
