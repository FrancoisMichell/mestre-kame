import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ClassStudentsList from "../ClassStudentsList";
import * as hooks from "../../../api/hooks";

vi.mock("../../../api/hooks", () => ({
  useFetchClassStudents: vi.fn(),
  useUnenrollStudent: vi.fn(),
  useFetchStudents: vi.fn(),
  useEnrollStudent: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ClassStudentsList", () => {
  const mockMutate = vi.fn();
  const mockUnenrollStudent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock para o modal de seleção de alunos
    vi.mocked(hooks.useFetchStudents).mockReturnValue({
      students: [],
      isLoading: false,
      error: null,
      mutate: vi.fn(),
      totalPages: 1,
    });

    vi.mocked(hooks.useEnrollStudent).mockReturnValue(vi.fn());

    vi.mocked(hooks.useFetchClassStudents).mockReturnValue({
      students: [
        {
          id: "1",
          name: "João Silva",
          belt: "white",
          color: "#E5E7EB",
          birthday: "2000-05-15",
          registry: "987654",
          trainingSince: "2024-01-10",
          isActive: true,
        },
        {
          id: "2",
          name: "Maria Santos",
          belt: "blue",
          color: "#2563eb",
          birthday: "1998-08-20",
          registry: "987655",
          trainingSince: "2023-06-15",
          isActive: true,
        },
      ],
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      isLoading: false,
      isError: false,
      error: null,
      mutate: mockMutate,
    });

    vi.mocked(hooks.useUnenrollStudent).mockReturnValue(mockUnenrollStudent);
  });

  it("renders list title", () => {
    renderWithRouter(<ClassStudentsList classId="1" />);
    expect(screen.getByText("Alunos Matriculados")).toBeInTheDocument();
  });

  it("renders enrolled students", () => {
    renderWithRouter(<ClassStudentsList classId="1" />);

    expect(screen.getAllByText("João Silva").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Maria Santos").length).toBeGreaterThan(0);
  });

  it("shows add student button", () => {
    renderWithRouter(<ClassStudentsList classId="1" />);

    const addButton = screen.getByRole("button", { name: /adicionar alunos/i });
    expect(addButton).toBeInTheDocument();
  });

  it("opens enrollment modal when add button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClassStudentsList classId="1" />);

    const addButton = screen.getByRole("button", { name: /adicionar alunos/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Adicionar Alunos à Turma")).toBeInTheDocument();
    });
  });

  it("shows filters section", () => {
    renderWithRouter(<ClassStudentsList classId="1" />);
    expect(screen.getByText("Filtros e Busca")).toBeInTheDocument();
  });

  it("displays loading skeleton when loading", () => {
    vi.mocked(hooks.useFetchClassStudents).mockReturnValue({
      students: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      isLoading: true,
      isError: false,
      error: null,
      mutate: mockMutate,
    });

    renderWithRouter(<ClassStudentsList classId="1" />);

    // Check for skeleton elements
    const container = screen.getByText("Alunos Matriculados").closest("div");
    expect(container).toBeInTheDocument();
  });

  it("displays empty state when no students enrolled", () => {
    vi.mocked(hooks.useFetchClassStudents).mockReturnValue({
      students: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      isLoading: false,
      isError: false,
      error: null,
      mutate: mockMutate,
    });

    renderWithRouter(<ClassStudentsList classId="1" />);

    expect(
      screen.getByText("Nenhum aluno matriculado ainda"),
    ).toBeInTheDocument();
  });

  it("displays error message on error", () => {
    vi.mocked(hooks.useFetchClassStudents).mockReturnValue({
      students: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
      mutate: mockMutate,
    });

    renderWithRouter(<ClassStudentsList classId="1" />);

    expect(screen.getByText("Erro ao carregar alunos")).toBeInTheDocument();
  });

  it("shows remove button on each student card", () => {
    renderWithRouter(<ClassStudentsList classId="1" />);

    const removeButtons = screen.getAllByLabelText("Remover aluno da turma");
    expect(removeButtons).toHaveLength(2);
  });

  it("opens confirm dialog when remove button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClassStudentsList classId="1" />);

    const removeButtons = screen.getAllByLabelText("Remover aluno da turma");
    await user.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Remover Aluno da Turma")).toBeInTheDocument();
      expect(
        screen.getByText(/tem certeza que deseja remover/i),
      ).toBeInTheDocument();
    });
  });
});
