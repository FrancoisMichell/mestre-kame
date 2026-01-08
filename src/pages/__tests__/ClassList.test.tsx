import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ClassList from "../ClassList";
import * as ClassContext from "../../components/class/ClassContext";
import type { Class } from "../../components/class/ClassTypes";
import type { PaginationMeta } from "../../types/api";
import type { ClassContextType } from "../../components/class/ClassContext";

// Mock ClassContext
vi.mock("../../components/class/ClassContext", () => ({
  useClasses: vi.fn(),
}));

const mockClasses: Class[] = [
  {
    id: "1",
    name: "Turma Manhã",
    days: [1, 3, 5],
    startTime: "08:00",
    durationMinutes: 60,
    isActive: true,
    teacher: {
      id: "teacher-1",
      name: "Professor João",
    },
  },
  {
    id: "2",
    name: "Turma Noite",
    days: [2, 4],
    startTime: "19:00",
    durationMinutes: 90,
    isActive: false,
    teacher: {
      id: "teacher-1",
      name: "Professor João",
    },
  },
];

const renderClassList = () => {
  return render(
    <BrowserRouter>
      <ClassList />
    </BrowserRouter>,
  );
};

const createMockContext = (
  overrides: Partial<ClassContextType> = {},
): ClassContextType => ({
  classes: [],
  meta: undefined,
  page: 1,
  limit: 12,
  includeInactive: false,
  setPage: vi.fn(),
  setLimit: vi.fn(),
  setIncludeInactive: vi.fn(),
  refreshClasses: vi.fn(),
  isLoading: false,
  error: undefined,
  ...overrides,
});

describe("ClassList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render page title", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(createMockContext());

    renderClassList();
    expect(screen.getByText("Turmas")).toBeInTheDocument();
  });

  it("should show loading skeletons when isLoading is true", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({ isLoading: true }),
    );

    const { container } = renderClassList();
    const skeletons = container.querySelectorAll(".animate-pulse");

    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should display error message when error exists", () => {
    const mockError = new Error("Network error");

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({ error: mockError }),
    );

    renderClassList();
    expect(screen.getByText("Erro ao carregar turmas")).toBeInTheDocument();
  });

  it("should display classes when loaded", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({ classes: mockClasses }),
    );

    renderClassList();
    expect(screen.getByText("Turma Manhã")).toBeInTheDocument();
    expect(screen.getByText("Turma Noite")).toBeInTheDocument();
  });

  it("should show empty state when no classes", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({ classes: [] }),
    );

    renderClassList();
    expect(
      screen.getByText("Nenhuma turma cadastrada ainda"),
    ).toBeInTheDocument();
  });

  it("should display pagination when meta is available", () => {
    const mockMeta: PaginationMeta = {
      total: 20,
      page: 1,
      totalPages: 2,
      limit: 12,
    };

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        classes: mockClasses,
        meta: mockMeta,
      }),
    );

    renderClassList();
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
    expect(screen.getByText(/20/)).toBeInTheDocument();
  });

  it("should call setPage when clicking next page", async () => {
    const user = userEvent.setup();
    const mockSetPage = vi.fn();

    const mockMeta: PaginationMeta = {
      total: 20,
      page: 1,
      totalPages: 2,
      limit: 12,
    };

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        classes: mockClasses,
        meta: mockMeta,
        setPage: mockSetPage,
      }),
    );

    renderClassList();

    const nextButton = screen.getByText("→");
    await user.click(nextButton);

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("should call setPage when clicking previous page", async () => {
    const user = userEvent.setup();
    const mockSetPage = vi.fn();

    const mockMeta: PaginationMeta = {
      total: 20,
      page: 2,
      totalPages: 2,
      limit: 12,
    };

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        classes: mockClasses,
        meta: mockMeta,
        page: 2,
        setPage: mockSetPage,
      }),
    );

    renderClassList();

    const prevButton = screen.getByText("←");
    await user.click(prevButton);

    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it("should disable previous button on first page", () => {
    const mockMeta: PaginationMeta = {
      total: 20,
      page: 1,
      totalPages: 2,
      limit: 12,
    };

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        classes: mockClasses,
        meta: mockMeta,
      }),
    );

    renderClassList();

    const prevButton = screen.getByText("←");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    const mockMeta: PaginationMeta = {
      total: 20,
      page: 2,
      totalPages: 2,
      limit: 12,
    };

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        classes: mockClasses,
        meta: mockMeta,
        page: 2,
      }),
    );

    renderClassList();

    const nextButton = screen.getByText("→");
    expect(nextButton).toBeDisabled();
  });

  it("should call setLimit when changing items per page", async () => {
    const user = userEvent.setup();
    const mockSetLimit = vi.fn();

    const mockMeta: PaginationMeta = {
      total: 20,
      page: 1,
      totalPages: 2,
      limit: 12,
    };

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        classes: mockClasses,
        meta: mockMeta,
        setLimit: mockSetLimit,
      }),
    );

    renderClassList();

    const select = screen.getByLabelText("Por página:");
    await user.selectOptions(select, "18");

    expect(mockSetLimit).toHaveBeenCalledWith(18);
  });

  it("should render includeInactive filter checkbox", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(createMockContext());

    renderClassList();

    expect(screen.getByText("Incluir turmas inativas")).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("should call setIncludeInactive when toggling filter", async () => {
    const user = userEvent.setup();
    const mockSetIncludeInactive = vi.fn();

    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        setIncludeInactive: mockSetIncludeInactive,
      }),
    );

    renderClassList();

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(mockSetIncludeInactive).toHaveBeenCalledWith(true);
  });

  it("should show checkbox as checked when includeInactive is true", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        includeInactive: true,
      }),
    );

    renderClassList();

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("should show checkbox as unchecked when includeInactive is false", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        includeInactive: false,
      }),
    );

    renderClassList();

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it("should display active and inactive classes correctly", () => {
    vi.mocked(ClassContext.useClasses).mockReturnValue(
      createMockContext({
        classes: mockClasses,
      }),
    );

    renderClassList();

    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByText("Inativa")).toBeInTheDocument();
  });
});
