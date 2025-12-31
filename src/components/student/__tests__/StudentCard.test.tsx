import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import StudentCard from "../StudentCard";
import type { Student } from "../StudentTypes";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("StudentCard", () => {
  const mockActiveStudent: Student = {
    id: "2023001",
    name: "João Silva",
    birthday: "2000-05-15",
    registry: "321123",
    isActive: true,
    belt: "blue",
    trainingSince: "2022-01-10",
    color: "#2563eb",
  };

  const mockInactiveStudent: Student = {
    id: "2023002",
    name: "Maria Santos",
    birthday: "1998-03-20",
    registry: "654321",
    isActive: false,
    belt: "green",
    trainingSince: "2021-06-15",
    color: "#16a34a",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders student name and registry", () => {
    renderWithRouter(<StudentCard student={mockActiveStudent} />);

    expect(screen.getAllByText(/joão silva/i)[0]).toBeDefined();
    expect(screen.getAllByText(/321123/i)[0]).toBeDefined();
  });

  it("displays belt information", () => {
    renderWithRouter(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/faixa:/i)).toBeDefined();
    expect(screen.getAllByText(/azul/i)[0]).toBeDefined();
  });

  it("displays birthday in Brazilian format", () => {
    renderWithRouter(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/aniversário:/i)).toBeDefined();
    const birthdayElements = screen.getAllByText(/15\/05\/2000/i);
    expect(birthdayElements.length).toBeGreaterThan(0);
  });

  it("displays training start date in Brazilian format", () => {
    renderWithRouter(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/treina desde:/i)).toBeDefined();
    const trainingElements = screen.getAllByText(/10\/01\/2022/i);
    expect(trainingElements.length).toBeGreaterThan(0);
  });

  it('shows "Ativo" status for active students', () => {
    renderWithRouter(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/ativo/i)).toBeDefined();
  });

  it('shows "Inativo" status for inactive students', () => {
    renderWithRouter(<StudentCard student={mockInactiveStudent} />);

    expect(screen.getByText(/inativo/i)).toBeDefined();
  });

  it("renders avatar image with correct src", () => {
    renderWithRouter(<StudentCard student={mockActiveStudent} />);

    const avatar = screen.getByAltText(
      /foto de joão silva/i,
    ) as HTMLImageElement;
    expect(avatar).toBeDefined();
    expect(avatar.src).toContain("ui-avatars.com");
    expect(avatar.src).toContain("Silva");
  });

  it("applies correct border color based on belt", () => {
    const { container } = renderWithRouter(
      <StudentCard student={mockActiveStudent} />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toBeDefined();
    // Navegadores podem retornar hexadecimal ou RGB
    const borderColor = card.style.borderLeftColor;
    expect(
      borderColor === "#2563eb" || borderColor === "rgb(37, 99, 235)",
    ).toBe(true);
  });

  it("applies green background for active status", () => {
    const { container } = renderWithRouter(
      <StudentCard student={mockActiveStudent} />,
    );

    const statusBadge = container.querySelector(".bg-green-100");
    expect(statusBadge).toBeDefined();
    expect(statusBadge?.className).toContain("text-green-700");
  });

  it("applies red background for inactive status", () => {
    const { container } = renderWithRouter(
      <StudentCard student={mockInactiveStudent} />,
    );

    const statusBadge = container.querySelector(".bg-red-100");
    expect(statusBadge).toBeDefined();
    expect(statusBadge?.className).toContain("text-red-700");
  });

  it("handles null birthday gracefully", () => {
    const studentWithNullBirthday: Student = {
      ...mockActiveStudent,
      birthday: null,
    };

    renderWithRouter(<StudentCard student={studentWithNullBirthday} />);

    expect(screen.getAllByText(/joão silva/i)[0]).toBeDefined();
    expect(screen.getByText(/n\/a/i)).toBeDefined();
  });

  it("handles null trainingSince gracefully", () => {
    const studentWithNullTraining: Student = {
      ...mockActiveStudent,
      trainingSince: null,
    };

    renderWithRouter(<StudentCard student={studentWithNullTraining} />);

    expect(screen.getAllByText(/joão silva/i)[0]).toBeDefined();
    expect(screen.getByText(/n\/a/i)).toBeDefined();
  });

  it("displays belt color with correct styling", () => {
    renderWithRouter(<StudentCard student={mockActiveStudent} />);

    const beltTexts = screen.getAllByText(/azul/i);
    expect(beltTexts.length).toBeGreaterThan(0);

    const styledElement = beltTexts[0] as HTMLElement;
    // Navegadores podem retornar hexadecimal ou RGB
    const color = styledElement.style.color;
    expect(color === "#2563eb" || color === "rgb(37, 99, 235)").toBe(true);
  });

  it("displays all belt names correctly in Portuguese", () => {
    const belts: Array<{ belt: Student["belt"]; name: string }> = [
      { belt: "white", name: "branca" },
      { belt: "yellow", name: "amarela" },
      { belt: "orange", name: "laranja" },
      { belt: "green", name: "verde" },
      { belt: "blue", name: "azul" },
      { belt: "brown", name: "marrom" },
      { belt: "black", name: "preta" },
    ];

    belts.forEach(({ belt, name }) => {
      const student = { ...mockActiveStudent, belt };
      const { unmount } = renderWithRouter(<StudentCard student={student} />);

      const beltTexts = screen.getAllByText(new RegExp(name, "i"));
      expect(beltTexts.length).toBeGreaterThan(0);

      unmount();
    });
  });

  it("navigates to edit page when clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(
      <StudentCard student={mockActiveStudent} />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toBeDefined();

    if (card) {
      await user.click(card);
      expect(mockNavigate).toHaveBeenCalledWith("/aluno/2023001");
    }
  });

  it("is clickable with hover effects", () => {
    const { container } = renderWithRouter(
      <StudentCard student={mockActiveStudent} />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("hover:-translate-y-0.5");
    expect(card.className).toContain("hover:shadow-lg");
  });
});
