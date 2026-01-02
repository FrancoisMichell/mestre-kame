// Centralização de mensagens de erro, sucesso e informações
// Para facilitar manutenção e futura internacionalização

export const ERROR_MESSAGES = {
  // Erros genéricos
  GENERIC: "Ocorreu um erro inesperado. Tente novamente.",
  UNKNOWN: "Erro desconhecido. Entre em contato com o suporte.",

  // Erros de rede
  NETWORK: "Erro de conexão. Verifique sua internet.",
  TIMEOUT: "A requisição demorou muito. Tente novamente.",
  OFFLINE: "Você está offline. Verifique sua conexão.",

  // Erros de API
  API_ERROR: "Erro ao comunicar com o servidor.",
  SERVER_ERROR: "Erro interno do servidor. Tente novamente mais tarde.",
  BAD_REQUEST: "Requisição inválida. Verifique os dados enviados.",
  NOT_FOUND: "Recurso não encontrado.",

  // Erros de autenticação
  AUTH_REQUIRED: "É necessário fazer login para continuar.",
  SESSION_EXPIRED: "Sua sessão expirou. Por favor, faça login novamente.",
  INVALID_CREDENTIALS: "Credenciais inválidas. Verifique seus dados.",
  UNAUTHORIZED: "Você não tem permissão para realizar esta ação.",

  // Erros de estudantes
  STUDENT_NOT_FOUND: "Estudante não encontrado.",
  STUDENT_LOAD_ERROR: "Erro ao carregar dados do estudante.",
  STUDENT_SAVE_ERROR: "Erro ao salvar estudante.",
  STUDENT_DELETE_ERROR: "Erro ao excluir estudante.",
  STUDENT_LIST_ERROR: "Erro ao carregar lista de estudantes.",

  // Erros de validação
  VALIDATION_ERROR: "Verifique os campos do formulário.",
  REQUIRED_FIELD: "Campo obrigatório.",
  INVALID_FORMAT: "Formato inválido.",
} as const;

export const SUCCESS_MESSAGES = {
  // Sucesso com estudantes
  STUDENT_CREATED: "Aluno cadastrado com sucesso!",
  STUDENT_UPDATED: "Dados do aluno atualizados com sucesso!",
  STUDENT_DELETED: "Aluno removido com sucesso!",

  // Sucesso com autenticação
  LOGIN_SUCCESS: "Login realizado com sucesso!",
  LOGOUT_SUCCESS: "Logout realizado com sucesso!",

  // Ações genéricas
  SAVE_SUCCESS: "Salvo com sucesso!",
  UPDATE_SUCCESS: "Atualizado com sucesso!",
  DELETE_SUCCESS: "Removido com sucesso!",
} as const;

export const INFO_MESSAGES = {
  // Informações gerais
  LOADING: "Carregando...",
  SAVING: "Salvando...",
  DELETING: "Removendo...",
  PROCESSING: "Processando...",

  // Informações sobre dados
  NO_DATA: "Nenhum dado encontrado.",
  EMPTY_LIST: "Lista vazia.",
  NO_STUDENTS: "Nenhum aluno cadastrado ainda.",

  // Confirmações
  CONFIRM_DELETE: "Tem certeza que deseja excluir?",
  CONFIRM_LOGOUT: "Deseja realmente sair?",
  UNSAVED_CHANGES: "Você tem alterações não salvas.",
} as const;

export const WARNING_MESSAGES = {
  // Avisos
  UNSAVED_DATA: "Dados não salvos serão perdidos.",
  SESSION_EXPIRING: "Sua sessão está prestes a expirar.",
  SLOW_CONNECTION: "Conexão lenta detectada.",
} as const;

// Type helpers para garantir type safety
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
export type InfoMessageKey = keyof typeof INFO_MESSAGES;
export type WarningMessageKey = keyof typeof WARNING_MESSAGES;
