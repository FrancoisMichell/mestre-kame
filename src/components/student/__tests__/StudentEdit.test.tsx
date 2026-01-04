import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StudentEdit from "../StudentEdit";
import * as StudentContext from "../StudentContext";
import { apiClient } from "../../../api/client";
import type { Student } from "../StudentTypes";
import type { StudentContextType } from "../StudentContext";

// Mock do Sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock do apiClient
vi.mock("../../../api/client");

// Mock do StudentContext
vi.mock("../StudentContext", async () => {
  const actual = await vi.importActual("../StudentContext");
  return {
    ...actual,
    useStudents: vi.fn(),
  };
});

const mockStudent: Student = {
  id: "1",
  name: "João Silva",
  belt: "blue",
  color: "#2563eb",
  birthday: "2000-05-15",
  trainingSince: "2024-01-10",
  registry: "987654",
  isActive: true,
};

const mockRefreshStudents = vi.fn();
const mockNavigate = vi.fn();

// Mock do useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderStudentEdit = (studentId = "1") => {
  return render(
    <MemoryRouter initialEntries={[`/estudante/${studentId}`]}>
      <Routes>
        <Route path="/estudante/:id" element={<StudentEdit />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("StudentEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [mockStudent],
      meta: undefined,
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
      refreshStudents: mockRefreshStudents,
      page: 1,
      limit: 12,
      setPage: vi.fn(),
      setLimit: vi.fn(),
    } as unknown as StudentContextType);
  });

  it("should show loading skeleton while fetching student data", () => {
    vi.mocked(apiClient.get).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const { container } = renderStudentEdit();

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should load and display student data", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Estudante")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    expect(screen.getByDisplayValue("987654")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2000-05-15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-01-10")).toBeInTheDocument();
  });

  it("should display error when student is not found", async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(
      new Error("Student not found"),
    );

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByText("Estudante não encontrado")).toBeInTheDocument();
    });

    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("should update student name field", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText("Nome *");
    await user.clear(nameInput);
    await user.type(nameInput, "Maria Santos");

    expect(screen.getByDisplayValue("Maria Santos")).toBeInTheDocument();
  });

  it("should update belt selection", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByLabelText("Faixa *")).toBeInTheDocument();
    });

    const beltSelect = screen.getByLabelText("Faixa *");
    await user.selectOptions(beltSelect, "black");

    expect(screen.getByDisplayValue("Preta")).toBeInTheDocument();
  });

  it("should toggle active status checkbox", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByLabelText("Estudante Ativo")).toBeInTheDocument();
    });

    const checkbox = screen.getByLabelText("Estudante Ativo");
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should submit form and update student", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });
    vi.mocked(apiClient.patch).mockResolvedValueOnce({
      data: { ...mockStudent, name: "Maria Santos" },
    });

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText("Nome *");
    await user.clear(nameInput);
    await user.type(nameInput, "Maria Santos");

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalledWith("/students/1", {
        name: "Maria Santos",
        registry: "987654",
        birthday: "2000-05-15",
        trainingSince: "2024-01-10",
        belt: "blue",
        isActive: true,
      });
    });

    expect(mockRefreshStudents).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should display error message when update fails", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });
    vi.mocked(apiClient.patch).mockRejectedValueOnce(
      new Error("Network error"),
    );

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    // O erro é exibido via ErrorMessage component com a mensagem formatada
    await waitFor(() => {
      const errorMessage = screen.queryByText(/Network error|Erro ao/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("should show loading state while saving", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });
    vi.mocked(apiClient.patch).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    // O botão fica desabilitado enquanto salva
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it("should navigate back when cancel button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Estudante")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancelar");
    await user.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should disable buttons while saving", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockStudent,
    });
    vi.mocked(apiClient.patch).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("Salvar Alterações");
    const cancelButton = screen.getByText("Cancelar");

    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  it("should handle empty optional fields", async () => {
    const user = userEvent.setup();
    const studentWithoutDates = {
      ...mockStudent,
      birthday: null,
      trainingSince: null,
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: studentWithoutDates,
    });
    vi.mocked(apiClient.patch).mockResolvedValueOnce({
      data: studentWithoutDates,
    });

    renderStudentEdit();

    await waitFor(() => {
      expect(screen.getByText("Editar Estudante")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("Salvar Alterações");
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalledWith("/students/1", {
        name: "João Silva",
        registry: "987654",
        birthday: null,
        trainingSince: null,
        belt: "blue",
        isActive: true,
      });
    });
  });
});
