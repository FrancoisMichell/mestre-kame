import StudentCard from "../components/student/StudentCard";
import { useStudents } from "../components/student/StudentContext";
import { beltOptions, beltConfigs } from "../components/student/beltConfig";
import { StudentCardSkeleton } from "../components/student/StudentCardSkeleton";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import { useToggle } from "../hooks/useToggle";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isFiltersOpen, toggleFilters] = useToggle(false);
  const {
    students,
    meta,
    page,
    limit,
    sortBy,
    sortOrder,
    searchName,
    searchRegistry,
    filterBelt,
    filterIsActive,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    setSearchName,
    setSearchRegistry,
    setFilterBelt,
    setFilterIsActive,
    isLoading,
    error,
  } = useStudents();

  const clearFilters = () => {
    setSearchName("");
    setSearchRegistry("");
    setFilterBelt("");
    setFilterIsActive("");
  };

  const hasActiveFilters =
    searchName || searchRegistry || filterBelt || filterIsActive;

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

    return students.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    ) : hasActiveFilters ? (
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        title="Nenhum aluno encontrado"
        description={
          searchName || searchRegistry
            ? `Não encontramos alunos com os termos de busca "${
                searchName || searchRegistry
              }". Tente verificar a ortografia ou usar termos diferentes.`
            : `Não há alunos com os filtros selecionados. Experimente remover alguns filtros para ver mais resultados.`
        }
        action={{
          label: "Limpar Filtros",
          onClick: clearFilters,
          variant: "secondary",
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        }}
      />
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        title="Nenhum aluno cadastrado ainda"
        description="Comece cadastrando seu primeiro aluno para acompanhar o progresso no karatê. É rápido e fácil!"
        action={{
          label: "Cadastrar Primeiro Aluno",
          onClick: () => navigate("/cadastro"),
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
        }}
      />
    );
  };
  return (
    <div className="pt-20 md:pt-24 px-4 md:px-5 py-3 max-w-6xl mx-auto">
      {/* Card branco com todo o conteúdo */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Lista de Alunos
        </h1>

        {/* Botões de Filtros e Novo Aluno */}
        <div className="mb-4 flex gap-3">
          <button
            onClick={toggleFilters}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filtros e Ordenação</span>
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                !
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`}
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

          <button
            onClick={() => navigate("/cadastro")}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium text-sm"
            aria-label="Novo Aluno"
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
            <span className="hidden sm:inline">Novo Aluno</span>
          </button>
        </div>

        {/* Painel de Filtros e Ordenação */}
        {isFiltersOpen && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Seção de Filtros */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Filtros de Busca
              </h3>
              <div className="space-y-3">
                {/* Busca por Nome e Matrícula */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Buscar por nome..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

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
                      value={searchRegistry}
                      onChange={(e) => setSearchRegistry(e.target.value)}
                      placeholder="Buscar por matrícula..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Faixa e Status lado a lado */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
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
                      {beltOptions.map((b) => (
                        <option key={b} value={b}>
                          {beltConfigs[b].name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="filterIsActive"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="filterIsActive"
                      value={filterIsActive}
                      onChange={(e) => setFilterIsActive(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Todos</option>
                      <option value="true">Ativos</option>
                      <option value="false">Inativos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Seção de Ordenação */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Ordenação
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {/* Campo */}
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
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="name">Nome</option>
                    <option value="registry">Matrícula</option>
                    <option value="belt">Faixa</option>
                    <option value="createdAt">Data de Cadastro</option>
                  </select>
                </div>

                {/* Ordem */}
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
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="ASC">Crescente</option>
                    <option value="DESC">Decrescente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Botão de limpar filtros */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
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
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo principal (loading, error, lista de alunos, empty states) */}
        {content()}
      </div>

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
