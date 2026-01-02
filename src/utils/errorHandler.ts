// Utilitários para tratamento e formatação de erros
import type { AxiosError } from "axios";
import type {
  ApiError,
  ApiErrorResponse,
  ApplicationError,
  AuthError,
  NetworkError,
} from "../types/errors";
import { ERROR_MESSAGES } from "../constants/messages";

/**
 * Extrai mensagem de erro de diferentes tipos de erro
 */
export const getErrorMessage = (error: unknown): string => {
  // String simples
  if (typeof error === "string") {
    return error;
  }

  // Error nativo do JavaScript
  if (error instanceof Error) {
    return error.message;
  }

  // Objeto com propriedade message
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return ERROR_MESSAGES.GENERIC;
};

/**
 * Converte erro do Axios em ApiError
 */
export const parseAxiosError = (error: AxiosError): ApiError => {
  const status = error.response?.status || 0;
  const statusText = error.response?.statusText || "Unknown Error";
  const endpoint = error.config?.url || "unknown";

  // Extrai mensagem do corpo da resposta
  let message: string = ERROR_MESSAGES.API_ERROR;
  if (error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    message = data.message || data.error || message;
  }

  // Mensagens específicas por status code
  if (status === 400) {
    message = ERROR_MESSAGES.BAD_REQUEST;
  } else if (status === 401) {
    message = ERROR_MESSAGES.UNAUTHORIZED;
  } else if (status === 404) {
    message = ERROR_MESSAGES.NOT_FOUND;
  } else if (status >= 500) {
    message = ERROR_MESSAGES.SERVER_ERROR;
  }

  return {
    message,
    status,
    statusText,
    endpoint,
    code: `HTTP_${status}`,
    details: error.response?.data,
  };
};

/**
 * Detecta se é erro de rede (sem resposta do servidor)
 */
export const parseNetworkError = (error: AxiosError): NetworkError => {
  const isTimeout = error.code === "ECONNABORTED";
  const isOffline =
    !error.response && (error.code === "ERR_NETWORK" || !navigator.onLine);

  let message: string = ERROR_MESSAGES.NETWORK;
  if (isTimeout) {
    message = ERROR_MESSAGES.TIMEOUT;
  } else if (isOffline) {
    message = ERROR_MESSAGES.OFFLINE;
  }

  return {
    message,
    code: error.code,
    isOffline,
    timeout: isTimeout,
    details: error,
  };
};

/**
 * Detecta se é erro de autenticação
 */
export const parseAuthError = (error: AxiosError): AuthError => {
  const status = error.response?.status;
  const sessionExpired = status === 401;
  const requiresLogin = sessionExpired;

  let message: string = ERROR_MESSAGES.AUTH_REQUIRED;
  if (sessionExpired) {
    message = ERROR_MESSAGES.SESSION_EXPIRED;
  }

  return {
    message,
    code: "AUTH_ERROR",
    requiresLogin,
    sessionExpired,
    details: error.response?.data,
  };
};

/**
 * Processa qualquer erro e retorna ApplicationError apropriado
 */
export const handleError = (error: unknown): ApplicationError => {
  // Se já é um erro da aplicação, retorna
  if (isApplicationError(error)) {
    return error;
  }

  // Se é erro do Axios
  if (isAxiosError(error)) {
    // Sem resposta do servidor = erro de rede
    if (!error.response) {
      return parseNetworkError(error);
    }

    // Status 401 = erro de autenticação
    if (error.response.status === 401) {
      return parseAuthError(error);
    }

    // Outros erros HTTP
    return parseAxiosError(error);
  }

  // Erro genérico
  return {
    message: getErrorMessage(error),
    code: "UNKNOWN_ERROR",
    details: error,
  };
};

/**
 * Type guard para verificar se é erro do Axios
 */
const isAxiosError = (error: unknown): error is AxiosError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
};

/**
 * Type guard para verificar se já é ApplicationError
 */
const isApplicationError = (error: unknown): error is ApplicationError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "code" in error
  );
};

/**
 * Formata erro para exibição ao usuário
 * Remove informações técnicas sensíveis
 */
export const formatErrorForUser = (error: ApplicationError): string => {
  // Em produção, nunca mostrar detalhes técnicos
  if (import.meta.env.PROD) {
    return error.message;
  }

  // Em desenvolvimento, pode mostrar mais informações
  let formatted = error.message;
  if (error.code) {
    formatted += ` [${error.code}]`;
  }

  return formatted;
};

/**
 * Loga erro de forma apropriada para ambiente
 */
export const logError = (error: ApplicationError, context?: string): void => {
  const prefix = context ? `[${context}]` : "[Error]";

  if (import.meta.env.DEV) {
    console.error(prefix, {
      message: error.message,
      code: error.code,
      details: error.details,
    });
  } else {
    // Em produção, enviar para serviço de monitoramento
    console.error(prefix, error.message);
    // TODO: Integrar com Sentry, LogRocket, etc.
  }
};

/**
 * Wrapper para executar função async com tratamento de erro
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  context?: string,
): Promise<{ data?: T; error?: ApplicationError }> => {
  try {
    const data = await fn();
    return { data };
  } catch (error) {
    const appError = handleError(error);
    logError(appError, context);
    return { error: appError };
  }
};
