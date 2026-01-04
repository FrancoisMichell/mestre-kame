import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { type Student, type NewStudent } from "./StudentTypes";
import { useNavigate } from "react-router-dom";
import { useStudents } from "./StudentContext";
import { beltOptions, beltConfigs } from "./beltConfig";
import FormInput from "../common/FormInput";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { validateStudent } from "../../utils/validation";
import { SUCCESS_MESSAGES } from "../../constants/messages";
import { toast } from "sonner";

const initialFormData: NewStudent = {
  name: "",
  belt: "white",
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<NewStudent>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addStudent } = useStudents();
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Valida todos os campos
    const validation = validateStudent({
      name: formData.name,
      registry: formData.registry,
      belt: formData.belt,
      birthday: formData.birthday,
      trainingSince: formData.trainingSince,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const finalStudentData: Student = {
      name: formData.name,
      registry: formData.registry,
      belt: formData.belt,
      birthday: formData.birthday,
      trainingSince:
        formData.trainingSince || new Date().toISOString().split("T")[0],
    } as Student;
    addStudent(finalStudentData);

    setFormData(initialFormData);
    setErrors({});
    toast.success(SUCCESS_MESSAGES.STUDENT_CREATED);
    navigate("/");
  };

  return (
    <div className="flex justify-center w-full my-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-8 rounded-lg w-full max-w-lg border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Novo aluno
        </h2>

        <FormInput
          id="name"
          name="name"
          label="Nome completo"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: João das Neves"
          required
          className="mb-5"
        />
        {errors.name && (
          <ErrorMessage type="error" message={errors.name} className="mb-4" />
        )}

        <FormInput
          id="registry"
          name="registry"
          label="Matrícula"
          type="text"
          value={formData.registry}
          onChange={handleChange}
          placeholder="00PE003920"
          className="mb-5"
        />
        {errors.registry && (
          <ErrorMessage
            type="error"
            message={errors.registry}
            className="mb-4"
          />
        )}

        {/* Datas (Birthday e TrainingSince) */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <FormInput
              id="birthday"
              name="birthday"
              label="Data de Nascimento"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
            />
            {errors.birthday && (
              <ErrorMessage
                type="error"
                message={errors.birthday}
                className="mt-2"
              />
            )}
          </div>
          <div className="flex-1">
            <FormInput
              id="trainingSince"
              name="trainingSince"
              label="Treinando Desde"
              type="date"
              value={formData.trainingSince}
              onChange={handleChange}
            />
            {errors.trainingSince && (
              <ErrorMessage
                type="error"
                message={errors.trainingSince}
                className="mt-2"
              />
            )}
          </div>
        </div>

        {/* Faixa (Belt) */}
        <div className="mb-5">
          <label
            htmlFor="belt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Faixa
          </label>
          <select
            id="belt"
            name="belt"
            value={formData.belt}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150"
          >
            {beltOptions.map((belt) => (
              <option key={belt} value={belt}>
                {beltConfigs[belt].name}
              </option>
            ))}
          </select>
          {errors.belt && (
            <ErrorMessage type="error" message={errors.belt} className="mt-2" />
          )}
        </div>

        {/* Botão de Submissão */}
        <Button type="submit" variant="primary" fullWidth>
          Cadastrar Aluno
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
