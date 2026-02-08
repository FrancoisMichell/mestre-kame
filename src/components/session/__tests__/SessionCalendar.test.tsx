import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SessionCalendar from "../SessionCalendar";
import type { ClassSession } from "../SessionTypes";

describe("SessionCalendar", () => {
  const mockSessions: ClassSession[] = [
    {
      id: "session-1",
      date: "2026-02-10",
      startTime: "18:30",
      endTime: "20:00",
      notes: "Session 1",
      classId: "1",
      teacherId: "teacher-1",
      isActive: true,
      createdAt: "2026-02-01T10:00:00Z",
      updatedAt: "2026-02-01T10:00:00Z",
    },
    {
      id: "session-2",
      date: "2026-02-12",
      startTime: "18:30",
      endTime: "20:00",
      notes: "Session 2",
      classId: "1",
      teacherId: "teacher-1",
      isActive: true,
      createdAt: "2026-02-01T10:00:00Z",
      updatedAt: "2026-02-01T10:00:00Z",
    },
    {
      id: "session-3",
      date: "2026-02-08",
      startTime: "09:00",
      endTime: "10:30",
      notes: "Session 3",
      classId: "2",
      teacherId: "teacher-1",
      isActive: true,
      createdAt: "2026-02-05T10:00:00Z",
      updatedAt: "2026-02-05T10:00:00Z",
    },
  ];

  it("should render loading state", () => {
    render(<SessionCalendar sessions={[]} isLoading={true} />);
    expect(
      screen.getByText(
        (_, element) => element?.className?.includes("animate-spin") ?? false,
      ),
    ).toBeInTheDocument();
  });

  it("should render empty state when no sessions", () => {
    render(<SessionCalendar sessions={[]} />);
    expect(screen.getByText("Nenhuma aula encontrada")).toBeInTheDocument();
  });

  it("should render sessions grouped by date", () => {
    render(<SessionCalendar sessions={mockSessions} />);

    // Should show all sessions
    expect(screen.getByText("Session 1")).toBeInTheDocument();
    expect(screen.getByText("Session 2")).toBeInTheDocument();
    expect(screen.getByText("Session 3")).toBeInTheDocument();
  });

  it("should switch between view modes", () => {
    render(<SessionCalendar sessions={mockSessions} />);

    const weekButton = screen.getByText("Semana");
    const monthButton = screen.getByText("Mês");
    const listButton = screen.getByText("Lista");

    // Default is list view
    expect(listButton.className).toContain("bg-white");

    // Switch to week view
    fireEvent.click(weekButton);
    expect(weekButton.className).toContain("bg-white");

    // Switch to month view
    fireEvent.click(monthButton);
    expect(monthButton.className).toContain("bg-white");
  });

  it("should show create button when onCreateSession is provided", () => {
    const onCreateSession = vi.fn();
    render(
      <SessionCalendar
        sessions={mockSessions}
        onCreateSession={onCreateSession}
      />,
    );

    const createButton = screen.getByText("+ Nova Aula");
    expect(createButton).toBeInTheDocument();

    fireEvent.click(createButton);
    expect(onCreateSession).toHaveBeenCalled();
  });

  it("should navigate between periods in week view", () => {
    render(<SessionCalendar sessions={mockSessions} />);

    // Switch to week view
    fireEvent.click(screen.getByText("Semana"));

    const prevButton = screen.getByLabelText("Período anterior");
    const nextButton = screen.getByLabelText("Próximo período");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
  });

  it("should navigate between periods in month view", () => {
    render(<SessionCalendar sessions={mockSessions} />);

    // Switch to month view
    fireEvent.click(screen.getByText("Mês"));

    const prevButton = screen.getByLabelText("Período anterior");
    const nextButton = screen.getByLabelText("Próximo período");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
  });

  it("should not show navigation in list view", () => {
    render(<SessionCalendar sessions={mockSessions} />);

    // List view is default
    expect(screen.queryByLabelText("Período anterior")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Próximo período")).not.toBeInTheDocument();
  });

  it("should pass callbacks to SessionCard", () => {
    const today = new Date().toISOString().split("T")[0];
    const todaySession: ClassSession = {
      ...mockSessions[0],
      date: today,
    };

    const onStart = vi.fn();
    const onEnd = vi.fn();
    const onClick = vi.fn();

    render(
      <SessionCalendar
        sessions={[todaySession]}
        onSessionStart={onStart}
        onSessionEnd={onEnd}
        onSessionClick={onClick}
      />,
    );

    // Session card should be rendered
    expect(screen.getByText("Session 1")).toBeInTheDocument();
  });
});
