import type React from "react";
import { useEffect, useState } from "react";
import type { Belt, Student } from "./StudentTypes";
import { ENDPOINTS } from "../../api/endpoints";
import { apiClient } from "../../api/client";
import { beltOptions, getBeltName } from "./StudentUtils";
import { useNavigate, useParams } from "react-router-dom";
import { useStudents } from "./StudentContext";

const StudentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { refreshStudents } = useStudents();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [registry, setRegistry] = useState("");
  const [birthday, setBirthday] = useState("");
  const [trainingSince, setTrainingSince] = useState("");
  const [belt, setBelt] = useState<Belt>("White");
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
        console.error("Error fetching student:", err);
        setError("Erro ao carregar dados do estudante.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSaving(true);
      setError(null);

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
      navigate("/");
    } catch (err) {
      console.error("Error updating student:", err);
      setError("Erro ao salvar dados do estudante.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Estudante não encontrado
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Estudante
        </h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Matrícula */}
          <div className="mb-4">
            <label
              htmlFor="registry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Matrícula
            </label>
            <input
              type="text"
              id="registry"
              value={registry}
              onChange={(e) => setRegistry(e.target.value)}
              className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              onChange={(e) => setBelt(e.target.value as Belt)}
              required
              className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {beltOptions.map((b) => (
                <option key={b} value={b}>
                  {getBeltName(b)}
                </option>
              ))}
            </select>
          </div>

          {/* Data de Nascimento */}
          <div className="mb-4">
            <label
              htmlFor="birthday"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Treina Desde */}
          <div className="mb-4">
            <label
              htmlFor="trainingSince"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Treina Desde
            </label>
            <input
              type="date"
              id="trainingSince"
              value={trainingSince}
              onChange={(e) => setTrainingSince(e.target.value)}
              className="text-gray-900 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEdit;
