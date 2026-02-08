import { useState } from "react";
import { useFetchClassStudents, useUnenrollStudent } from "../../api/hooks";
import StudentCard from "../student/StudentCard";
import { StudentCardSkeleton } from "../student/StudentCardSkeleton";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { useDebounce } from "../../hooks/useDebounce";
import { useResponsiveLimit } from "../../hooks/useResponsiveLimit";
import { toast } from "sonner";
import StudentSelectionModal from "./StudentSelectionModal";

interface ClassStudentsListProps {
  classId: string;
}

const ClassStudentsList: React.FC<ClassStudentsListProps> = ({ classId }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Responsive pagination limit
  const responsiveLimit = useResponsiveLimit();

  // Filters and sorting state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(responsiveLimit);
  const [sortBy, setSortBy] = useState<"name" | "registry" | "belt">("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [searchNameInput, setSearchNameInput] = useState("");
  const [searchRegistryInput, setSearchRegistryInput] = useState("");
  const [filterBelt, setFilterBelt] = useState("");

  // Debounce search inputs
  const searchName = useDebounce(searchNameInput, 500);
  const searchRegistry = useDebounce(searchRegistryInput, 500);

  // Fetch enrolled students
  const { students, meta, isLoading, error, mutate } = useFetchClassStudents(
    classId,
    {
      page,
      limit,
      sortBy,
      sortOrder,
      name: searchName,
      registry: searchRegistry,
      belt: filterBelt,
    },
  );

  // Unenroll mutation
  const unenrollStudent = useUnenrollStudent();

  // Update limit when responsive limit changes
  useState(() => {
    setLimit(responsiveLimit);
  });

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    try {
      await unenrollStudent(classId, studentToRemove.id);
      toast.success(`${studentToRemove.name} removido da turma com sucesso`);
      mutate(); // Refresh the list
      setStudentToRemove(null);
    } catch (err) {
      toast.error("Erro ao remover aluno da turma");
      console.error(err);
    }
  };

  const handleEnrollSuccess = () => {
    mutate(); // Refresh the list
    setShowEnrollModal(false);
  };

  const content = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {Array.from({ length: limit }).map((_, index) => (
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

    // Check for active filters
    const hasActiveFilters = searchName || searchRegistry || filterBelt;

    return students.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
        {students.map((student) => (
          <div key={student.id} className="relative">
            <StudentCard student={student} hideStatus={true} />
            {/* Remove button overlay */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStudentToRemove({ id: student.id, name: student.name });
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition-colors z-10"
              aria-label="Remover aluno da turma"
              title="Remover aluno da turma"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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
              : "Nenhum aluno matriculado ainda"
          }
          description={
            hasActiveFilters
              ? "Não encontramos alunos com os filtros aplicados. Tente ajustar os critérios de busca."
              : "Comece adicionando alunos a esta turma para acompanhar sua frequência e progresso."
          }
          action={
            hasActiveFilters
              ? undefined
              : {
                  label: "Adicionar Alunos",
                  onClick: () => setShowEnrollModal(true),
                  icon: (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  ),
                }
          }
        />
      </div>
    );
  };

  return (
    <>
      <div>
        {/* Title and Add Button */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Alunos Matriculados
          </h2>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap"
            aria-label="Adicionar Alunos"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Adicionar Alunos</span>
          </button>
        </div>

        {/* Filters Section */}
        <div className="mb-4">
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
              className={`${showFilters ? "block" : "hidden"} md:block px-3 pb-3 md:px-4 md:pb-4`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Search by Name */}
                <div>
                  <label
                    htmlFor="searchName"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Nome
                  </label>
                  <input
                    id="searchName"
                    type="text"
                    value={searchNameInput}
                    onChange={(e) => setSearchNameInput(e.target.value)}
                    placeholder="Buscar por nome..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Search by Registry */}
                <div>
                  <label
                    htmlFor="searchRegistry"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Matrícula
                  </label>
                  <input
                    id="searchRegistry"
                    type="text"
                    value={searchRegistryInput}
                    onChange={(e) => setSearchRegistryInput(e.target.value)}
                    placeholder="Buscar por matrícula..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Filter by Belt */}
                <div>
                  <label
                    htmlFor="filterBelt"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Faixa
                  </label>
                  <select
                    id="filterBelt"
                    value={filterBelt}
                    onChange={(e) => setFilterBelt(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            </div>
          </div>
        </div>

        {/* Sort Section */}
        <div className="mb-4">
          <div className="bg-gray-50 rounded-lg">
            <button
              onClick={() => setShowSort(!showSort)}
              className="w-full flex items-center justify-between p-3 md:p-4 text-left"
            >
              <h3 className="text-sm font-semibold text-gray-900">Ordenação</h3>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform md:hidden ${
                  showSort ? "rotate-180" : ""
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
              className={`${showSort ? "block" : "hidden"} md:block px-3 pb-3 md:px-4 md:pb-4`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Sort Field */}
                <div>
                  <label
                    htmlFor="sortBy"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Campo
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "name" | "registry" | "belt")
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="name">Nome</option>
                    <option value="registry">Matrícula</option>
                    <option value="belt">Faixa</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label
                    htmlFor="sortOrder"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Ordem
                  </label>
                  <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as "ASC" | "DESC")
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="ASC">Crescente</option>
                    <option value="DESC">Decrescente</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {content()}

        {/* Pagination Controls */}
        {meta && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 p-2.5 bg-gray-50 rounded-lg text-sm">
            {/* Info and Items Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-700">
                Total: <span className="font-semibold">{meta.total}</span>
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor="itemsPerPage" className="text-xs text-gray-700">
                  Por página:
                </label>
                <select
                  id="itemsPerPage"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={18}>18</option>
                  <option value={24}>24</option>
                  <option value={30}>30</option>
                </select>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ←
              </button>
              <span className="text-xs text-gray-700 px-1">
                {page}/{meta.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= meta.totalPages}
                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Selection Modal */}
      {showEnrollModal && (
        <StudentSelectionModal
          classId={classId}
          enrolledStudentIds={students.map((s) => s.id)}
          onClose={() => setShowEnrollModal(false)}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}

      {/* Confirm Remove Dialog */}
      {studentToRemove && (
        <ConfirmDialog
          isOpen={true}
          title="Remover Aluno da Turma"
          message={`Tem certeza que deseja remover ${studentToRemove.name} desta turma? Esta ação não pode ser desfeita.`}
          confirmText="Remover"
          cancelText="Cancelar"
          onConfirm={handleRemoveStudent}
          onClose={() => setStudentToRemove(null)}
          variant="danger"
        />
      )}
    </>
  );
};

export default ClassStudentsList;
