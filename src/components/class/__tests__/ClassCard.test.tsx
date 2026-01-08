import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ClassCard from "../ClassCard";
import type { Class } from "../ClassTypes";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ClassCard", () => {
  const mockActiveClass: Class = {
    id: "1",
    name: "Turma Manhã",
    days: [1, 3, 5], // Segunda, Quarta, Sexta
    startTime: "08:00",
    durationMinutes: 60,
    isActive: true,
    teacher: {
      id: "teacher-1",
      name: "Professor João",
    },
  };

  const mockInactiveClass: Class = {
    id: "2",
    name: "Turma Noite",
    days: [2, 4], // Terça, Quinta
    startTime: "19:00",
    durationMinutes: 90,
    isActive: false,
    teacher: {
      id: "teacher-1",
      name: "Professor João",
    },
  };

  it("renders class name", () => {
    renderWithRouter(<ClassCard classItem={mockActiveClass} />);

    expect(screen.getByText("Turma Manhã")).toBeInTheDocument();
  });

  it('shows "Ativa" status for active classes', () => {
    renderWithRouter(<ClassCard classItem={mockActiveClass} />);

    expect(screen.getByText("Ativa")).toBeInTheDocument();
  });

  it('shows "Inativa" status for inactive classes', () => {
    renderWithRouter(<ClassCard classItem={mockInactiveClass} />);

    expect(screen.getByText("Inativa")).toBeInTheDocument();
  });

  it("displays formatted days", () => {
    renderWithRouter(<ClassCard classItem={mockActiveClass} />);

    expect(screen.getByText(/seg, qua, sex/i)).toBeInTheDocument();
  });

  it("displays start time", () => {
    renderWithRouter(<ClassCard classItem={mockActiveClass} />);

    expect(screen.getByText(/08:00/)).toBeInTheDocument();
  });

  it("displays duration in minutes", () => {
    renderWithRouter(<ClassCard classItem={mockActiveClass} />);

    expect(screen.getByText(/1h/i)).toBeInTheDocument();
  });

  it("displays duration in hours and minutes when >= 60 minutes", () => {
    renderWithRouter(<ClassCard classItem={mockInactiveClass} />);

    expect(screen.getByText(/1h30min/i)).toBeInTheDocument();
  });

  it("applies green color for active class status badge", () => {
    const { container } = renderWithRouter(
      <ClassCard classItem={mockActiveClass} />,
    );

    const badge = container.querySelector(".bg-green-100");
    expect(badge).toBeInTheDocument();
  });

  it("applies red color for inactive class status badge", () => {
    const { container } = renderWithRouter(
      <ClassCard classItem={mockInactiveClass} />,
    );

    const badge = container.querySelector(".bg-gray-100");
    expect(badge).toBeInTheDocument();
  });

  it("shows clock icon for time", () => {
    const { container } = renderWithRouter(
      <ClassCard classItem={mockActiveClass} />,
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("handles single day correctly", () => {
    const singleDayClass: Class = {
      ...mockActiveClass,
      days: [0], // Domingo
    };

    renderWithRouter(<ClassCard classItem={singleDayClass} />);

    expect(screen.getByText(/dom/i)).toBeInTheDocument();
  });

  it("handles all days of week", () => {
    const allDaysClass: Class = {
      ...mockActiveClass,
      days: [0, 1, 2, 3, 4, 5, 6],
    };

    renderWithRouter(<ClassCard classItem={allDaysClass} />);

    expect(
      screen.getByText(/dom, seg, ter, qua, qui, sex, sáb/i),
    ).toBeInTheDocument();
  });
});
