import type React from "react";
import { useEffect, useState } from "react";
import type { Class } from "./ClassTypes";
import { ENDPOINTS } from "../../api/endpoints";
import { apiClient } from "../../api/client";
import { useNavigate, useParams } from "react-router-dom";
import { useClasses } from "./ClassContext";
import { Skeleton } from "../common/Skeleton";
import FormInput from "../common/FormInput";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { validateClass } from "../../utils/validation";
import { handleError, formatErrorForUser } from "../../utils/errorHandler";
import { toast } from "sonner";
import { DAYS_OF_WEEK } from "./daysConfig";
import { useUpdateClass } from "../../api/hooks";

const ClassEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { refreshClasses } = useClasses();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [classData, setClassData] = useState<Class | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const updateClassAPI = useUpdateClass();

  const [name, setName] = useState("");
  const [days, setDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [isActive, setIsActive] = useState(true);

  // Função helper para normalizar horário para formato HH:MM
  const normalizeTime = (time: string): string => {
    if (!time) return "";
    // Remove segundos se existirem (formato HH:MM:SS -> HH:MM)
    const parts = time.split(":");
    if (parts.length === 3) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }
    if (parts.length === 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }
    return time;
  };

  useEffect(() => {
    const fetchClass = async () => {
      if (!id) return;
      try {
        const response = await apiClient.get<Class>(
          ENDPOINTS.CLASSES.GET_BY_ID(id),
        );
        const data = response.data;

        setClassData(data);
        setName(data.name);
        // Garante que os dias são números, não strings
        setDays(Array.isArray(data.days) ? data.days.map(Number) : []);
        setStartTime(normalizeTime(data.startTime));
        setDurationMinutes(data.durationMinutes.toString());
        setIsActive(data.isActive);
      } catch (err) {
        const appError = handleError(err);
        const errorMessage = formatErrorForUser(appError);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClass();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Normaliza o horário antes de validar
    const normalizedStartTime = normalizeTime(startTime);

    // Valida todos os campos
    const validation = validateClass({
      name,
      days,
      startTime: normalizedStartTime,
      durationMinutes: Number(durationMinutes),
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updateClassAPI(id, {
        name,
        days,
        startTime: normalizedStartTime,
        durationMinutes: Number(durationMinutes),
        isActive,
      });

      await refreshClasses();
      toast.success("Turma atualizada com sucesso!");
      navigate("/turmas");
    } catch (err) {
      const appError = handleError(err);
      const errorMessage = formatErrorForUser(appError);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDayToggle = (day: number) => {
    setDays((prev) => {
      const newDays = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort();
      return newDays;
    });

    // Limpa erro de dias quando usuário seleciona
    if (validationErrors.days) {
      const newErrors = { ...validationErrors };
      delete newErrors.days;
      setValidationErrors(newErrors);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Skeleton width={200} height={32} className="mb-6" />
          <div className="space-y-4">
            <div>
              <Skeleton width={80} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={120} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={100} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={80} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={70} height={16} className="mb-2" />
              <Skeleton height={24} width={100} />
            </div>

            <div className="flex gap-4 pt-4">
              <Skeleton height={40} className="flex-1" />
              <Skeleton height={40} className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Turma não encontrada" />
        <Button
          onClick={() => navigate("/turmas")}
          variant="secondary"
          className="mt-4"
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Editar Turma
        </h1>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <form onSubmit={handleSubmit}>
          <FormInput
            id="name"
            name="name"
            label="Nome da Turma"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (validationErrors.name) {
                const newErrors = { ...validationErrors };
                delete newErrors.name;
                setValidationErrors(newErrors);
              }
            }}
            required
            className="mb-4"
          />
          {validationErrors.name && (
            <ErrorMessage
              type="error"
              message={validationErrors.name}
              className="mb-4"
            />
          )}

          {/* Dias da semana */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias da Semana <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      days.includes(day.value)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {day.short}
                </button>
              ))}
            </div>
            {validationErrors.days && (
              <ErrorMessage
                type="error"
                message={validationErrors.days}
                className="mt-2"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <FormInput
                id="startTime"
                name="startTime"
                label="Horário de Início"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (validationErrors.startTime) {
                    const newErrors = { ...validationErrors };
                    delete newErrors.startTime;
                    setValidationErrors(newErrors);
                  }
                }}
                required
              />
              {validationErrors.startTime && (
                <ErrorMessage
                  type="error"
                  message={validationErrors.startTime}
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
                value={durationMinutes}
                onChange={(e) => {
                  setDurationMinutes(e.target.value);
                  if (validationErrors.durationMinutes) {
                    const newErrors = { ...validationErrors };
                    delete newErrors.durationMinutes;
                    setValidationErrors(newErrors);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora e 30 min</option>
                <option value="120">2 horas</option>
              </select>
              {validationErrors.durationMinutes && (
                <ErrorMessage
                  type="error"
                  message={validationErrors.durationMinutes}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          {/* Status ativo/inativo */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Turma ativa
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/turmas")}
              disabled={isSaving}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassEdit;
