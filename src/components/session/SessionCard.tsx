import type React from "react";
import type { ClassSession } from "./SessionTypes";
import {
  getSessionStatus,
  formatSessionDateTime,
  canStartSession,
  canEndSession,
} from "./SessionTypes";

export interface SessionCardProps {
  session: ClassSession;
  onStart?: (sessionId: string) => void;
  onEnd?: (sessionId: string) => void;
  onClick?: (sessionId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onStart,
  onEnd,
  onClick,
}) => {
  const status = getSessionStatus(session);

  // Status colors
  const statusConfig = {
    scheduled: {
      color: "bg-blue-100 text-blue-800",
      label: "Agendada",
    },
    "in-progress": {
      color: "bg-green-100 text-green-800",
      label: "Em Andamento",
    },
    completed: {
      color: "bg-gray-100 text-gray-800",
      label: "Concluída",
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      label: "Cancelada",
    },
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStart) {
      onStart(session.id);
    }
  };

  const handleEndClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnd) {
      onEnd(session.id);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(session.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleCardClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          handleCardClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            Aula {formatSessionDateTime(session)}
          </h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}
        >
          {statusConfig[status].label}
        </span>
      </div>

      {/* Session Info */}
      <div className="space-y-2 mb-3">
        {/* Time */}
        <div className="flex items-center text-sm">
          <svg
            className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-gray-700">
            {session.startTime} - {session.endTime}
          </span>
        </div>

        {/* Notes (if any) */}
        {session.notes && (
          <div className="flex items-start text-sm">
            <svg
              className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-gray-700">{session.notes}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {(canStartSession(session) || canEndSession(session)) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          {canStartSession(session) && onStart && (
            <button
              onClick={handleStartClick}
              className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Iniciar Aula
            </button>
          )}
          {canEndSession(session) && onEnd && (
            <button
              onClick={handleEndClick}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Finalizar Aula
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionCard;
