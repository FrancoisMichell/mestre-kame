import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StudentCard from "../StudentCard";
import type { Student } from "../StudentTypes";

describe("StudentCard", () => {
  const mockActiveStudent: Student = {
    id: "2023001",
    name: "João Silva",
    birthday: "2000-05-15",
    email: "joao@example.com",
    isActive: true,
    belt: "azul",
    trainingSince: "2022-01-10",
    color: "#2563eb",
  };

  const mockInactiveStudent: Student = {
    id: "2023002",
    name: "Maria Santos",
    birthday: "1998-03-20",
    email: "maria@example.com",
    isActive: false,
    belt: "verde",
    trainingSince: "2021-06-15",
    color: "#16a34a",
  };

  it("renders student name and id", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/joão silva/i)).toBeDefined();
    expect(screen.getByText(/2023001/i)).toBeDefined();
  });

  it("displays belt information", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/faixa:/i)).toBeDefined();
    expect(screen.getByText(/azul/i)).toBeDefined();
  });

  it("displays birthday in Brazilian format", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/aniversário:/i)).toBeDefined();
    expect(screen.getByText(/14\/05\/2000/i)).toBeDefined();
  });

  it("displays training start date in Brazilian format", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/treina desde:/i)).toBeDefined();
    expect(screen.getByText(/09\/01\/2022/i)).toBeDefined();
  });

  it('shows "Ativo" status for active students', () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/ativo/i)).toBeDefined();
  });

  it('shows "Inativo" status for inactive students', () => {
    render(<StudentCard student={mockInactiveStudent} />);

    expect(screen.getByText(/inativo/i)).toBeDefined();
  });

  it("renders avatar image with correct src", () => {
    render(<StudentCard student={mockActiveStudent} />);

    const avatar = screen.getByAltText(
      /foto de joão silva/i,
    ) as HTMLImageElement;
    expect(avatar).toBeDefined();
    expect(avatar.src).toContain("ui-avatars.com");
    expect(avatar.src).toContain("name=Jo");
  });

  it("applies correct border color based on belt", () => {
    const { container } = render(<StudentCard student={mockActiveStudent} />);

    const card = container.firstChild as HTMLElement;
    expect(card).toBeDefined();
    expect(card.style.borderLeftColor).toBe("#2563eb");
  });

  it("applies green background for active status", () => {
    render(<StudentCard student={mockActiveStudent} />);

    const statusBadge = screen.getByText(/ativo/i);
    expect(statusBadge.className).toContain("bg-green-100");
    expect(statusBadge.className).toContain("text-green-700");
  });

  it("applies red background for inactive status", () => {
    render(<StudentCard student={mockInactiveStudent} />);

    const statusBadge = screen.getByText(/inativo/i);
    expect(statusBadge.className).toContain("bg-red-100");
    expect(statusBadge.className).toContain("text-red-700");
  });

  it("handles null birthday gracefully", () => {
    const studentWithNullBirthday: Student = {
      ...mockActiveStudent,
      birthday: null,
    };

    render(<StudentCard student={studentWithNullBirthday} />);

    // Verifica que renderiza sem erro
    expect(screen.getByText(/joão silva/i)).toBeDefined();
  });

  it("handles null trainingSince gracefully", () => {
    const studentWithNullTraining: Student = {
      ...mockActiveStudent,
      trainingSince: null,
    };

    render(<StudentCard student={studentWithNullTraining} />);

    // Verifica que renderiza sem erro
    expect(screen.getByText(/joão silva/i)).toBeDefined();
  });

  it("displays belt color with correct styling", () => {
    render(<StudentCard student={mockActiveStudent} />);

    const beltText = screen.getByText(/azul/i);
    expect(beltText).toBeDefined();

    // Verifica que tem estilo inline com a cor
    const styledElement = beltText as HTMLElement;
    expect(styledElement.style.color).toBe("#2563eb");
    expect(styledElement.style.fontWeight).toBe("bold");
    expect(styledElement.style.textTransform).toBe("capitalize");
  });
});
