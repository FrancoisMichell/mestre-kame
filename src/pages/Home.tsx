// import { useEffect, useState } from "react";

// import axios from "axios";
import StudentCard from "../components/student/StudentCard";
import { useStudents } from "../components/student/StudentContext";

const Home: React.FC = () => {
  const {
    students,
    meta,
    page,
    limit,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    isLoading,
    error,
  } = useStudents();

  const containerClass =
    "pt-20 md:pt-24 flex flex-col gap-2 md:gap-4 px-4 md:px-5 py-3 max-w-6xl mx-auto";
  const headerClass =
    "text-2xl md:text-3xl font-bold mb-3 md:mb-6 text-red-900 text-center";

  const content = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro ao carregar alunos</p>
          <p className="text-sm">
            {error?.message || "Tente novamente mais tarde"}
          </p>
        </div>
      );
    }

    return students.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    ) : (
      <p className="text-gray-600 text-center py-10">
        Nenhum aluno cadastrado.
      </p>
    );
  };
  return (
    <div className={containerClass}>
      <h1 className={headerClass}>Lista de Alunos</h1>

      {/* Controles de Ordenação */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ordenar por */}
          <div>
            <label
              htmlFor="sortBy"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Ordenar por
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="name">Nome</option>
              <option value="registry">Matrícula</option>
              <option value="belt">Faixa</option>
              <option value="createdAt">Data de Cadastro</option>
            </select>
          </div>

          {/* Direção */}
          <div>
            <label
              htmlFor="sortOrder"
              className="block text-xs font-medium text-gray-700 mb-1.5"
            >
              Direção
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="ASC">A → Z (Crescente)</option>
              <option value="DESC">Z → A (Decrescente)</option>
            </select>
          </div>
        </div>
      </div>

      {content()}

      {/* Controles de Paginação */}
      {meta && (
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

export default Home;
