import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAddClass } from "../../api/hooks";
import { DAYS_OF_WEEK } from "./daysConfig";
import FormInput from "../common/FormInput";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { validateClass } from "../../utils/validation";
import { toast } from "sonner";

interface FormData {
  name: string;
  days: number[];
  startTime: string;
  durationMinutes: string;
}

const initialFormData: FormData = {
  name: "",
  days: [],
  startTime: "",
  durationMinutes: "60",
};

const ClassRegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addClassAPI = useAddClass();
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

  const handleDayToggle = (day: number) => {
    setFormData((prev) => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day].sort();

      return { ...prev, days: newDays };
    });

    // Limpa erro de dias quando usuário seleciona
    if (errors.days) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.days;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Valida todos os campos
    const validation = validateClass({
      name: formData.name,
      days: formData.days,
      startTime: formData.startTime,
      durationMinutes: Number(formData.durationMinutes),
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Envia apenas dados da turma, backend atribui o teacher e isActive automaticamente
      const classData = {
        name: formData.name,
        days: formData.days,
        startTime: formData.startTime,
        durationMinutes: Number(formData.durationMinutes),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await addClassAPI(classData as any);

      setFormData(initialFormData);
      setErrors({});
      toast.success("Turma criada com sucesso!");
      navigate("/turmas");
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      toast.error("Erro ao criar turma. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/turmas");
  };

  return (
    <div className="flex justify-center w-full">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Nome da Turma */}
        <FormInput
          id="name"
          name="name"
          label="Nome da Turma"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Iniciantes - 18h"
          required
          className="mb-5"
        />
        {errors.name && (
          <ErrorMessage type="error" message={errors.name} className="mb-4" />
        )}

        {/* Dias da Semana */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dias da Semana <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={`px-2 py-2 text-xs font-medium rounded transition ${
                  formData.days.includes(day.value)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>
          {errors.days && (
            <ErrorMessage type="error" message={errors.days} className="mt-2" />
          )}
        </div>

        {/* Horário e Duração */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <FormInput
              id="startTime"
              name="startTime"
              label="Horário de Início"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
            {errors.startTime && (
              <ErrorMessage
                type="error"
                message={errors.startTime}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <label
              htmlFor="durationMinutes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duração <span className="text-red-500">*</span>
            </label>
            <select
              id="durationMinutes"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="45">45 min</option>
              <option value="60">1h</option>
              <option value="90">1h30</option>
              <option value="120">2h</option>
            </select>
            {errors.durationMinutes && (
              <ErrorMessage
                type="error"
                message={errors.durationMinutes}
                className="mt-2"
              />
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="flex-1"
          >
            Criar Turma
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClassRegisterForm;
