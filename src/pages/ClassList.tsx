import type React from "react";
import ClassCard from "../components/class/ClassCard";
import { useClasses } from "../components/class/ClassContext";
import { Skeleton } from "../components/common/Skeleton";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

const ClassList: React.FC = () => {
  const { classes, meta, page, limit, setPage, setLimit, isLoading, error } =
    useClasses();

  const content = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <Skeleton key={index} height={120} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <ErrorMessage
          title="Erro ao carregar turmas"
          message={error?.message || "Tente novamente mais tarde"}
        />
      );
    }

    return classes.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
        {classes.map((classItem) => (
          <ClassCard key={classItem.id} classItem={classItem} />
        ))}
      </div>
    ) : (
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        }
        title="Nenhuma turma cadastrada ainda"
        description="Comece cadastrando sua primeira turma para organizar os treinos."
      />
    );
  };

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-5 py-3 max-w-6xl mx-auto">
      {/* Card branco com todo o conteúdo */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {/* Título */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Turmas</h1>
        </div>

        {/* Conteúdo principal */}
        {content()}
      </div>

      {/* Controles de Paginação */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 p-2.5 bg-gray-50 rounded-lg text-sm">
          {/* Info e Seletor de Itens */}
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

          {/* Navegação entre páginas */}
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
  );
};

export default ClassList;
