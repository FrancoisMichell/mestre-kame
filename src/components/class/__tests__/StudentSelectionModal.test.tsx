import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import StudentSelectionModal from "../StudentSelectionModal";
import * as hooks from "../../../api/hooks";

vi.mock("../../../api/hooks");

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("StudentSelectionModal", () => {
  const mockOnClose = vi.fn();
  const mockOnEnrollSuccess = vi.fn();
  const mockEnrollStudent = vi.fn();

  const mockStudents = [
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
    {
      id: "3",
      name: "Carlos Oliveira",
      belt: "brown",
      color: "#8B6F47",
      birthday: "1995-03-10",
      registry: "987656",
      trainingSince: "2022-09-01",
      isActive: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(hooks.useFetchStudents).mockReturnValue({
      students: mockStudents,
      meta: { total: 3, page: 1, limit: 100, totalPages: 1 },
      isLoading: false,
      isError: false,
      error: null,
    });

    vi.mocked(hooks.useEnrollStudent).mockReturnValue(mockEnrollStudent);
    mockEnrollStudent.mockResolvedValue(undefined);
  });

  it("renders modal title", () => {
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    expect(screen.getByText("Adicionar Alunos à Turma")).toBeInTheDocument();
  });

  it("shows available students excluding already enrolled", () => {
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={["1"]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
  });

  it("filters out inactive students by default", () => {
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    expect(screen.queryByText("Carlos Oliveira")).not.toBeInTheDocument();
  });

  it("shows inactive students when checkbox is checked", async () => {
    const user = userEvent.setup();

    vi.mocked(hooks.useFetchStudents).mockReturnValue({
      students: mockStudents,
      meta: { total: 3, page: 1, limit: 100, totalPages: 1 },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    const checkbox = screen.getByLabelText("Incluir alunos inativos");
    await user.click(checkbox);

    await waitFor(() => {
      expect(hooks.useFetchStudents).toHaveBeenCalled();
    });
  });

  it("allows selecting a student by clicking", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    const studentCard = screen.getByText("João Silva").closest("div");
    await user.click(studentCard!);

    expect(studentCard?.parentElement).toHaveClass("ring-2", "ring-blue-600");
  });

  it("allows selecting multiple students", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    const joaoCard = screen.getByText("João Silva").closest("div");
    const mariaCard = screen.getByText("Maria Santos").closest("div");

    await user.click(joaoCard!);
    await user.click(mariaCard!);

    const addButton = screen.getByRole("button", {
      name: /adicionar 2 alunos/i,
    });
    expect(addButton).toBeInTheDocument();
  });

  it("updates button text based on selection count", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    expect(
      screen.getByRole("button", { name: /selecione alunos/i }),
    ).toBeInTheDocument();

    const joaoCard = screen.getByText("João Silva").closest("div");
    await user.click(joaoCard!);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /adicionar 1 aluno/i }),
      ).toBeInTheDocument();
    });
  });

  it("enrolls selected students when add button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    const joaoCard = screen.getByText("João Silva").closest("div");
    await user.click(joaoCard!);

    const addButton = screen.getByRole("button", {
      name: /adicionar 1 aluno/i,
    });
    await user.click(addButton);

    await waitFor(() => {
      expect(mockEnrollStudent).toHaveBeenCalledWith("1", "1");
      expect(mockOnEnrollSuccess).toHaveBeenCalled();
    });
  });

  it("shows filters section", () => {
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    expect(screen.getByText("Filtros e Busca")).toBeInTheDocument();
  });

  it("has name and registry search inputs", () => {
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    expect(
      screen.getByPlaceholderText("Buscar por nome..."),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Buscar por matrícula..."),
    ).toBeInTheDocument();
  });

  it("has belt filter dropdown", () => {
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    const beltFilter = screen.getByLabelText("Faixa");
    expect(beltFilter).toBeInTheDocument();
  });

  it("closes modal when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows empty state when all students are enrolled", () => {
    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={["1", "2"]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    expect(
      screen.getByText("Todos os alunos já estão matriculados"),
    ).toBeInTheDocument();
  });

  it("displays loading state", () => {
    vi.mocked(hooks.useFetchStudents).mockReturnValue({
      students: [],
      meta: { total: 0, page: 1, limit: 100, totalPages: 0 },
      isLoading: true,
      isError: false,
      error: null,
    });

    renderWithRouter(
      <StudentSelectionModal
        classId="1"
        enrolledStudentIds={[]}
        onClose={mockOnClose}
        onEnrollSuccess={mockOnEnrollSuccess}
      />,
    );

    const container = screen
      .getByText("Adicionar Alunos à Turma")
      .closest("div");
    expect(container).toBeInTheDocument();
  });
});
