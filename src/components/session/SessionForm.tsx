import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  CreateClassSessionDto,
  UpdateClassSessionDto,
  ClassSession,
} from "./SessionTypes";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import ErrorMessage from "../common/ErrorMessage";
import { useFetchClasses } from "../../api/hooks";

export interface SessionFormProps {
  session?: ClassSession;
  onSubmit: (
    data: CreateClassSessionDto | UpdateClassSessionDto,
  ) => Promise<void>;
  isLoading?: boolean;
}

const SessionForm: React.FC<SessionFormProps> = ({
  session,
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { classes } = useFetchClasses({ isActive: true });

  const [formData, setFormData] = useState({
    date: session?.date || "",
    startTime: session?.startTime || "",
    endTime: session?.endTime || "",
    notes: session?.notes || "",
    classId: session?.classId || "",
    teacherId: session?.teacherId || "teacher-1", // TODO: Get from auth context
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = "Data é obrigatória";
    }

    if (!formData.classId) {
      newErrors.classId = "Selecione uma turma";
    }

    // startTime and endTime are optional - will be set when session starts/ends
    // But if both are provided, validate them
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = "Horário de término deve ser após o início";
      }
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = "Observações devem ter no máximo 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(formData);
      navigate("/aulas");
    } catch (error) {
      console.error("Error submitting session:", error);
      setErrorMessage("Erro ao salvar aula. Tente novamente.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Auto-fill start and end times when class is selected (only if creating new session)
    if (name === "classId" && value && classes && !session) {
      const selectedClass = classes.find((c) => c.id === value);
      if (selectedClass && !formData.startTime && !formData.endTime) {
        // Calculate end time based on start time + duration
        const [hours, minutes] = selectedClass.startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(
          startDate.getTime() + selectedClass.durationMinutes * 60000,
        );
        const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

        setFormData((prev) => ({
          ...prev,
          [name]: value,
          startTime: selectedClass.startTime,
          endTime: endTime,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* Class Selection */}
      <div>
        <label
          htmlFor="classId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Turma <span className="text-red-500">*</span>
        </label>
        <select
          id="classId"
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.classId ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Selecione uma turma</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
        {errors.classId && (
          <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
        )}
      </div>

      {/* Date */}
      <FormInput
        label="Data"
        id="date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
        error={errors.date}
        min={today}
      />

      {/* Time Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Horário de Início"
          id="startTime"
          name="startTime"
          type="time"
          value={formData.startTime}
          onChange={handleChange}
          error={errors.startTime}
        />

        <FormInput
          label="Horário de Término"
          id="endTime"
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={handleChange}
          error={errors.endTime}
        />
      </div>
      <p className="text-sm text-gray-500 -mt-4">
        Os horários são opcionais e serão registrados automaticamente quando
        você iniciar e finalizar a aula.
      </p>

      {/* Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          placeholder="Ex: Foco em triangulações, revisão de raspagens..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.notes ? "border-red-500" : "border-gray-300"
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.notes && (
            <p className="text-sm text-red-600">{errors.notes}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.notes.length}/500
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : session ? "Atualizar" : "Criar Aula"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/aulas")}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
