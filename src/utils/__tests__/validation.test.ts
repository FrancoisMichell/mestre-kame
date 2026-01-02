import { describe, it, expect } from "vitest";
import {
  validateRequired,
  validateStudentName,
  validateRegistry,
  validateBirthday,
  validateTrainingSince,
  validateBelt,
  validateStudent,
} from "../validation";

describe("Validation Utils", () => {
  describe("validateRequired", () => {
    it("should return error for empty string", () => {
      const result = validateRequired("", "Campo");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Campo é obrigatório");
    });

    it("should return error for whitespace only", () => {
      const result = validateRequired("   ", "Campo");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Campo é obrigatório");
    });

    it("should return error for null", () => {
      const result = validateRequired(null, "Campo");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Campo é obrigatório");
    });

    it("should return error for undefined", () => {
      const result = validateRequired(undefined, "Campo");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Campo é obrigatório");
    });

    it("should return valid for filled string", () => {
      const result = validateRequired("valor", "Campo");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe("validateStudentName", () => {
    it("should return error for empty name", () => {
      const result = validateStudentName("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Nome é obrigatório");
    });

    it("should return error for name with less than 3 characters", () => {
      const result = validateStudentName("Jo");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Nome deve ter pelo menos 3 caracteres");
    });

    it("should return error for name with more than 100 characters", () => {
      const longName = "a".repeat(101);
      const result = validateStudentName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Nome deve ter no máximo 100 caracteres");
    });

    it("should return error for name with numbers", () => {
      const result = validateStudentName("João123");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Nome deve conter apenas letras");
    });

    it("should return error for name with special characters", () => {
      const result = validateStudentName("João@Silva");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Nome deve conter apenas letras");
    });

    it("should accept valid name with accents", () => {
      const result = validateStudentName("José da Silva");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should accept name with hyphen", () => {
      const result = validateStudentName("Mary-Jane");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should accept name with apostrophe", () => {
      const result = validateStudentName("O'Connor");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should trim whitespace", () => {
      const result = validateStudentName("  João  ");
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateRegistry", () => {
    it("should accept empty registry (optional field)", () => {
      const result = validateRegistry("");
      expect(result.isValid).toBe(true);
    });

    it("should return error for registry with less than 4 characters", () => {
      const result = validateRegistry("123");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Matrícula deve ter pelo menos 4 caracteres");
    });

    it("should return error for registry with more than 20 characters", () => {
      const result = validateRegistry("a".repeat(21));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Matrícula deve ter no máximo 20 caracteres");
    });

    it("should return error for registry with special characters", () => {
      const result = validateRegistry("00AA@00000");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        "Matrícula deve conter apenas letras, números, hífen ou underscore",
      );
    });

    it("should accept valid alphanumeric registry", () => {
      const result = validateRegistry("00AA000000");
      expect(result.isValid).toBe(true);
    });

    it("should accept registry with hyphen", () => {
      const result = validateRegistry("00-AA-000000");
      expect(result.isValid).toBe(true);
    });

    it("should accept registry with underscore", () => {
      const result = validateRegistry("00_AA_000000");
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateBirthday", () => {
    it("should accept empty birthday (optional field)", () => {
      const result = validateBirthday("");
      expect(result.isValid).toBe(true);
    });

    it("should return error for future date", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateBirthday(futureDate.toISOString().split("T")[0]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Data de nascimento não pode ser futura");
    });

    it("should return error for age less than 3 years", () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 2);
      const result = validateBirthday(recentDate.toISOString().split("T")[0]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Idade mínima é 3 anos");
    });

    it("should return error for age more than 100 years", () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 101);
      const result = validateBirthday(oldDate.toISOString().split("T")[0]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Idade máxima é 100 anos");
    });

    it("should return error for invalid date", () => {
      const result = validateBirthday("invalid-date");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Data de nascimento inválida");
    });

    it("should accept valid birthday for 10 years old", () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 10);
      const result = validateBirthday(validDate.toISOString().split("T")[0]);
      expect(result.isValid).toBe(true);
    });

    it("should accept valid birthday for 50 years old", () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 50);
      const result = validateBirthday(validDate.toISOString().split("T")[0]);
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateTrainingSince", () => {
    it("should accept empty training date (optional field)", () => {
      const result = validateTrainingSince("");
      expect(result.isValid).toBe(true);
    });

    it("should return error for future date", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateTrainingSince(
        futureDate.toISOString().split("T")[0],
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Data de início não pode ser futura");
    });

    it("should return error for date before 1950", () => {
      const result = validateTrainingSince("1949-01-01");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Data de início não pode ser anterior a 1950");
    });

    it("should return error for invalid date", () => {
      const result = validateTrainingSince("invalid-date");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Data de início de treinamento inválida");
    });

    it("should return error when training date is before birthday", () => {
      const birthday = "2000-05-15";
      const trainingDate = "1999-01-01";
      const result = validateTrainingSince(trainingDate, birthday);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        "Data de início não pode ser anterior à data de nascimento",
      );
    });

    it("should accept valid training date", () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 2);
      const result = validateTrainingSince(
        validDate.toISOString().split("T")[0],
      );
      expect(result.isValid).toBe(true);
    });

    it("should accept training date after birthday", () => {
      const birthday = "2000-05-15";
      const trainingDate = "2010-01-01";
      const result = validateTrainingSince(trainingDate, birthday);
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateBelt", () => {
    it("should return error for empty belt", () => {
      const result = validateBelt("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Faixa é obrigatório");
    });

    it("should return error for invalid belt", () => {
      const result = validateBelt("purple");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Faixa inválida");
    });

    it("should accept white belt", () => {
      const result = validateBelt("white");
      expect(result.isValid).toBe(true);
    });

    it("should accept yellow belt", () => {
      const result = validateBelt("yellow");
      expect(result.isValid).toBe(true);
    });

    it("should accept orange belt", () => {
      const result = validateBelt("orange");
      expect(result.isValid).toBe(true);
    });

    it("should accept green belt", () => {
      const result = validateBelt("green");
      expect(result.isValid).toBe(true);
    });

    it("should accept blue belt", () => {
      const result = validateBelt("blue");
      expect(result.isValid).toBe(true);
    });

    it("should accept brown belt", () => {
      const result = validateBelt("brown");
      expect(result.isValid).toBe(true);
    });

    it("should accept black belt", () => {
      const result = validateBelt("black");
      expect(result.isValid).toBe(true);
    });

    it("should accept case insensitive belt", () => {
      const result = validateBelt("BLACK");
      expect(result.isValid).toBe(true);
    });
  });

  describe("validateStudent", () => {
    it("should return no errors for valid student data", () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 10);

      const result = validateStudent({
        name: "João Silva",
        registry: "00AA123456",
        belt: "blue",
        birthday: validDate.toISOString().split("T")[0],
        trainingSince: new Date().toISOString().split("T")[0],
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should return multiple errors for invalid student data", () => {
      const result = validateStudent({
        name: "Jo",
        registry: "123",
        belt: "purple",
        birthday: "invalid",
        trainingSince: "invalid",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Nome deve ter pelo menos 3 caracteres");
      expect(result.errors.registry).toBe(
        "Matrícula deve ter pelo menos 4 caracteres",
      );
      expect(result.errors.belt).toBe("Faixa inválida");
      expect(result.errors.birthday).toBe("Data de nascimento inválida");
      expect(result.errors.trainingSince).toBe(
        "Data de início de treinamento inválida",
      );
    });

    it("should validate training date against birthday", () => {
      const result = validateStudent({
        name: "João Silva",
        belt: "blue",
        birthday: "2000-05-15",
        trainingSince: "1999-01-01",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.trainingSince).toBe(
        "Data de início não pode ser anterior à data de nascimento",
      );
    });

    it("should accept minimal valid student data", () => {
      const result = validateStudent({
        name: "João Silva",
        belt: "white",
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should not validate optional fields when empty", () => {
      const result = validateStudent({
        name: "João Silva",
        belt: "white",
        registry: "",
        birthday: "",
        trainingSince: "",
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
});
