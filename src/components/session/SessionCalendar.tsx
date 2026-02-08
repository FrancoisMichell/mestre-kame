import type React from "react";
import { useState, useMemo } from "react";
import type { ClassSession } from "./SessionTypes";
import SessionCard from "./SessionCard";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

export interface SessionCalendarProps {
  sessions: ClassSession[];
  isLoading?: boolean;
  onSessionStart?: (sessionId: string) => void;
  onSessionEnd?: (sessionId: string) => void;
  onSessionClick?: (sessionId: string) => void;
  onCreateSession?: () => void;
}

const SessionCalendar: React.FC<SessionCalendarProps> = ({
  sessions,
  isLoading = false,
  onSessionStart,
  onSessionEnd,
  onSessionClick,
  onCreateSession,
}) => {
  const [viewMode, setViewMode] = useState<"list" | "week" | "month">("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped = new Map<string, ClassSession[]>();
    sessions.forEach((session) => {
      const date = session.date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)?.push(session);
    });
    // Sort sessions within each date by start time
    grouped.forEach((sessionList) => {
      sessionList.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  }, [sessions]);

  // Get sorted dates
  const sortedDates = useMemo(() => {
    return Array.from(sessionsByDate.keys()).sort();
  }, [sessionsByDate]);

  // Filter sessions based on view mode
  const filteredDates = useMemo(() => {
    if (viewMode === "list") {
      return sortedDates;
    }

    // For week/month view, filter by selected date range
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    if (viewMode === "week") {
      // Get start of week (Sunday)
      start.setDate(start.getDate() - start.getDay());
      end.setDate(start.getDate() + 6);
    } else if (viewMode === "month") {
      // Get start and end of month
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return sortedDates.filter((dateStr) => {
      // Parse date as local timezone to avoid timezone conversion issues
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date >= start && date <= end;
    });
  }, [sortedDates, viewMode, selectedDate]);

  // Format date for display
  const formatDate = (dateStr: string): string => {
    // Parse date as local timezone to avoid timezone conversion issues
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Hoje";
    }
    if (date.getTime() === tomorrow.getTime()) {
      return "Amanhã";
    }

    const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
    const dateFormatted = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} - ${dateFormatted}`;
  };

  // Navigate dates
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  // Get current period label
  const getPeriodLabel = (): string => {
    if (viewMode === "list") {
      return "Todas as Aulas";
    }
    if (viewMode === "week") {
      const start = new Date(selectedDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;
    }
    return selectedDate.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* View Mode Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "week"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "month"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Mês
          </button>
        </div>

        {/* Period Navigation */}
        {viewMode !== "list" && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Período anterior"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-900 min-w-[150px] text-center">
              {getPeriodLabel()}
            </span>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Próximo período"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Create Button */}
        {onCreateSession && (
          <button
            onClick={onCreateSession}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
          >
            + Nova Aula
          </button>
        )}
      </div>

      {/* Sessions List */}
      {filteredDates.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          title="Nenhuma aula encontrada"
          description={
            viewMode === "list"
              ? "Crie a primeira aula para começar."
              : "Não há aulas agendadas para este período."
          }
        />
      ) : (
        <div className="space-y-6">
          {filteredDates.map((dateStr) => {
            const dateSessions = sessionsByDate.get(dateStr) || [];
            return (
              <div key={dateStr}>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 sticky top-0 bg-white py-2 z-10">
                  {formatDate(dateStr)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onStart={onSessionStart}
                      onEnd={onSessionEnd}
                      onClick={onSessionClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionCalendar;
