// Utilitários de validação centralizados
// Para garantir consistência em toda a aplicação

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida se um campo obrigatório está preenchido
 */
export const validateRequired = (
  value: string | undefined | null,
  fieldName: string,
): ValidationResult => {
  const trimmedValue = value?.trim() || "";
  if (!trimmedValue) {
    return {
      isValid: false,
      error: `${fieldName} é obrigatório`,
    };
  }
  return { isValid: true };
};

/**
 * Valida nome do estudante
 * - Mínimo 3 caracteres
 * - Máximo 100 caracteres
 * - Apenas letras, espaços e acentos
 */
export const validateStudentName = (name: string): ValidationResult => {
  const requiredCheck = validateRequired(name, "Nome");
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return {
      isValid: false,
      error: "Nome deve ter pelo menos 3 caracteres",
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: "Nome deve ter no máximo 100 caracteres",
    };
  }

  // Permite letras, espaços, acentos e caracteres especiais comuns em nomes
  const namePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!namePattern.test(trimmedName)) {
    return {
      isValid: false,
      error: "Nome deve conter apenas letras",
    };
  }

  return { isValid: true };
};

/**
 * Valida matrícula do estudante
 * - Formato: 00AA000000 (2 dígitos + 2 letras + 6 dígitos)
 * - Ou formato livre com mínimo 4 caracteres
 */
export const validateRegistry = (registry: string): ValidationResult => {
  const trimmedRegistry = registry?.trim() || "";

  // Se vazio, é válido (campo opcional)
  if (!trimmedRegistry) {
    return { isValid: true };
  }

  // Mínimo 4 caracteres
  if (trimmedRegistry.length < 4) {
    return {
      isValid: false,
      error: "Matrícula deve ter pelo menos 4 caracteres",
    };
  }

  // Máximo 20 caracteres
  if (trimmedRegistry.length > 20) {
    return {
      isValid: false,
      error: "Matrícula deve ter no máximo 20 caracteres",
    };
  }

  // Permite letras, números e alguns caracteres especiais
  const registryPattern = /^[a-zA-Z0-9-_]+$/;
  if (!registryPattern.test(trimmedRegistry)) {
    return {
      isValid: false,
      error:
        "Matrícula deve conter apenas letras, números, hífen ou underscore",
    };
  }

  return { isValid: true };
};

/**
 * Valida data de nascimento
 * - Não pode ser futura
 * - Idade mínima: 3 anos
 * - Idade máxima: 100 anos
 */
export const validateBirthday = (birthday: string): ValidationResult => {
  // Se vazio, é válido (campo opcional)
  if (!birthday || !birthday.trim()) {
    return { isValid: true };
  }

  const birthDate = new Date(birthday);
  const today = new Date();

  // Verifica se é uma data válida
  if (isNaN(birthDate.getTime())) {
    return {
      isValid: false,
      error: "Data de nascimento inválida",
    };
  }

  // Não pode ser futura
  if (birthDate > today) {
    return {
      isValid: false,
      error: "Data de nascimento não pode ser futura",
    };
  }

  // Calcula idade
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge--;
  }

  // Idade mínima 3 anos
  if (actualAge < 3) {
    return {
      isValid: false,
      error: "Idade mínima é 3 anos",
    };
  }

  // Idade máxima 100 anos
  if (actualAge > 100) {
    return {
      isValid: false,
      error: "Idade máxima é 100 anos",
    };
  }

  return { isValid: true };
};

/**
 * Valida data de início de treinamento
 * - Não pode ser futura
 * - Não pode ser anterior a 1950
 * - Se houver data de nascimento, não pode ser anterior a ela
 */
export const validateTrainingSince = (
  trainingSince: string,
  birthday?: string,
): ValidationResult => {
  // Se vazio, é válido (campo opcional)
  if (!trainingSince || !trainingSince.trim()) {
    return { isValid: true };
  }

  const trainingDate = new Date(trainingSince);
  const today = new Date();

  // Verifica se é uma data válida
  if (isNaN(trainingDate.getTime())) {
    return {
      isValid: false,
      error: "Data de início de treinamento inválida",
    };
  }

  // Não pode ser futura
  if (trainingDate > today) {
    return {
      isValid: false,
      error: "Data de início não pode ser futura",
    };
  }

  // Não pode ser anterior a 1950
  const minDate = new Date("1950-01-01");
  if (trainingDate < minDate) {
    return {
      isValid: false,
      error: "Data de início não pode ser anterior a 1950",
    };
  }

  // Se houver data de nascimento, valida em relação a ela
  if (birthday && birthday.trim()) {
    const birthDate = new Date(birthday);
    if (!isNaN(birthDate.getTime()) && trainingDate < birthDate) {
      return {
        isValid: false,
        error: "Data de início não pode ser anterior à data de nascimento",
      };
    }
  }

  return { isValid: true };
};

/**
 * Valida faixa (belt)
 */
export const validateBelt = (belt: string): ValidationResult => {
  const requiredCheck = validateRequired(belt, "Faixa");
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }

  const validBelts = [
    "white",
    "yellow",
    "orange",
    "green",
    "blue",
    "brown",
    "black",
  ];

  if (!validBelts.includes(belt.toLowerCase())) {
    return {
      isValid: false,
      error: "Faixa inválida",
    };
  }

  return { isValid: true };
};

/**
 * Valida todos os campos de um estudante
 */
export const validateStudent = (data: {
  name: string;
  registry?: string;
  belt: string;
  birthday?: string;
  trainingSince?: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const nameValidation = validateStudentName(data.name);
  if (!nameValidation.isValid && nameValidation.error) {
    errors.name = nameValidation.error;
  }

  if (data.registry) {
    const registryValidation = validateRegistry(data.registry);
    if (!registryValidation.isValid && registryValidation.error) {
      errors.registry = registryValidation.error;
    }
  }

  const beltValidation = validateBelt(data.belt);
  if (!beltValidation.isValid && beltValidation.error) {
    errors.belt = beltValidation.error;
  }

  if (data.birthday) {
    const birthdayValidation = validateBirthday(data.birthday);
    if (!birthdayValidation.isValid && birthdayValidation.error) {
      errors.birthday = birthdayValidation.error;
    }
  }

  if (data.trainingSince) {
    const trainingSinceValidation = validateTrainingSince(
      data.trainingSince,
      data.birthday,
    );
    if (!trainingSinceValidation.isValid && trainingSinceValidation.error) {
      errors.trainingSince = trainingSinceValidation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
