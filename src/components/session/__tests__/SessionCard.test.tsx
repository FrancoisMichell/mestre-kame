import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SessionCard from "../SessionCard";
import type { ClassSession } from "../SessionTypes";

describe("SessionCard", () => {
  const mockSession: ClassSession = {
    id: "session-1",
    date: "2026-02-10",
    startTime: "18:30",
    endTime: "20:00",
    notes: "Test session",
    classId: "1",
    teacherId: "teacher-1",
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  };

  it("should render session information", () => {
    render(<SessionCard session={mockSession} />);

    expect(screen.getByText(/10\/02\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/18:30 - 20:00/)).toBeInTheDocument();
    expect(screen.getByText("Test session")).toBeInTheDocument();
  });

  it("should display scheduled status for future sessions", () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText("Agendada")).toBeInTheDocument();
  });

  it("should display in-progress status when started", () => {
    const startedSession: ClassSession = {
      ...mockSession,
      startedAt: "2026-02-10T18:30:00Z",
    };

    render(<SessionCard session={startedSession} />);
    expect(screen.getByText("Em Andamento")).toBeInTheDocument();
  });

  it("should display completed status when ended", () => {
    const completedSession: ClassSession = {
      ...mockSession,
      startedAt: "2026-02-10T18:30:00Z",
      endedAt: "2026-02-10T20:00:00Z",
    };

    render(<SessionCard session={completedSession} />);
    expect(screen.getByText("Concluída")).toBeInTheDocument();
  });

  it("should display cancelled status when inactive", () => {
    const cancelledSession: ClassSession = {
      ...mockSession,
      isActive: false,
    };

    render(<SessionCard session={cancelledSession} />);
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
  });

  it("should show start button for today's sessions", () => {
    const today = new Date().toISOString().split("T")[0];
    const todaySession: ClassSession = {
      ...mockSession,
      date: today,
    };

    const onStart = vi.fn();
    render(<SessionCard session={todaySession} onStart={onStart} />);

    const startButton = screen.getByText("Iniciar Aula");
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);
    expect(onStart).toHaveBeenCalledWith(todaySession.id);
  });

  it("should show end button for started sessions", () => {
    const startedSession: ClassSession = {
      ...mockSession,
      startedAt: "2026-02-10T18:30:00Z",
    };

    const onEnd = vi.fn();
    render(<SessionCard session={startedSession} onEnd={onEnd} />);

    const endButton = screen.getByText("Finalizar Aula");
    expect(endButton).toBeInTheDocument();

    fireEvent.click(endButton);
    expect(onEnd).toHaveBeenCalledWith(startedSession.id);
  });

  it("should call onClick when card is clicked", () => {
    const onClick = vi.fn();
    render(<SessionCard session={mockSession} onClick={onClick} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledWith(mockSession.id);
  });

  it("should not call onClick when action buttons are clicked", () => {
    const today = new Date().toISOString().split("T")[0];
    const todaySession: ClassSession = {
      ...mockSession,
      date: today,
    };

    const onClick = vi.fn();
    const onStart = vi.fn();
    render(
      <SessionCard
        session={todaySession}
        onClick={onClick}
        onStart={onStart}
      />,
    );

    const startButton = screen.getByText("Iniciar Aula");
    fireEvent.click(startButton);

    expect(onStart).toHaveBeenCalledWith(todaySession.id);
    expect(onClick).not.toHaveBeenCalled();
  });
});
