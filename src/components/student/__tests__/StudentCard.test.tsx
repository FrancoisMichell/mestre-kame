import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StudentCard from "../StudentCard";
import type { Student } from "../StudentTypes";

describe("StudentCard", () => {
  const mockActiveStudent: Student = {
    id: "2023001",
    name: "João Silva",
    birthday: "2000-05-15",
    registry: "321123",
    isActive: true,
    belt: "Blue",
    trainingSince: "2022-01-10",
    color: "#2563eb",
  };

  const mockInactiveStudent: Student = {
    id: "2023002",
    name: "Maria Santos",
    birthday: "1998-03-20",
    registry: "654321",
    isActive: false,
    belt: "Green",
    trainingSince: "2021-06-15",
    color: "#16a34a",
  };

  it("renders student name and registry", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/joão silva/i)).toBeDefined();
    expect(screen.getByText(/321123/i)).toBeDefined();
  });

  it("displays belt information", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/faixa:/i)).toBeDefined();
    expect(screen.getByText(/azul/i)).toBeDefined();
  });

  it("displays birthday in Brazilian format", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/aniversário:/i)).toBeDefined();
    expect(screen.getByText(/15\/05\/2000/i)).toBeDefined();
  });

  it("displays training start date in Brazilian format", () => {
    render(<StudentCard student={mockActiveStudent} />);

    expect(screen.getByText(/treina desde:/i)).toBeDefined();
    expect(screen.getByText(/10\/01\/2022/i)).toBeDefined();
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
    expect(avatar.src).toContain("Silva");
  });

  it("applies correct border color based on belt", () => {
    const { container } = render(<StudentCard student={mockActiveStudent} />);

    const card = container.firstChild as HTMLElement;
    expect(card).toBeDefined();
    // Navegadores podem retornar hexadecimal ou RGB
    const borderColor = card.style.borderLeftColor;
    expect(
      borderColor === "#2563eb" || borderColor === "rgb(37, 99, 235)",
    ).toBe(true);
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

    expect(screen.getByText(/joão silva/i)).toBeDefined();
    expect(screen.getByText(/n\/a/i)).toBeDefined();
  });

  it("handles null trainingSince gracefully", () => {
    const studentWithNullTraining: Student = {
      ...mockActiveStudent,
      trainingSince: null,
    };

    render(<StudentCard student={studentWithNullTraining} />);

    expect(screen.getByText(/joão silva/i)).toBeDefined();
    expect(screen.getByText(/n\/a/i)).toBeDefined();
  });

  it("displays belt color with correct styling", () => {
    render(<StudentCard student={mockActiveStudent} />);

    const beltText = screen.getByText(/azul/i);
    expect(beltText).toBeDefined();

    const styledElement = beltText as HTMLElement;
    // Navegadores podem retornar hexadecimal ou RGB
    const color = styledElement.style.color;
    expect(color === "#2563eb" || color === "rgb(37, 99, 235)").toBe(true);
    expect(styledElement.style.fontWeight).toBe("bold");
    expect(styledElement.style.textTransform).toBe("capitalize");
  });

  it("displays all belt names correctly in Portuguese", () => {
    const belts: Array<{ belt: Student["belt"]; name: string }> = [
      { belt: "White", name: "branca" },
      { belt: "Yellow", name: "amarela" },
      { belt: "Orange", name: "laranja" },
      { belt: "Green", name: "verde" },
      { belt: "Blue", name: "azul" },
      { belt: "Brown", name: "marrom" },
      { belt: "Black", name: "preta" },
    ];

    belts.forEach(({ belt, name }) => {
      const student = { ...mockActiveStudent, belt };
      const { unmount } = render(<StudentCard student={student} />);

      expect(screen.getByText(new RegExp(name, "i"))).toBeDefined();

      unmount();
    });
  });
});
