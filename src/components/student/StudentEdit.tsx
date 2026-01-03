import type React from "react";
import { useEffect, useState } from "react";
import type { Belt, Student } from "./StudentTypes";
import { ENDPOINTS } from "../../api/endpoints";
import { apiClient } from "../../api/client";
import { beltOptions, beltConfigs } from "./beltConfig";
import { useNavigate, useParams } from "react-router-dom";
import { useStudents } from "./StudentContext";
import { Skeleton } from "../common/Skeleton";
import FormInput from "../common/FormInput";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { validateStudent } from "../../utils/validation";
import { handleError, formatErrorForUser } from "../../utils/errorHandler";
import { toast } from "sonner";
import { ConfirmDialog } from "../common/ConfirmDialog";

const StudentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { refreshStudents } = useStudents();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [name, setName] = useState("");
  const [registry, setRegistry] = useState("");
  const [birthday, setBirthday] = useState("");
  const [trainingSince, setTrainingSince] = useState("");
  const [belt, setBelt] = useState<Belt>("white");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        const response = await apiClient.get<Student>(
          ENDPOINTS.STUDENTS.GET_BY_ID(id),
        );
        const studentData = response.data;

        setStudent(studentData);
        setName(studentData.name);
        setRegistry(studentData.registry);
        setBirthday(studentData.birthday || "");
        setTrainingSince(studentData.trainingSince || "");
        setBelt(studentData.belt);
        setIsActive(studentData.isActive);
      } catch (err) {
        const appError = handleError(err);
        const errorMessage = formatErrorForUser(appError);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Valida todos os campos
    const validation = validateStudent({
      name,
      registry,
      belt,
      birthday,
      trainingSince,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setValidationErrors({});

      const updatedStudent = {
        name,
        registry,
        birthday: birthday || null,
        trainingSince: trainingSince || null,
        belt,
        isActive,
      };

      await apiClient.patch<Student>(
        ENDPOINTS.STUDENTS.UPDATE(id),
        updatedStudent,
      );

      await refreshStudents();
      toast.success("Aluno atualizado com sucesso!");
      navigate("/");
    } catch (err) {
      const appError = handleError(err);
      const errorMessage = formatErrorForUser(appError);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await apiClient.delete(ENDPOINTS.STUDENTS.DELETE(id));
      toast.success("Aluno excluído com sucesso!");
      await refreshStudents();
      navigate("/");
    } catch (err) {
      const appError = handleError(err);
      const errorMessage = formatErrorForUser(appError);
      toast.error(errorMessage);
      throw err; // Propaga o erro para o ConfirmDialog manter o modal aberto
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <Skeleton width="60%" height={32} className="mb-6" />

          <div className="space-y-4">
            <div>
              <Skeleton width={60} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={80} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={100} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={120} height={16} className="mb-2" />
              <Skeleton height={40} />
            </div>
            <div>
              <Skeleton width={50} height={16} className="mb-2" />
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

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Estudante não encontrado" />
        <Button
          onClick={() => navigate("/")}
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Estudante
        </h1>

        {error && <ErrorMessage message={error} className="mb-4" />}

        <form onSubmit={handleSubmit}>
          <FormInput
            id="name"
            name="name"
            label="Nome"
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

          <FormInput
            id="registry"
            name="registry"
            label="Matrícula"
            type="text"
            value={registry}
            onChange={(e) => {
              setRegistry(e.target.value);
              if (validationErrors.registry) {
                const newErrors = { ...validationErrors };
                delete newErrors.registry;
                setValidationErrors(newErrors);
              }
            }}
            className="mb-4"
          />
          {validationErrors.registry && (
            <ErrorMessage
              type="error"
              message={validationErrors.registry}
              className="mb-4"
            />
          )}

          {/* Faixa */}
          <div className="mb-4">
            <label
              htmlFor="belt"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Faixa *
            </label>
            <select
              id="belt"
              value={belt}
              onChange={(e) => {
                setBelt(e.target.value as Belt);
                if (validationErrors.belt) {
                  const newErrors = { ...validationErrors };
                  delete newErrors.belt;
                  setValidationErrors(newErrors);
                }
              }}
              required
              className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {beltOptions.map((b) => (
                <option key={b} value={b}>
                  {beltConfigs[b].name}
                </option>
              ))}
            </select>
            {validationErrors.belt && (
              <ErrorMessage
                type="error"
                message={validationErrors.belt}
                className="mt-2"
              />
            )}
          </div>

          <FormInput
            id="birthday"
            name="birthday"
            label="Data de Nascimento"
            type="date"
            value={birthday}
            onChange={(e) => {
              setBirthday(e.target.value);
              if (validationErrors.birthday) {
                const newErrors = { ...validationErrors };
                delete newErrors.birthday;
                setValidationErrors(newErrors);
              }
            }}
            className="mb-4"
          />
          {validationErrors.birthday && (
            <ErrorMessage
              type="error"
              message={validationErrors.birthday}
              className="mb-4"
            />
          )}

          <FormInput
            id="trainingSince"
            name="trainingSince"
            label="Treina Desde"
            type="date"
            value={trainingSince}
            onChange={(e) => {
              setTrainingSince(e.target.value);
              if (validationErrors.trainingSince) {
                const newErrors = { ...validationErrors };
                delete newErrors.trainingSince;
                setValidationErrors(newErrors);
              }
            }}
            className="mb-4"
          />
          {validationErrors.trainingSince && (
            <ErrorMessage
              type="error"
              message={validationErrors.trainingSince}
              className="mb-4"
            />
          )}

          {/* Status */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Estudante Ativo
              </span>
            </label>
          </div>

          {/* Informações não editáveis
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Informações do Sistema
            </h3>
            <p className="text-sm text-gray-600">
              <strong>ID:</strong> {student.id}
            </p>
          </div> */}

          {/* Botões */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                loading={isSaving}
                className="flex-1"
              >
                Salvar Alterações
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="secondary"
                disabled={isSaving}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>

            {/* Botão de exclusão */}
            <Button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              disabled={isSaving}
              className="w-full"
            >
              Excluir Aluno
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Excluir Aluno"
        message={`Tem certeza que deseja excluir o aluno ${name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default StudentEdit;
