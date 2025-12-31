import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Home from "../Home";
import * as StudentContext from "../../components/student/StudentContext";
import type { Student } from "../../components/student/StudentTypes";
import type { PaginationMeta } from "../../types/api";

// Mock StudentContext
vi.mock("../../components/student/StudentContext", () => ({
  useStudents: vi.fn(),
}));

const mockStudents: Student[] = [
  {
    id: "1",
    name: "João Silva",
    belt: "white",
    color: "#FFFFFF",
    birthday: "2000-05-15",
    trainingSince: "2024-01-10",
    registry: "987654",
    isActive: true,
  },
  {
    id: "2",
    name: "Maria Santos",
    belt: "blue",
    color: "#2563eb",
    birthday: "1998-08-20",
    trainingSince: "2023-06-15",
    registry: "987655",
    isActive: false,
  },
];

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );
};

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render page title", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    renderHome();
    expect(screen.getByText("Lista de Alunos")).toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: true,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    const { container } = renderHome();
    const spinner = container.querySelector(".animate-spin");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      "rounded-full",
      "h-12",
      "w-12",
      "border-b-2",
      "border-red-900",
    );
  });

  it("should display error message when error exists", () => {
    const mockError = new Error("Network error");
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: mockError,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    renderHome();

    expect(screen.getByText("Erro ao carregar alunos")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("should display generic error message when error has no message", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: {} as Error,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    renderHome();

    expect(screen.getByText("Erro ao carregar alunos")).toBeInTheDocument();
    expect(screen.getByText("Tente novamente mais tarde")).toBeInTheDocument();
  });

  it("should show empty state message when no students", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    renderHome();
    expect(screen.getByText("Nenhum aluno cadastrado.")).toBeInTheDocument();
  });

  it("should render student cards when students exist", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: mockStudents,
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    renderHome();

    // Names are rendered with ID like "João Silva - 1"
    expect(screen.getAllByText(/João Silva/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Maria Santos/i)[0]).toBeInTheDocument();
  });

  it("should render correct number of student cards", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: mockStudents,
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    renderHome();

    // Check both student names are present
    const studentCards = screen.getAllByText(/João Silva|Maria Santos/);
    expect(studentCards.length).toBeGreaterThanOrEqual(2);
  });

  it("should not show loading or error when students are loaded", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: mockStudents,
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    const { container } = renderHome();

    expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Erro ao carregar alunos"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum aluno cadastrado."),
    ).not.toBeInTheDocument();
  });

  it("should apply correct CSS classes to container", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    const { container } = renderHome();
    const mainContainer = container.querySelector(".pt-20");

    expect(mainContainer).toHaveClass("flex", "flex-col", "mx-auto");
  });

  it("should apply correct CSS classes to header", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      meta: undefined,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: vi.fn(),
    });

    renderHome();
    const header = screen.getByText("Lista de Alunos");

    expect(header).toHaveClass("font-bold", "text-red-900", "text-center");
  });

  // Testes de paginação
  describe("Pagination", () => {
    const mockMeta: PaginationMeta = {
      total: 50,
      page: 2,
      limit: 12,
      totalPages: 5,
    };

    it("should display pagination controls when meta is provided", () => {
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: mockMeta,
        page: 2,
        limit: 12,
        setPage: vi.fn(),
        setLimit: vi.fn(),
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      renderHome();

      expect(screen.getByText(/Total:/)).toBeInTheDocument();
      expect(screen.getByText(/50/)).toBeInTheDocument();
      expect(screen.getByText(/Por página:/)).toBeInTheDocument();
      expect(screen.getByText(/2\/5/)).toBeInTheDocument();
    });

    it("should not display pagination controls when meta is not provided", () => {
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: undefined,
        page: 1,
        limit: 12,
        setPage: vi.fn(),
        setLimit: vi.fn(),
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      renderHome();

      expect(screen.queryByText(/Total:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Por página:/)).not.toBeInTheDocument();
    });

    it("should call setPage when clicking previous button", async () => {
      const setPageMock = vi.fn();
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: mockMeta,
        page: 2,
        limit: 12,
        setPage: setPageMock,
        setLimit: vi.fn(),
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      renderHome();
      const prevButton = screen.getByRole("button", { name: "←" });

      await userEvent.click(prevButton);
      expect(setPageMock).toHaveBeenCalledWith(1);
    });

    it("should call setPage when clicking next button", async () => {
      const setPageMock = vi.fn();
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: mockMeta,
        page: 2,
        limit: 12,
        setPage: setPageMock,
        setLimit: vi.fn(),
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      renderHome();
      const nextButton = screen.getByRole("button", { name: "→" });

      await userEvent.click(nextButton);
      expect(setPageMock).toHaveBeenCalledWith(3);
    });

    it("should disable previous button on first page", () => {
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: { ...mockMeta, page: 1 },
        page: 1,
        limit: 12,
        setPage: vi.fn(),
        setLimit: vi.fn(),
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      renderHome();
      const prevButton = screen.getByRole("button", { name: "←" });

      expect(prevButton).toBeDisabled();
    });

    it("should disable next button on last page", () => {
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: { ...mockMeta, page: 5, totalPages: 5 },
        page: 5,
        limit: 12,
        setPage: vi.fn(),
        setLimit: vi.fn(),
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      renderHome();
      const nextButton = screen.getByRole("button", { name: "→" });

      expect(nextButton).toBeDisabled();
    });

    it("should call setLimit when changing items per page", async () => {
      const setLimitMock = vi.fn();
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: mockMeta,
        page: 2,
        limit: 12,
        setPage: vi.fn(),
        setLimit: setLimitMock,
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      renderHome();
      const select = screen.getByLabelText(/Por página:/);

      await userEvent.selectOptions(select, "24");
      expect(setLimitMock).toHaveBeenCalledWith(24);
    });

    it("should display grid layout for student cards", () => {
      vi.mocked(StudentContext.useStudents).mockReturnValue({
        students: mockStudents,
        meta: mockMeta,
        page: 1,
        limit: 12,
        setPage: vi.fn(),
        setLimit: vi.fn(),
        isLoading: false,
        error: undefined,
        addStudent: vi.fn(),
        refreshStudents: vi.fn(),
      });

      const { container } = renderHome();
      const gridContainer = container.querySelector(".grid");

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass(
        "grid-cols-1",
        "lg:grid-cols-2",
        "xl:grid-cols-3",
      );
    });
  });
});
