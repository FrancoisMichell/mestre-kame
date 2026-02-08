import { useState } from "react";
import { useFetchStudents, useEnrollStudent } from "../../api/hooks";
import StudentCard from "../student/StudentCard";
import { StudentCardSkeleton } from "../student/StudentCardSkeleton";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";
import { Modal } from "../common/Modal";
import { useDebounce } from "../../hooks/useDebounce";
import { toast } from "sonner";

interface StudentSelectionModalProps {
  classId: string;
  enrolledStudentIds: string[];
  onClose: () => void;
  onEnrollSuccess: () => void;
}

const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({
  classId,
  enrolledStudentIds,
  onClose,
  onEnrollSuccess,
}) => {
  const [searchNameInput, setSearchNameInput] = useState("");
  const [searchRegistryInput, setSearchRegistryInput] = useState("");
  const [filterBelt, setFilterBelt] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Debounce search inputs
  const searchName = useDebounce(searchNameInput, 500);
  const searchRegistry = useDebounce(searchRegistryInput, 500);

  // Fetch all students
  const { students, isLoading, error } = useFetchStudents({
    page: 1,
    limit: 100, // Fetch a large number to show all available students
    name: searchName,
    registry: searchRegistry,
    belt: filterBelt,
    isActive: includeInactive ? undefined : true, // Show only active by default
  });

  // Enroll mutation
  const enrollStudent = useEnrollStudent();

  // Filter out already enrolled students
  const availableStudents = students.filter(
    (student) => !enrolledStudentIds.includes(student.id),
  );

  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleEnroll = async () => {
    if (selectedStudentIds.length === 0) return;

    setIsEnrolling(true);
    try {
      // Enroll all selected students
      await Promise.all(
        selectedStudentIds.map((studentId) =>
          enrollStudent(classId, studentId),
        ),
      );

      const count = selectedStudentIds.length;
      toast.success(
        count === 1
          ? "Aluno adicionado com sucesso"
          : `${count} alunos adicionados com sucesso`,
      );
      onEnrollSuccess();
    } catch (err) {
      toast.error("Erro ao adicionar alunos à turma");
      console.error(err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const content = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <StudentCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <ErrorMessage
          title="Erro ao carregar alunos"
          message={error?.message || "Tente novamente mais tarde"}
        />
      );
    }

    const hasActiveFilters = searchName || searchRegistry || filterBelt;

    return availableStudents.length > 0 ? (
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {availableStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => toggleStudentSelection(student.id)}
            className={`cursor-pointer transition-all ${
              selectedStudentIds.includes(student.id)
                ? "ring-2 ring-blue-600 rounded-lg"
                : ""
            }`}
          >
            <StudentCard student={student} onClick={() => {}} />
          </div>
        ))}
      </div>
    ) : (
      <div className="min-h-96 flex items-center">
        <EmptyState
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  hasActiveFilters
                    ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    : "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                }
              />
            </svg>
          }
          title={
            hasActiveFilters
              ? "Nenhum resultado encontrado"
              : "Todos os alunos já estão matriculados"
          }
          description={
            hasActiveFilters
              ? "Não encontramos alunos disponíveis com os filtros aplicados. Tente ajustar os critérios de busca."
              : "Não há alunos disponíveis para adicionar a esta turma no momento."
          }
        />
      </div>
    );
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Adicionar Alunos à Turma">
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-gray-50 rounded-lg">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-3 md:p-4 text-left"
          >
            <h3 className="text-sm font-semibold text-gray-900">
              Filtros e Busca
            </h3>
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform md:hidden ${
                showFilters ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block px-3 md:px-4 pb-3 md:pb-4`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search by Name */}
              <div>
                <label
                  htmlFor="modalSearchName"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Nome
                </label>
                <input
                  id="modalSearchName"
                  type="text"
                  value={searchNameInput}
                  onChange={(e) => setSearchNameInput(e.target.value)}
                  placeholder="Buscar por nome..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Search by Registry */}
              <div>
                <label
                  htmlFor="modalSearchRegistry"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Matrícula
                </label>
                <input
                  id="modalSearchRegistry"
                  type="text"
                  value={searchRegistryInput}
                  onChange={(e) => setSearchRegistryInput(e.target.value)}
                  placeholder="Buscar por matrícula..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter by Belt */}
              <div>
                <label
                  htmlFor="modalFilterBelt"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Faixa
                </label>
                <select
                  id="modalFilterBelt"
                  value={filterBelt}
                  onChange={(e) => setFilterBelt(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="white">Branca</option>
                  <option value="yellow">Amarela</option>
                  <option value="orange">Laranja</option>
                  <option value="green">Verde</option>
                  <option value="blue">Azul</option>
                  <option value="brown">Marrom</option>
                  <option value="black">Preta</option>
                </select>
              </div>
            </div>

            {/* Include Inactive Checkbox */}
            <div className="mt-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-gray-700">
                  Incluir alunos inativos
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Student List */}
        {content()}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isEnrolling}
          >
            Cancelar
          </button>
          <button
            onClick={handleEnroll}
            disabled={selectedStudentIds.length === 0 || isEnrolling}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnrolling
              ? "Adicionando..."
              : selectedStudentIds.length === 0
                ? "Selecione alunos"
                : selectedStudentIds.length === 1
                  ? "Adicionar 1 aluno"
                  : `Adicionar ${selectedStudentIds.length} alunos`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentSelectionModal;
