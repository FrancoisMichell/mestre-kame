import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Home from "../Home";
import * as StudentContext from "../../components/student/StudentContext";
import type { Student } from "../../components/student/StudentTypes";

// Mock StudentContext
vi.mock("../../components/student/StudentContext", () => ({
  useStudents: vi.fn(),
}));

const mockStudents: Student[] = [
  {
    id: "1",
    name: "João Silva",
    belt: "branca",
    color: "#FFFFFF",
    birthday: "2000-05-15",
    trainingSince: "2024-01-10",
    email: "joao@email.com",
    isActive: true,
  },
  {
    id: "2",
    name: "Maria Santos",
    belt: "azul",
    color: "#2563eb",
    birthday: "1998-08-20",
    trainingSince: "2023-06-15",
    email: "maria@email.com",
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
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
    });

    renderHome();
    expect(screen.getByText("Lista de Alunos")).toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      isLoading: true,
      error: undefined,
      addStudent: vi.fn(),
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
      isLoading: false,
      error: mockError,
      addStudent: vi.fn(),
    });

    renderHome();

    expect(screen.getByText("Erro ao carregar alunos")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("should display generic error message when error has no message", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      isLoading: false,
      error: {} as Error,
      addStudent: vi.fn(),
    });

    renderHome();

    expect(screen.getByText("Erro ao carregar alunos")).toBeInTheDocument();
    expect(screen.getByText("Tente novamente mais tarde")).toBeInTheDocument();
  });

  it("should show empty state message when no students", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
    });

    renderHome();
    expect(screen.getByText("Nenhum aluno cadastrado.")).toBeInTheDocument();
  });

  it("should render student cards when students exist", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: mockStudents,
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
    });

    renderHome();

    // Names are rendered with ID like "João Silva - 1"
    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
    expect(screen.getByText(/Maria Santos/)).toBeInTheDocument();
  });

  it("should render correct number of student cards", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: mockStudents,
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
    });

    renderHome();

    // Check both student names are present
    const studentCards = screen.getAllByText(/João Silva|Maria Santos/);
    expect(studentCards.length).toBeGreaterThanOrEqual(2);
  });

  it("should not show loading or error when students are loaded", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: mockStudents,
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
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
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
    });

    const { container } = renderHome();
    const mainContainer = container.querySelector(".pt-24");

    expect(mainContainer).toHaveClass(
      "pt-24",
      "flex",
      "flex-col",
      "space-y-2",
      "p-5",
      "max-w-4xl",
      "mx-auto",
    );
  });

  it("should apply correct CSS classes to header", () => {
    vi.mocked(StudentContext.useStudents).mockReturnValue({
      students: [],
      isLoading: false,
      error: undefined,
      addStudent: vi.fn(),
    });

    renderHome();
    const header = screen.getByText("Lista de Alunos");

    expect(header).toHaveClass(
      "text-3xl",
      "font-bold",
      "mb-6",
      "text-red-900",
      "text-center",
    );
  });
});
